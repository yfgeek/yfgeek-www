/**
 * Gulp 自动化工具
 * Author   ：yfgeek
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var uncss = require('gulp-uncss');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var useref = require('gulp-useref');
var cleanCSS = require('gulp-clean-css');

// 压缩 js 文件
gulp.task('script', function() {
    gulp.src('src/i18n/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('docs/i18n'))
});

// 压缩 css 文件
gulp.task('minicss', () => {
  return gulp.src('src/media/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('docs/media'));
});


// 删除多余代码
gulp.task('uncss', function () {
    return gulp.src(['src/*'])
        .pipe(uncss({
            html: ['src/index.html']
        }))
        .pipe(gulp.dest('docs/media'));
});

// 压缩html
gulp.task('html', function() {
  return gulp.src('src/index.html')
    .pipe(htmlmin({collapseWhitespace: true,removeComments: true}))
    .pipe(gulp.dest('docs/'));
});

//压缩图片
gulp.task('img', function () {
    gulp.src(['src/img/*'])
        .pipe(imagemin())
        .pipe(gulp.dest('docs/img'))
});


gulp.task('default', ['script','minicss','html']);
