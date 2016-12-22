'use strict';

// var
var gulp = require('gulp'),
    // concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css'),
    rename = require("gulp-rename"),
    notify = require("gulp-notify"),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
    useref = require('gulp-useref'),
    sourcemaps = require('gulp-sourcemaps'),
    wiredep = require('wiredep').stream;

var path = {
    build: {
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    src: {
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    }
};

gulp.task('bower', function () {
    gulp.src('./app/index.html')
        .pipe(wiredep({
            directory: "app/bower_components"
        }))
        .pipe(gulp.dest('./app'));
});



// server connect
gulp.task('connect', function() {
    connect.server({
        root: 'app',
        livereload: true
    });
});

// html
gulp.task('html', function() {
    return gulp.src('app/index.html')
        .pipe(connect.reload());
});

// css
gulp.task('css', function() {
    return gulp.src('app/sass/main.scss')
        .pipe(autoprefixer('last 5 versions'))
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(minifyCSS())
        .pipe(sourcemaps.write())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('app/css/'))
        .pipe(notify("Done!"))
        .pipe(connect.reload());
});

// watch
gulp.task('watch', function() {
    gulp.watch('app/sass/**/*.scss', ['css'])
    gulp.watch('app/css/*.css', ['css'])
    gulp.watch('app/index.html', ['html'])
});

// default
gulp.task('default', ['connect', 'html', 'css', 'watch']);

// build
gulp.task('useref', function() {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

//img and fonts
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});
gulp.task('img:build', function() {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
});

gulp.task('build', ['useref', 'fonts:build', 'img:build']);