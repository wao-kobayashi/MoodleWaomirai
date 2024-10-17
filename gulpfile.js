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

const srcpaths = {
    scss: './src/**/*.scss',
    sass: './src/**/*.sass',
    jsx: './src/jsx/**/*.js',
    jade: './src/jade/**/*.jade',
    pug: './src/pug/**/*.pug'
};

const dstpaths = {
    css: './static/css',
    js: './static/js'
};

function serve() {
    browserSync.init({
        server: "./",
        index: "index.html"
    });

    // SCSS/Sassファイルの変更を監視して自動コンパイル＆リロード
    gulp.watch([srcpaths.scss, srcpaths.sass], gulp.series(scss, (done) => {
        browserSync.reload();
        done();
    }));

    // その他のファイルの監視
    gulp.watch(srcpaths.jade, gulp.series(jade, (done) => {
        browserSync.reload();
        done();
    }));

    gulp.watch(srcpaths.pug, gulp.series(pugTask, (done) => {
        browserSync.reload();
        done();
    }));

    gulp.watch(srcpaths.jsx, gulp.series(browserifyTask, (done) => {
        browserSync.reload();
        done();
    }));
}

function jade() {
    return gulp.src([srcpaths.jade, '!./src/jade/**/_*.jade']) // _から始まるファイルを除外
        .pipe(plumber())
        .pipe(jade())
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
}

function pugTask() {
    return gulp.src([srcpaths.pug, '!./src/pug/**/_*.pug']) // _から始まるファイルを除外
        .pipe(plumber())
        .pipe(pug({ plugins: [pugbem] }))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
}


function scss() {
    const processors = [cssnext()];
    return gulp.src([srcpaths.scss, srcpaths.sass])
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError)) // エラーをログに表示
        .pipe(postcss(processors))
        .pipe(gulp.dest(dstpaths.css))
        .pipe(browserSync.stream());
}

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
exports.default = gulp.series(scss, serve);
exports.jade = jade;
exports.pug = pugTask;
exports.scss = scss;
exports.browserify = browserifyTask;