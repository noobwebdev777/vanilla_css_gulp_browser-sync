const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const cssnano = require("cssnano");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");

const postCssPlugins = [
  require('postcss-import'),
  require('autoprefixer'),
  require('postcss-nested'),
  require('postcss-preset-env')({
    stage: 2, // Adjust as needed
  }),
  cssnano({
    preset: 'default',
  }),
];

// Task to process and minify CSS
gulp.task("css", function () {
  return gulp
    .src("./src/css/*.css") // Source CSS files
    .pipe(sourcemaps.init()) // Initialize sourcemaps
    .pipe(postcss(postCssPlugins)) // Process with PostCSS
    .pipe(sourcemaps.write(".")) // Write sourcemaps
    .pipe(gulp.dest("./public/css")) // Output processed CSS
    .pipe(browserSync.stream()); // Inject changes into BrowserSync
});

// Task to uglify JavaScript
gulp.task("js", function () {
  return gulp
    .src("./src/js/*.js") // Source JavaScript files
    .pipe(sourcemaps.init()) // Initialize sourcemaps
    .pipe(uglify()) // Uglify JavaScript
    .pipe(rename({ suffix: '.min' })) // Rename to .min.js
    .pipe(sourcemaps.write(".")) // Write sourcemaps
    .pipe(gulp.dest("./public/js")) // Output processed JavaScript
    .pipe(browserSync.stream()); // Inject changes into BrowserSync
});

// Serve task
gulp.task("serve", function () {
  browserSync.init({
    server: {
      baseDir: "./",
    },
    port: 5173,
    open: false,
    notify: false,
  });

  gulp.watch("./*.html").on("change", browserSync.reload);
  gulp.watch("./src/css/*.css", gulp.series("css")); // Watch for CSS changes
  gulp.watch("./src/js/*.js", gulp.series("js")); // Watch for JS changes
});

// Default task
gulp.task("default", gulp.series(gulp.parallel("css", "js"), "serve"));
