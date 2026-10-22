// lms-moodle の Pug の include / extends 依存関係を管理するモジュール
// - 起動時に全 Pug を字句解析し「参照先 → 参照元」の逆引きマップを作る
// - 変更されたファイルから逆方向にたどり、再ビルドが必要なページ（_ で始まらない Pug）を返す
// - 起動時用に、出力 HTML より新しいソースを持つページも返せる
// - 安全に特定できない場合は null を返す（呼び出し側で全ページビルドにする）

const fs = require('fs');
const path = require('path');
const lex = require('pug-lexer');

const isPage = (file) => !path.basename(file).startsWith('_');

// Pug 本体と同じルールで include / extends のパスを解決する
// （前後の空白除去、拡張子なしなら .pug を補う、ファイルからの相対パス）
function resolveRef(from, ref) {
    let target = ref.trim();
    if (target.startsWith('/')) return null; // basedir 未設定のため絶対パスは扱わない
    if (path.extname(target) === '') target += '.pug';
    return path.resolve(path.dirname(from), target);
}

// ファイルが参照している Pug を返す。解析できなければ null
function scanRefs(file) {
    try {
        const tokens = lex(fs.readFileSync(file, 'utf8'), { filename: file });
        const refs = new Set();
        tokens.forEach((token, i) => {
            const prev = tokens[i - 1];
            if (token.type !== 'path' || !prev || (prev.type !== 'include' && prev.type !== 'extends')) return;
            const target = resolveRef(file, token.val);
            if (target === null) throw new Error(`絶対パスの参照: ${token.val}`);
            refs.add(target);
        });
        return refs;
    } catch (err) {
        console.warn(`[pug-deps] 解析失敗: ${path.relative(process.cwd(), file)}\n${err.message}`);
        return null;
    }
}

function findPugFiles(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) return findPugFiles(fullPath);
        return entry.name.endsWith('.pug') ? [fullPath] : [];
    });
}

function createPugDeps(srcDir) {
    const refsOf = new Map();     // ファイル → 参照している Pug の Set
    const referrers = new Map();  // 参照先 → 参照元の Set（逆引き）
    const unparsable = new Set(); // 解析に失敗したファイル（1件でもあれば全ページビルド）

    function unlink(file) {
        (refsOf.get(file) || []).forEach((target) => referrers.get(target)?.delete(file));
        refsOf.delete(file);
        unparsable.delete(file);
    }

    function update(file) {
        unlink(file);
        const refs = scanRefs(file);
        if (refs === null) {
            unparsable.add(file);
            return;
        }
        refsOf.set(file, refs);
        refs.forEach((target) => {
            if (!referrers.has(target)) referrers.set(target, new Set());
            referrers.get(target).add(file);
        });
    }

    const root = path.resolve(srcDir);
    findPugFiles(root).forEach(update);

    // 変更（追加・削除を含む）されたファイルの影響を受けるページを返す。特定できなければ null
    function affectedPages(changedFile, { removed = false } = {}) {
        const file = path.resolve(changedFile);
        if (removed) unlink(file); else update(file);
        if (unparsable.size > 0) return null;

        // 変更ファイルから参照元をたどる（循環参照があっても止まるよう visited で管理）
        const visited = new Set([file]);
        const queue = [file];
        while (queue.length > 0) {
            (referrers.get(queue.shift()) || []).forEach((referrer) => {
                if (visited.has(referrer)) return;
                visited.add(referrer);
                queue.push(referrer);
            });
        }
        if (removed) visited.delete(file); // 削除されたページ自体はビルドしない

        return [...visited].filter(isPage).map((f) => path.relative(process.cwd(), f));
    }

    // 出力 HTML より新しいソース（ページ本体と、再帰的に参照している Pug）を持つページを返す
    // outDirs のどれかに出力が無いページも対象。特定できなければ null
    function stalePages(outDirs) {
        if (unparsable.size > 0) return null;
        const mtime = (file, ifMissing) => {
            try { return fs.statSync(file).mtimeMs; } catch { return ifMissing; }
        };

        return [...refsOf.keys()].filter(isPage).filter((page) => {
            const sources = new Set([page]);
            const queue = [page];
            while (queue.length > 0) {
                (refsOf.get(queue.shift()) || []).forEach((ref) => {
                    if (sources.has(ref)) return;
                    sources.add(ref);
                    queue.push(ref);
                });
            }
            // ソースが見つからなければ常に新しい扱い、出力が無ければ常に古い扱い（多めにビルドする側に倒す）
            const newestSource = Math.max(...[...sources].map((f) => mtime(f, Infinity)));
            return outDirs.some((dir) => {
                const out = path.join(dir, path.relative(root, page)).replace(/\.pug$/, '.html');
                return mtime(out, -Infinity) < newestSource;
            });
        }).map((f) => path.relative(process.cwd(), f));
    }

    return { affectedPages, stalePages };
}

module.exports = { createPugDeps };
