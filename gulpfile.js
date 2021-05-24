const rename = require("gulp-rename");
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const sass = require('gulp-sass');

const { src, dest, parallel, series, watch } = require('gulp');

// Directories
const source = './src/';
const destination = './public/';

// Transfer CSS to public and minify CSS
function css() {
  return src(source + 'scss/*.scss')
    .pipe(concat('main.css'))
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(destination + 'css'));
}
// Transfer img to public
function img() {
  return src(source + 'img/*.*')
  .pipe(dest(destination + 'img'));
}

// Transfer JS to public and minify
function js() {
  return src(source + 'js/*.js')
      .pipe(concat('main.js'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest(destination + 'js'));
}

// Transfer sounds to public
function sounds() {
  return src(source + 'sounds/*.mp3')
  .pipe(dest(destination + 'sounds'));
}

//Transfer css files from node_modules to dist
function vendorcss() {
  return src(['./node_modules/font-awesome/css/font-awesome.min.css',
  './node_modules/bootstrap/dist/css/bootstrap.min.css'])
  .pipe(rename('vendor.min.css'))
  .pipe(dest(destination + 'css'));
}
//Transfer Font Awesome fonts to dest
function vendorfonts() {
  return src('./node_modules/font-awesome/fonts/*.*')
  .pipe(dest(destination + 'fonts'));
}
//Transfer vendor minified JS to dest
function vendorjs() {
  return src([
    './node_modules/socket.io-client/dist/socket.io.js',
    './node_modules/@lcluber/weejs/dist/wee.iife.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    './node_modules/jquery/dist/jquery.min.js'
  ])
  .pipe(concat('vendor.js'))
  .pipe(dest(destination + '/js'));
}

// Watch files
function watchFiles() {
  watch(source + 'scss/*.scss', css);
  watch(source + 'js/*.js', js);
  watch(source + 'img/*.*', img);
  watch('index.html');
}

exports.css = css;
exports.js = js;
exports.vendorfonts = vendorfonts;
exports.vendorcss = vendorcss;
exports.vendorjs = vendorjs;
exports.img = img;
exports.sounds = sounds;
const build = parallel(css, js, vendorcss, vendorfonts, vendorjs, img, sounds);
exports.default = build;
exports.build = build;
exports.watch = parallel(build, watchFiles);