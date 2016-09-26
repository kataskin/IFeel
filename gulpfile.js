'use strict';

var gulp = require('gulp');
var jade = require('gulp-jade');
var stylus = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync');
var mqpacker = require('css-mqpacker');
var minify = require('gulp-csso');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');

gulp.task('style', function() {
  return gulp.src('sass/style.scss')
    .pipe(plumber())
    .pipe(stylus())
    .pipe(postcss([
      autoprefixer({browsers: [
        'last 1 version',
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'last 2 Opera versions',
        'last 2 Edge versions'
      ]}),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.reload({stream: true}));
});

gulp.task('images', function() {
  return gulp.src('img/**/*.{png,jpg,gif,svg}')
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true
    }))
    .pipe(gulp.dest('build/img'));
});

gulp.task('fonts', function() {
  gulp.src('fonts/**/*.{woff,woff2}')
    .pipe(gulp.dest('build/fonts'));
});

gulp.task('script', function() {
  gulp.src('js/**/*.js')
    .pipe(gulp.dest('build/js'))
    .pipe(server.reload({stream: true}));
});

gulp.task('html', function() {
  gulp.src('jade/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('build'))
    .pipe(server.reload({stream: true}));
});

gulp.task('clean', function () {
  return gulp.src('build', {read: false})
    .pipe(clean());
});

gulp.task('build', ['clean'], function() {
  gulp.start(
    'fonts',
    'html',
    'script',
    'style',
    'images'
  );
});

gulp.task('serve', function() {
  server({
    server: 'build',
    notify: false,
    open: true,
    ui: false
  });

  gulp.watch('sass/**/*.scss', ['style']);
  gulp.watch('jade/**/*.jade', ['html']);
  gulp.watch('js/**/*.js', ['script']);
  gulp.watch('img/!**!/!*.{png,jpg,gif,svg}', ['images']);
  gulp.watch('fonts/!**/!*.{woff,woff2}', ['fonts']);
});
