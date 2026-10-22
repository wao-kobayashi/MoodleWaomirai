// ファイルの最初に追加
process.argv.push('--no-deprecation');

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const pugbem = require('gulp-pugbem');
const sass = require('gulp-sass')(require('sass')); // sassを最新に更新
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
const rename = require('gulp-rename');
const fs = require('fs').promises;
const replace = require('gulp-replace');
const path = require('path');
const { spawn } = require('child_process');
const concat = require('gulp-concat');  

// パスの設定
const srcpaths = {
    scss: './src/**/*.scss',
    js: './src/js/**/*.js',
    pug: './src/pug/lms-moodle/**/*.pug'
};

const dstpaths = {
    css: './static/css',
    js: './static/js',
    stg: './moodle-stg',
    lmswaomirai: './moodle-lms'
};

// stg.js と lms.js を分割するタスク（非同期処理を減らし、gulpで同期的に処理）
    
const JS_FILES = [
    'src/js/01_config/assets.js', // 各種変数や画像URL
    'src/js/01_config/checkers.js', // 各種チェック関数（現在のページや持っている教科）
    'src/js/01_config/modal.js', // モーダル作成の共通関数
    'src/js/01_config/urlflag.js', // URLフラグの取得関数
    'src/js/02_pages/page-my-index.js',    // my-index (受講カレンダー)
    'src/js/02_pages/page-my-index-badge.js',    // my-index (受講カレンダーのバッジ)
    'src/js/02_pages/page-login-signup.js', // login-signup (会員登録)
    'src/js/02_pages/page-login-index.js',  // login-index (ログイン画面)
    'src/js/02_pages/page-login-confirm.js', // login-confirm (ログイン画面)
    'src/js/02_pages/page-enrol-index.js',  // enrol-index (購入画面)
    'src/js/02_pages/page-enrol-index-thismonth.js', // enrol-index (今月の授業を日付で自動更新)
    'src/js/02_pages/page-mod-questionnaire-create-lesson.js', // mod-questionnaire (受講ページでのzoom授業生成)
    'src/js/02_pages/page-mod-questionnaire.js', // mod-questionnaire (受講ページ)
    'src/js/02_pages/page-course-index-category.js', // course-index-category （使われていないコース一覧ページ）
    'src/js/02_pages/page-course-view.js', // course-view (コース一覧ページ)
    'src/js/02_pages/page-user-edit.js',   // user-edit (科目変更ページ)
    'src/js/02_pages/page-user-edit-levelchange.js',   // user-edit (科目変更ページのレベル変更)
    'src/js/02_pages/page-user-profile.js',// user-profile (プロフィールページ)
    'src/js/02_pages/page-common.js' // サイト共通のイベント登録
];

async function splitJs(done) {
    try {
        const stgVariableJsContent = await fs.readFile(path.resolve('src/js/00_stg-variable.js'), 'utf8');
        const lmsVariableJsContent = await fs.readFile(path.resolve('src/js/00_lms-variable.js'), 'utf8');

        // stg.js 用
        const stgStream = gulp.src(JS_FILES) 
        .pipe(concat('moodle-combined.js'))
        .pipe(replace(/^/, `${stgVariableJsContent}\n`))
        .pipe(replace(/$/,
            `   }\n` +
            `});`))
        .pipe(rename('stg.js'))
        .pipe(gulp.dest(dstpaths.js));

        // lms.js作成
        const lmsStream = gulp.src(JS_FILES)  
            .pipe(concat('moodle-combined.js'))
            .pipe(replace(/^/, `${lmsVariableJsContent}\n`))
            .pipe(replace(/$/,
                `   }\n` +
                `});`))
            .pipe(rename('lmswaomirai.js'))
            .pipe(gulp.dest(dstpaths.js));

        // 両方の書き出しが終わってから完了にする
        await Promise.all([stgStream, lmsStream].map(stream => new Promise((resolve, reject) => {
            stream.on('finish', resolve).on('error', reject);
        })));
        done();
    } catch (err) {
        console.error('Error reading files:', err);
        done(err);
    }
}



// ローカルサーバーの起動と監視タスク
function serve() {
    browserSync.init({
        server: "./",
        index: "index.html"
    });

    gulp.watch([srcpaths.scss], gulp.series(scss, (done) => {
        browserSync.reload();
        done();
    }));
    
    // パーシャル変更時は stg / lms 両方の全ページを更新
    gulp.watch(['src/pug/lms-moodle/**/_*.pug'], gulp.series(pugMoodle,  (done) => {
        browserSync.reload();
        done();
    }));

    gulp.watch(['src/pug/index.pug','src/pug/index-contact.pug'], gulp.series(pugIndexPage,pugIndexContact,  (done) => {
      browserSync.reload();
      done();
   }));

    gulp.watch(['src/pug/tenant-defaluttenant/**.pug'], gulp.series(pugDefalutTenant, (done) => {
    browserSync.reload();
    done();
    }));
    //単体ファイルの時は単体更新
    gulp.watch(['src/pug/lms-moodle/**/*.pug','!src/pug/lms-moodle/**/_*.pug'])
        .on('change', file => buildPug([file]).on('exit', () => browserSync.reload()))
        .on('add', file => buildPug([file]).on('exit', () => browserSync.reload()));
    gulp.watch(srcpaths.js, gulp.series(splitJs, (done) => {
        browserSync.reload();
        done();
    }));
}

// stg, lms専用のPugタスク（scripts/build-pug.js で並列ビルド）
function buildPug(files = []) {
  return spawn('node', ['scripts/build-pug.js', ...files], { stdio: 'inherit' });
}
function pugMoodle() {
  return buildPug();
}

function pugDefalutTenant() {
    return gulp.src(['src/pug/tenant-defaluttenant/**.pug'])
        .pipe(plumber())
        .pipe(pug({ plugins: [pugbem] }))
        .pipe(gulp.dest("./moodle-defaluttenant")); 
  }

function pugIndexPage() {
  return gulp.src(['src/pug/index.pug'])
      .pipe(plumber())
      .pipe(pug({ plugins: [pugbem] }))
      .pipe(gulp.dest("./")); 
}
function pugIndexContact() {
    return gulp.src(['src/pug/index-contact.pug'])
        .pipe(plumber())
        .pipe(pug({ plugins: [pugbem] }))
        .pipe(gulp.dest("./")); 
  }

// SCSSタスク
function scss() {
    const processors = [cssnext()];
    return gulp.src([srcpaths.scss])
        .pipe(plumber())
        .pipe(
          sass({
              quietDeps: true // Sassの警告を抑制
          }).on('error', sass.logError)
        )
        .pipe(postcss(processors))
        .pipe(gulp.dest(dstpaths.css))
        .pipe(browserSync.stream());
}

// デフォルトタスク
exports.default = gulp.series(scss, pugMoodle, pugIndexPage, pugIndexContact, serve);
exports.scss = scss;
exports.splitJs = splitJs;
exports.pugMoodle = pugMoodle;
exports.pugDefalutTenant = pugDefalutTenant;
exports.pugIndexPage = pugIndexPage;
exports.pugAll = gulp.series(pugMoodle, pugDefalutTenant, pugIndexPage, pugIndexContact);