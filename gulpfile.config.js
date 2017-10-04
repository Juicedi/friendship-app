module.exports = {
    JS_ENTRY: './js/src/**/*.js', // gets all matching files to transpile and bundle them. All matching files will trigger JS compiling on change
    JS_LIBS: ['!./js/src/**/*.js', './js/**/*.js'], // gets all matching files to move them to build destination.
    SASS_ENTRY: './sass/main.scss', // the main Sass file, which should import all partial Sass files in desired order using @import tag
    SASS_DIR: './sass', // the root directory for all Sass files
    SASS_WATCH: './sass/**/*.scss', // all matching files will trigger Sass compiling on change
    HTML_DIR: './content/**/*.html', // all matching files will trigger browser reload on change
    JS_DEST: './build/js/', // destination for bundled JavaScript file. All matching files will trigger browser reload on change
    JS_BUNDLE_NAME: 'bundle.js', // name for the bundled JavaScript file
    SASS_DEST: './build/css/', // destination for the compiled and bundled Sass file
    JS_SOURCEMAPS: './sourcemaps', // destination directory for JavaScript sourcemap files
    SASS_SOURCEMAPS: './sourcemaps', // destination directory for Sass sourcemap files
    IMG_ENTRY: './img/**/*.{jpg,jpeg,JPG,JPEG,gif,png,PNG}', // all matching files will be compressed
    IMG_DEST: './build/img/', // destination where compressed images are moved
    BABEL_POLYFILL_PATH: './node_modules/babel-polyfill/dist/polyfill.min.js', // matching file will be used as the Babel polyfill
    FETCH_POLYFILL_PATH: './node_modules/whatwg-fetch/fetch.js' // path to polyfill for Fetch API
}
