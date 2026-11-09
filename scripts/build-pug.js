// lms-moodle の Pug を stg / lms 両方に書き出すスクリプト
// - コンパイル（重い）はページごとに1回だけ行い、env を変えて2回書き出す
// - ページを CPU コア数ぶんの worker に振り分けて並列に処理する
//
// 使い方:
//   node scripts/build-pug.js                 … 全ページ（_ で始まるパーシャルは除く）
//   node scripts/build-pug.js <file.pug> ...  … 指定したページだけ

const { Worker, isMainThread, workerData, parentPort } = require('worker_threads');
const os = require('os');
const fs = require('fs');
const path = require('path');

const SRC = 'src/pug/lms-moodle';
const TARGETS = [
    { env: 'stg', out: 'moodle-stg' },
    { env: 'lmswaomirai', out: 'moodle-lms' }
];

// SRC 以下の .pug を再帰的に集める（_ で始まるパーシャルは除く）
function findPages(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) return findPages(fullPath);
        if (entry.name.endsWith('.pug') && !entry.name.startsWith('_')) return [fullPath];
        return [];
    });
}

if (isMainThread) {
    const files = process.argv.length > 2 ? process.argv.slice(2) : findPages(SRC);
    if (files.length === 0) return;

    // ページを均等に振り分ける
    const n = Math.min(os.availableParallelism(), files.length);
    const chunks = Array.from({ length: n }, (_, i) => files.filter((_, j) => j % n === i));

    let failed = 0;
    chunks.forEach((chunk) => {
        const worker = new Worker(__filename, { workerData: chunk });
        worker.on('message', (count) => { failed += count; });
        worker.on('error', (err) => { console.error(err); failed++; });
    });
    process.on('exit', () => {
        if (failed > 0) {
            console.error(`[build-pug] ${failed} 件のエラー`);
            process.exitCode = 1;
        }
    });
} else {
    const pug = require('pug');
    const pugbem = require('gulp-pugbem');

    let failed = 0;
    for (const file of workerData) {
        try {
            const render = pug.compileFile(file, { plugins: [pugbem] }); // 重い処理：1回だけ
            for (const target of TARGETS) {
                const out = path.join(target.out, path.relative(SRC, file)).replace(/\.pug$/, '.html');
                fs.mkdirSync(path.dirname(out), { recursive: true });
                fs.writeFileSync(out, render({ env: target.env })); // 軽い処理：env ごとに書き出す
            }
        } catch (err) {
            // plumber 相当：1ページ失敗しても他のページは続ける
            console.error(`[build-pug] ${file}\n${err.message}`);
            failed++;
        }
    }
    parentPort.postMessage(failed);
}
