// トップの一覧ページ（src/pug/index.pug）用に、lms-moodle の各ページのメタ情報を集めるモジュール
//
// 各ページ Pug の先頭に、出力されないコメント（//-）でメタ情報を書く:
//   //- @title 1科目購入（哲学）               … 一覧に出すリンク名（無いページは「@title 未設定」に出る）
//   //- @group １科目購入                       … カテゴリ内の小見出し（省略可）
//   //- @link ?params=htmlCopy 哲学（何も買っていない）htmlコピペ用  … クエリ付きの追加リンクとリンク名（複数可）
//   //- @hidden                               … 一覧に出さない
//
// カテゴリ（h3 見出し）はディレクトリから決まる。対応は下の CATEGORIES で管理する。
// カテゴリ内の並び順は src/pug/_page-order.js（目次ファイル）に書いた順。

const fs = require('fs');
const path = require('path');

const SRC = 'src/pug/lms-moodle';
const ORDER_FILE = path.resolve('src/pug/_page-order.js');

// 一覧に出す順番。moodleIds は開発時の検索・画面識別用に表示する Moodle のページID
const CATEGORIES = [
    { dirs: ['signup'], title: 'moodleログイン', moodleIds: '#page-login-signup,#page-login-index' },
    { dirs: ['index'], title: 'ホーム', moodleIds: '#page-index-guest,#page-index-logged-in-purchased,#page-index-logged-in-perchaced' },
    { dirs: ['dashboard'], title: 'ダッシュボード', moodleIds: '#page-my-index' },
    { dirs: ['course-enrol'], title: '科目購入', moodleIds: '#page-enrol-index' },
    { dirs: ['page-course-view-topics'], title: '購入した後の科目ページ（course-view-topics）', moodleIds: '#page-course-view-topics' },
    { dirs: ['path-mod-questionnaire'], title: '授業受講', moodleIds: '#page-mod-questionnaire-view' },
    { dirs: ['page-mod-page-view'], title: '講座の受講ヘルプページ', moodleIds: '' },
    { dirs: ['page-user-edit'], title: '授業レベル設定ロジック', moodleIds: '#page-user-edit' },
    { dirs: ['mypage', 'setting'], title: '設定関連', moodleIds: '#page-mypage,#page-user-setting' }
];
const UNTITLED_GROUP = '@title 未設定';

function findPages(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) return findPages(fullPath);
        return entry.name.endsWith('.pug') && !entry.name.startsWith('_') ? [fullPath] : [];
    });
}

// 先頭の空行と //- コメントだけを読み、@key value を取り出す
function readMeta(file) {
    const meta = { links: [] };
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
        if (line.trim() === '') continue;
        const comment = line.match(/^\/\/-(.*)$/);
        if (!comment) break;
        const tag = comment[1].trim().match(/^@(\w+)\s*(.*)$/);
        if (!tag) continue;
        const [, key, value] = tag;
        if (key === 'link') {
            const [query, ...label] = value.split(/\s+/);
            meta.links.push({ query, label: label.join(' ') });
        } else if (key === 'hidden') {
            meta.hidden = true;
        } else {
            meta[key] = value;
        }
    }
    return meta;
}

// [{ title, moodleIds, groups: [{ name, links: [{ href, label, untitled }] }] }] を返す
function collectPageIndex() {
    // watch 中に目次ファイルが編集されても反映されるよう、毎回読み直す
    delete require.cache[ORDER_FILE];
    const order = require(ORDER_FILE);

    const categories = CATEGORIES.map((c) => ({ ...c, pages: [] }));
    const others = { dirs: [], title: '未分類', moodleIds: '', pages: [] };

    const files = findPages(SRC);
    files.forEach((file) => {
        const meta = readMeta(file);
        if (meta.hidden) return;
        const href = path.relative(SRC, file).split(path.sep).join('/').replace(/\.pug$/, '.html');
        const dir = href.split('/')[0];
        const category = categories.find((c) => c.dirs.includes(dir)) || others;
        category.pages.push({ href, meta, order: order.indexOf(href.replace(/\.html$/, '')) });
    });

    const pagePaths = files.map((file) => path.relative(SRC, file).split(path.sep).join('/').replace(/\.pug$/, ''));
    order.filter((page) => !pagePaths.includes(page)).forEach((page) => {
        console.warn(`[page-index] _page-order.js のページが見つかりません: ${page}`);
    });

    return [...categories, others].filter((c) => c.pages.length > 0).map((category) => {
        // 目次ファイルに無いページはその後ろ、@title が無いページは末尾の「@title 未設定」グループにファイル名で出す
        const rank = (page) => (page.order === -1 ? Infinity : page.order);
        const sorted = category.pages.sort((a, b) =>
            (!a.meta.title - !b.meta.title) ||
            (rank(a) - rank(b)) ||
            a.href.localeCompare(b.href));

        const groups = [];
        sorted.forEach(({ href, meta }) => {
            const name = meta.title ? meta.group || '' : UNTITLED_GROUP;
            let group = groups.find((g) => g.name === name);
            if (!group) groups.push(group = { name, links: [] });
            group.links.push({ href, label: meta.title || href, untitled: !meta.title });
            meta.links.forEach((link) => group.links.push({ href: href + link.query, label: link.label }));
        });
        return { title: category.title, moodleIds: category.moodleIds, groups };
    });
}

module.exports = { collectPageIndex };
