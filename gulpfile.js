const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const pugbem = require('gulp-pugbem');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
const babel = require('gulp-babel');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const rename = require('gulp-rename');
const data = require('gulp-data'); // gulp-dataを追加

// パスの設定
const srcpaths = {
    scss: './src/**/*.scss',
    sass: './src/**/*.sass',
    jsx: './src/jsx/**/*.js',
    jade: './src/jade/**/*.jade',
    pug: './src/pug/**/*.pug',
    envPug: './src/pug/lms-moodle/**/*.pug' // stg, lms向けのPugファイルのみ
};

const dstpaths = {
    css: './static/css',
    js: './static/js',
    stg: './moodle-stg',
    lms: './moodle-lms'
};

// ローカルサーバーの起動と監視タスク
function serve() {
    browserSync.init({
        server: "./",
        index: "index.html"
    });

    gulp.watch([srcpaths.scss, srcpaths.sass], gulp.series(scss, (done) => {
        browserSync.reload();
        done();
    }));

    gulp.watch(srcpaths.jade, gulp.series(jade, (done) => {
        browserSync.reload();
        done();
    }));

    gulp.watch(srcpaths.pug, gulp.series(allPug, (done) => {
        browserSync.reload();
        done();
    }));

    gulp.watch(srcpaths.jsx, gulp.series(browserifyTask, (done) => {
        browserSync.reload();
        done();
    }));
}

// 通常のPugタスク（./ 直下に出力）
function pugTask() {
    return gulp.src([srcpaths.pug, '!./src/pug/**/_*.pug', '!./src/pug/lms-moodle/**/*.pug']) // env以下は除外
        .pipe(plumber())
        .pipe(pug({ plugins: [pugbem] }))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
}

// stg, lms専用のPugタスク
function pugEnvTask(env, outputPath) {
    return gulp.src([srcpaths.envPug, '!./src/pug/lms-moodle/**/_*.pug'])
        .pipe(plumber())
        .pipe(data(() => ({ env }))) // 環境変数をPugに渡す
        .pipe(pug({ plugins: [pugbem] }))
        .pipe(gulp.dest(outputPath));
}

// stg用Pugタスク
function pugStg() {
    return pugEnvTask('stg', dstpaths.stg);
}

// lms用Pugタスク
function pugLms() {
    return pugEnvTask('lms', dstpaths.lms);
}

// すべてのPugタスクを並列実行
const allPug = gulp.parallel(pugTask, pugStg, pugLms);

// Jadeタスク
function jade() {
    return gulp.src([srcpaths.jade, '!./src/jade/**/_*.jade'])
        .pipe(plumber())
        .pipe(jade())
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
}

// SCSSタスク
function scss() {
    const processors = [cssnext()];
    return gulp.src([srcpaths.scss, srcpaths.sass])
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest(dstpaths.css))
        .pipe(browserSync.stream());
}

// Browserifyタスク
function browserifyTask() {
    return browserify({
            entries: './src/jsx/melon-soda-kai.js',
        })
        .transform(babelify)
        .bundle()
        .pipe(source("melon-soda-kai.js"))
        .pipe(gulp.dest(dstpaths.js))
        .pipe(browserSync.stream());
}

// デフォルトタスク
exports.default = gulp.series(scss, allPug, serve);
exports.pug = pugTask;
exports.pugStg = pugStg;
exports.pugLms = pugLms;
exports.allPug = allPug; // 手動実行用
exports.scss = scss;
exports.browserify = browserifyTask;