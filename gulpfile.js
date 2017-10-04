const gulp = require('gulp'); // Gulp package
const sass = require('gulp-sass'); // Compiles Sass files to CSS
const autoprefixer = require('gulp-autoprefixer'); // Adds vendor prefixes to CSS files, e.g., -moz- and -webkit-
const sourcemaps = require('gulp-sourcemaps'); // Writes sourcemaps of compiled/modified files
const watch = require('gulp-watch'); // Watches for changes in the target file(s) and triggers desired functionality
const rename = require('gulp-rename'); // Renames modified files
const browserSync = require('browser-sync').create(); // Creates a Browser Sync instance. Allows live-reloading, CSS injecting, and testing multiple browsers at the same time
const plumber = require('gulp-plumber'); // Continues the Gulp task even if errors were encountered
const gutil = require('gulp-util'); // Utility functions, e.g., better error reporting
const imagemin = require('gulp-image'); // Compress images
const gulpif = require('gulp-if'); // 'if' conditional for Gulp streams
const argv = require('yargs').argv; // Get command line parameters in a JS object
const babel = require('gulp-babel'); // Translate ES6/7 to ES5 using babel (+ 'latest' preset)
const uglify = require('gulp-uglify'); // Uglify JS files
const concat = require('gulp-concat'); // Concatenate files into a single bundle
const changed = require('gulp-changed'); // Get only the files that were changed
const optimizeJS = require('gulp-optimize-js'); // Make JS faster to parse and fire for the browser
const csso = require('gulp-csso'); // Optimize css minification
const config = require('./gulpfile.config.js'); // Configuration file

// Initialize constants (these are imported from our config file)
const JS_ENTRY = config.JS_ENTRY;
const JS_LIBS = config.JS_LIBS;
const SASS_ENTRY = config.SASS_ENTRY;
const SASS_DIR = config.SASS_DIR;
const SASS_WATCH = config.SASS_WATCH;
const HTML_DIR = config.HTML_DIR;
const JS_DEST = config.JS_DEST;
const JS_BUNDLE_NAME = config.JS_BUNDLE_NAME;
const SASS_DEST = config.SASS_DEST;
const JS_SOURCEMAPS = config.JS_SOURCEMAPS;
const SASS_SOURCEMAPS = config.SASS_SOURCEMAPS;
const IMG_ENTRY = config.IMG_ENTRY;
const IMG_DEST = config.IMG_DEST;
const BABEL_POLYFILL_PATH = config.BABEL_POLYFILL_PATH;
const FETCH_POLYFILL_PATH = config.FETCH_POLYFILL_PATH;

/** Gulp task for using Browser Sync. It is basically an HTTP server that enables the use of
 *live-reloading and CSS injection. Additionally, you can test the app with multiple browsers
 * at the same time.
 */
gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: './',
    },
    online: true,
  });

  // When scss files change, run the sass function (below)
  watch(SASS_WATCH, {
    interval: 500,
  }, () => {
    gulp.start('sass');
  });

  // Reload page when .html-file is modified
  watch(['./index.html', HTML_DIR], {
    interval: 500,
  }).on('change', browserSync.reload);

  // Run JS task when source .js-files are modified
  watch(JS_ENTRY, {
    interval: 500,
  }, () => {
    gulp.start('javascript:transpile');
  });

  // Reload page when bundle.js-file is modified
  if (argv.nojs) {
    watch(JS_ENTRY, {
      interval: 500,
    }).on('change', browserSync.reload);
  } else {
    watch(JS_DEST + JS_BUNDLE_NAME, {
      interval: 500,
    }).on('change', browserSync.reload);
  }

  // Run images task when image files are modified
  watch(IMG_ENTRY, {
    interval: 500,
  }, () => {
    gulp.start('images');
  });
});

/* Compile Sass files + compress and autoprefix them */
gulp.task('sass', () => {
  if (argv.nosass) {
    return null;
  }
  return gulp
    .src(SASS_ENTRY)
    .pipe(plumber())
    // Initialize writing of sourcemaps
    .pipe(sourcemaps.init())
    // Compile Sass. Catch errors and output them to console
    .pipe(sass({
      includePaths: SASS_DIR,
    }).on('error', sass.logError))
    // Apply autoprefixing (i.e., add -webkit-, -moz-, etc. prefixes wherever needed)
    .pipe(autoprefixer())
    .pipe(csso())
    // Add suffix '.min' to the output filename
    .pipe(rename({
      suffix: '.min'
    }))
    // Write sourcemaps
    .pipe(sourcemaps.write(SASS_SOURCEMAPS))
    .pipe(plumber.stop())
    // Write to folder './css'
    .pipe(gulp.dest(SASS_DEST))
    // Inject css to Browser Sync
    .pipe(browserSync.stream({
      match: '**/*.css',
    }));
});

/* Minify images in 'img' folder and overwrite them */
gulp.task('images', () => {
  if (argv.noimg) {
    return null;
  }
  return gulp
    .src(IMG_ENTRY)
    .pipe(plumber())
    .pipe(gulpif(!argv.production, changed(IMG_DEST)))
    // Optimize images
    .pipe(gulpif(
      argv.production,
      imagemin({
        verbose: true,
      })))
    .pipe(plumber.stop())
    .pipe(gulp.dest(IMG_DEST))
    .on('error', gutil.log);
});

/* Creates polyfill file that is loaded when necessary */
gulp.task('javascript:polyfill', () => {
  if (argv.nojs || argv.nobabelpoly) {
    return null;
  }
  return gulp
    .src(BABEL_POLYFILL_PATH)
    .pipe(gulpif(argv.production, optimizeJS()))
    .pipe(rename('polyfill.js'))
    .pipe(gulp.dest(JS_DEST));
});

/* Creates  Fetch API polyfill file that is loaded when necessary */
gulp.task('javascript:fetch-polyfill', () => {
  if (argv.nojs || !argv.fetchpoly) {
    return null;
  }
  return gulp
    .src(FETCH_POLYFILL_PATH)
    .pipe(gulpif(argv.production,
      uglify({
        mangle: true,
      })))
    .pipe(gulpif(argv.production, optimizeJS()))
    .pipe(rename('fetch.js'))
    .pipe(gulp.dest(JS_DEST));
});

/* Calls other javascript tasks and moves lib files to build directory */
gulp.task('javascript', ['javascript:polyfill', 'javascript:fetch-polyfill', 'javascript:transpile'], () => {
  if (argv.nojs) {
    return null;
  }
  return gulp
    .src(JS_LIBS)
    .pipe(gulp.dest(JS_DEST))
    .on('error', gutil.log);
});

/* Translate JS from ES6/7 to ES5 and uglify it */
gulp.task('javascript:transpile', () => {
  if (argv.nojs) {
    return null;
  }
  return gulp
    .src(JS_ENTRY)
    .pipe(plumber())
    // Initialize writing of sourcemaps
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat(JS_BUNDLE_NAME))
    .pipe(gulpif(argv.production,
      uglify({
        mangle: true,
      })))
    .pipe(gulpif(argv.production, optimizeJS()))
    // Write sourcemaps
    .pipe(sourcemaps.write(JS_SOURCEMAPS))
    .pipe(plumber.stop())
    // WriteJS_BUNDLE_NAME folder build/js
    .pipe(gulp.dest(JS_DEST))
    .on('error', gutil.log);
});

/* Default task for development purposes */
gulp.task('default', ['sass', 'images', 'javascript'], () => {
  gulp.start('browser-sync');
});

/** Compile Sass, translate Javascript, and optimize images. Preferrably run with flag --production,
 * so that no sourcemaps are created and JS is uglified
 */
gulp.task('build', ['sass', 'images', 'javascript'], (done) => {
  done();
});
