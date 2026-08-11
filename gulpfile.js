const gulp = require('gulp');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');

const windowsSource = ['src/windows/**/*', '!src/windows/**/.DS_Store'];

function windows() {
    return gulp.src(windowsSource, { encoding: false, dot: true })
        .pipe(gulp.dest('docs'));
}

function homeScript() {
    return gulp.src('src/home/i18n/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('docs/home/i18n'));
}

function homeCss() {
    return gulp.src('src/home/media/*.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('docs/home/media'));
}

function homeHtml() {
    return gulp.src('src/home/index.html')
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest('docs/home'));
}

function homeImages() {
    return gulp.src('src/home/img/*', { encoding: false })
        .pipe(gulp.dest('docs/home/img'));
}

function homeJson() {
    return gulp.src('src/home/i18n/*.json')
        .pipe(gulp.dest('docs/home/i18n'));
}

function homeGame() {
    return gulp.src(['src/home/game/**/*', '!src/home/game/**/.DS_Store'], { encoding: false, dot: true })
        .pipe(gulp.dest('docs/home/game'));
}

const build = gulp.parallel(windows, homeScript, homeCss, homeHtml, homeImages, homeJson, homeGame);

function watch() {
    build();
    gulp.watch(windowsSource, windows);
    gulp.watch('src/home/i18n/*.js', homeScript);
    gulp.watch('src/home/media/*.css', homeCss);
    gulp.watch('src/home/index.html', homeHtml);
    gulp.watch('src/home/img/*', homeImages);
    gulp.watch('src/home/i18n/*.json', homeJson);
    gulp.watch('src/home/game/**/*', homeGame);
}

exports.windows = windows;
exports.homeScript = homeScript;
exports.homeCss = homeCss;
exports.homeHtml = homeHtml;
exports.homeImages = homeImages;
exports.homeJson = homeJson;
exports.homeGame = homeGame;
exports.build = build;
exports.watch = watch;
exports.default = build;
