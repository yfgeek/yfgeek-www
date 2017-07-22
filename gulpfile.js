/**
 * Gulp 自动化工具
 * Author   ：yfgeek
 */
var gulp = require('gulp');
var uncss = require('gulp-uncss');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var useref = require('gulp-useref');
var cleanCSS = require('gulp-clean-css');

// 压缩 css 文件
gulp.task('minicss', () => {
  return gulp.src('src/media/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('media'));
});


// 删除多余代码
gulp.task('uncss', function () {
    return gulp.src(['src/*'])
        .pipe(uncss({
            html: ['src/index.html']
        }))
        .pipe(gulp.dest('media'));
});

// 压缩html
gulp.task('html', function() {
  return gulp.src('src/index.html')
    .pipe(htmlmin({collapseWhitespace: true,removeComments: true}))
    .pipe(gulp.dest('.'));
});

//压缩图片
gulp.task('img', function () {
    gulp.src(['src/img/*'])
        .pipe(imagemin())
        .pipe(gulp.dest('img'))
});

// // HTML组合分离的css、js
// gulp.task('efhtml', function () {
//     return gulp.src('src/index.html')
//         .pipe(useref())
//         .pipe(gulp.dest('docs'));
// });

// // 自动化
// gulp.task('auto', function () {
//     gulp.watch('src/js/*.js', ['script']);
//     gulp.watch('src/sass/*.css', ['css']);
//     gulp.watch('src/css/*.css', ['sass']);
// });


gulp.task('default', ['minicss','uncss','html']);
