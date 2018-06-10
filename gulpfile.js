var gulp = require('gulp');
var rename = require("gulp-rename");
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

// Directories
var source = './src';
var destination = './public';

// Transfer CSS to public and minify CSS
gulp.task('css', () => {
  return gulp.src(source + '/css/*.css')
  .pipe(gulp.dest(destination + '/css'))
  .pipe(cleanCSS())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest(destination + '/css'));
});
// Transfer img to public
gulp.task('img', () => {
  return gulp.src(source + '/img/*.*')
  .pipe(gulp.dest(destination + '/img'));
});

// Transfer JS to public and minify
gulp.task('js', () => {
  return gulp.src(source + '/js/*.js')
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest(destination + '/js'));
});

// Transfer sounds to public
gulp.task('sounds', () => {
  return gulp.src(source + '/sounds/*.mp3')
  .pipe(gulp.dest(destination + '/sounds'));
});

//Transfer css files from node_modules to dist
gulp.task('vendorcss', ()=> {
  return gulp.src('./node_modules/font-awesome/css/font-awesome.min.css')
      .pipe(gulp.dest(destination + '/css'));
});

//Transfer fonts from node_modules to dist
gulp.task('fonts', ()=> {
  return gulp.src('./node_modules/font-awesome/fonts/*.*')
      .pipe(gulp.dest(destination + '/fonts'));
});

//Transfer js files from node_modules to dist
gulp.task('vendorjs', ()=> {
  return gulp.src(['./node_modules/socket.io-client/dist/socket.io.js', './node_modules/Weejs/dist/wee.min.js'])
      .pipe(gulp.dest(destination + '/js'));
});

// Build task
gulp.task('build', ['css', 'img', 'js', 'vendorcss', 'vendorjs', 'sounds', 'fonts']);

// Default task : build
gulp.task('default', ['build']);

// Watch task
gulp.task('watch', function () {
  gulp.watch(source + '/**/*.*', ['build']);
});
