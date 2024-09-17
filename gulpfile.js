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

    gulp.watch([srcpaths.scss, srcpaths.sass], scss);
    gulp.watch(srcpaths.jade, jade);
    gulp.watch(srcpaths.pug, pugTask);
    gulp.watch(srcpaths.jsx, browserifyTask);
}

function jade() {
    return gulp.src(srcpaths.jade)
        .pipe(plumber())
        .pipe(jade())
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
}

function pugTask() {
    return gulp.src(srcpaths.pug)
        .pipe(plumber())
        .pipe(pug({ plugins: [pugbem] }))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
}

function scss() {
    const processors = [cssnext()];
    return gulp.src([srcpaths.scss, srcpaths.sass])
        .pipe(plumber())
        .pipe(sass())
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

exports.default = gulp.series(serve);
exports.jade = jade;
exports.pug = pugTask;
exports.scss = scss;
exports.browserify = browserifyTask;