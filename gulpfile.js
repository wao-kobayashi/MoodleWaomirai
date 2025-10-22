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
const data = require('gulp-data');
const path = require('path');
const newer = require('gulp-newer');
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

// 結合するファイルリストを定数で定義（1箇所管理）

// const JS_FILES = [
//             'src/js/moodle.js'
//         ];

// const JS_FILES = [
//         'src/js/01_config.js',                     // config
//         'src/js/02_pages/01_page-my-index.js',    // my-index
//         'src/js/02_pages/02_page-login-signup.js', // login-signup
//     ];
    
const JS_FILES = [
    'src/js/01_config.js',                     // config
    'src/js/02_pages/01_page-my-index.js',    // my-index
    'src/js/02_pages/02_page-login-signup.js', // login-signup
    'src/js/02_pages/03_page-login-index.js',  // login-index
    'src/js/02_pages/04_page-login-confirm.js', // login-confirm
    'src/js/02_pages/05_page-enrol-index.js',  // enrol-index
    'src/js/02_pages/06_page-mod-questionnaire.js', // mod-questionnaire
    'src/js/02_pages/07_page-course-index-category.js', // course-index-category
    'src/js/02_pages/08_page-course-view.js', // course-view
    'src/js/02_pages/09_page-user-edit.js',   // user-edit
    'src/js/02_pages/10_page-user-profile.js',// user-profile
    'src/js/02_pages/99_page-common.js'       // 汎用的なページ関数（どのページでも使うもの）
];

async function splitJs(done) {
    try {
        const stgVariableJsContent = await fs.readFile(path.resolve('src/js/00_stg-variable.js'), 'utf8');
        const lmsVariableJsContent = await fs.readFile(path.resolve('src/js/00_lms-variable.js'), 'utf8');

        // stg.js 用
        gulp.src(JS_FILES)  // ← 共通の配列を使用
        .pipe(concat('moodle-combined.js'))
        .pipe(replace(/^/, `${stgVariableJsContent}\n`))
        .pipe(replace(/$/,
            `   }\n` +
            `});`))
        .pipe(rename('stg.js'))
        .pipe(gulp.dest(dstpaths.js));

        // lms.js作成
        gulp.src(JS_FILES)  // ← 共通の配列を使用
            .pipe(concat('moodle-combined.js'))
            .pipe(replace(/^/, `${lmsVariableJsContent}\n`))
            .pipe(replace(/$/,
                `   }\n` +
                `});`))
            .pipe(rename('lmswaomirai.js'))
            .pipe(gulp.dest(dstpaths.js));

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
    
    gulp.watch(['src/pug/lms-moodle/**/_*.pug'], gulp.series(pugLms,  (done) => {
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
    gulp.watch(['src/pug/lms-moodle/**/*.pug','!src/pug/lms-moodle/**/_*.pug'], gulp.series(pugStgSingle,pugLmsSingle,  (done) => {
        browserSync.reload();
        done();
    }));
    gulp.watch(srcpaths.js, gulp.series(splitJs, (done) => {
        browserSync.reload();
        done();
    }));
}

// stg, lms専用のPugタスク
function pugEnvTask(envValue, outputPath) {
  return gulp.src(['src/pug/lms-moodle/**/*.pug', '!src/pug/lms-moodle/**/_*.pug'])
      .pipe(plumber())
      .pipe(data(() => ({ env: envValue })))  // 'env'に値を渡す
      .pipe(pug({ plugins: [pugbem] }))
      .pipe(gulp.dest(outputPath));  // 出力先を動的に変更
}
function pugEnvTaskSingle(envValue, outputPath) {
  return gulp.src(['src/pug/lms-moodle/**/*.pug', '!src/pug/lms-moodle/**/_*.pug'])
      .pipe(plumber())
      .pipe(newer({
        dest: outputPath,
        ext: '.html'  // 出力ファイルの拡張子を明示
      }))
      .pipe(data(() => ({ env: envValue })))  // 'env'に値を渡す
      .pipe(pug({ plugins: [pugbem] }))
      .pipe(gulp.dest(outputPath));  // 出力先を動的に変更
}

// stg用Pugタスク
function pugStg() {
  return pugEnvTask('stg', dstpaths.stg);
}
// stg用Pugタスク
function pugLms() {
  return pugEnvTask('lmswaomirai', dstpaths.lmswaomirai);
}

// stg用Pugタスク
function pugStgSingle() {
  return pugEnvTaskSingle('stg', dstpaths.stg);
}
// stg用Pugタスク
function pugLmsSingle() {
  return pugEnvTaskSingle('lmswaomirai', dstpaths.lmswaomirai);
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
exports.default = gulp.series(scss, serve, pugStg, pugLms, pugIndexPage, pugIndexContact);
exports.scss = scss;
exports.splitJs = splitJs;
exports.pugStg = pugStg;
exports.pugLms = pugLms;
exports.pugDefalutTenant = pugDefalutTenant;
exports.pugIndexPage = pugIndexPage;
exports.pugAll = gulp.series(pugStg, pugLms, pugDefalutTenant, pugIndexPage, pugIndexContact);