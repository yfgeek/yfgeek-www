/**
 * Gulp 自动化工具
 * Author   ：yfgeek
 */
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const uncss = require('gulp-uncss');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const useref = require('gulp-useref');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass')(require('sass'));

// 压缩 js 文件
function script() {
    return gulp.src('src/i18n/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('docs/i18n'));
}

// 压缩 css 文件
function minicss() {
    return gulp.src('src/media/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('docs/media'));
}

// 删除多余代码
function uncssTask() {
    return gulp.src(['src/*'])
        .pipe(uncss({
            html: ['src/index.html']
        }))
        .pipe(gulp.dest('docs/media'));
}

// 压缩html
function html() {
    return gulp.src('src/index.html')
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest('docs/'));
}

// 压缩图片
function img() {
    return gulp.src(['src/img/*'])
        .pipe(imagemin())
        .pipe(gulp.dest('docs/img'));
}

// 复制 JSON 文件
function copyJson() {
    return gulp.src('src/i18n/*.json')
        .pipe(gulp.dest('docs/i18n'));
}

// 监听文件变化
function watch() {
    gulp.watch('src/i18n/*.js', script);
    gulp.watch('src/media/*.css', minicss);
    gulp.watch('src/index.html', html);
    gulp.watch('src/img/*', img);
}

// 构建任务
const build = gulp.series(script, minicss, html, img, copyJson);

// 导出任务
exports.script = script;
exports.minicss = minicss;
exports.uncss = uncssTask;
exports.html = html;
exports.img = img;
exports.watch = watch;
exports.build = build;
exports.copyJson = copyJson;
exports.default = build;
