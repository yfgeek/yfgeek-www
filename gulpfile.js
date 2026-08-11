const gulp = require('gulp');
const windowsSource = ['src/windows/**/*', '!src/windows/**/.DS_Store'];

function windows() {
    return gulp.src(windowsSource, { encoding: false, dot: true })
        .pipe(gulp.dest('docs'));
}

const build = gulp.parallel(windows);

function watch() {
    build();
    gulp.watch(windowsSource, windows);
}

exports.windows = windows;
exports.build = build;
exports.watch = watch;
exports.default = build;
