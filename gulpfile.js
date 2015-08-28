require('dotenv').load()

var gulp   = require('gulp')
var fs     = require('fs')
var s3     = require('./lib/gulp-s3')
var env    = (process.env.NODE_ENV || 'development')
var ngAnnotate = require('gulp-ng-annotate')

var shell = require('gulp-shell')
var livereload = require('gulp-livereload')

// load all plugins
var $ = require('gulp-load-plugins')()

var paths = {
  css: [ 'assets/css/*.less' ],
  js: [ 'assets/js/**/*.js' ],
  html: [ 'assets/html/**/*.html' ]
}

var ASSET_VERSION_SUFFIX = env

gulp.task('clean', function () {
  return gulp.src([ 'dist', '.tmp' ], { read: false }).pipe($.clean())
})

gulp.task('build', [ 'html', 'fonts' ])

gulp.task('default', [ 'clean' ], function () {
  gulp.start('build')
})

gulp.task('styles', function () {
  return gulp.src(paths.css)
    .pipe($.less())
    .pipe(gulp.dest('assets/css/'))
    .pipe($.size())
})

gulp.task('scripts', function () {
  return gulp.src(paths.js)
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-stylish')))
    .pipe($.size())
})

gulp.task('style', function () {
  return gulp.src(paths.js)
    .pipe($.jscs())
    .pipe($.size())
})

gulp.task('partials', function () {
  return gulp.src(paths.html)
    .pipe($.minifyHtml({
      comments: true,
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.ngHtml2js({
      moduleName: "blast",
      prefix: "/assets/html/"
    }))
    .pipe(gulp.dest(".tmp/html"))
    .pipe($.size())
})

gulp.task('minify', [ 'styles', 'scripts', 'partials' ], function () {
  var jsFilter  = $.filter('**/*.js')
  var cssFilter = $.filter('**/*.css')

  return gulp.src('*.html')
    .pipe($.inject(gulp.src('.tmp/html/**/*.js'), {
      read: false,
      starttag: '<!-- inject:partials -->',
      addRootSlash: false
    }))
    .pipe($.useref.assets({ searchPath: '.' }))
    .pipe(jsFilter)
    .pipe(ngAnnotate()) // TODO: replace gulp-ng-annotate
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.csso(true))
    .pipe(cssFilter.restore())
    .pipe($.useref.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'))
    .pipe($.size())
})

gulp.task('html', [ 'minify', 'asset-version' ], function () {
  return gulp.src('dist/*.html')
    //.pipe($.prefix('https://stickers.snaps.photo/blast/assets/', [
    .pipe($.prefix('https://stickers.snaps.photo/blast/assets/' + ASSET_VERSION_SUFFIX, [
      { match: "script[src]", attr: "src" },
      //{ match: "link[href]", attr: "href" }
    ]))
    .pipe(gulp.dest('dist'))
})

gulp.task('fonts', function () {
  return gulp.src([
    'assets/third-party/ionicons/fonts/*'
  ]).pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/build/fonts'))
})

gulp.task('s3', [ 's3-assets' ])

gulp.task('asset-version', function (cb) {
  var cp = require('child_process')
  cp.exec('node bin/update_assets.js', function (err, stdout) {
    if (err) return cb(err)
    ASSET_VERSION_SUFFIX = env + '/v' + Number(stdout) + '/'
    cb()
  })
})

gulp.task('update-assets', $.shell.task([
  'node bin/update_assets'
]))

gulp.task('s3-assets', [ 'build', 'asset-version' ], function () {
  gulp.src('./dist/**')
    .pipe($.gzip())
    .pipe(s3({
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: "snaps-stickers"
    }, {
      uploadPath: '/blast/assets/' + ASSET_VERSION_SUFFIX,
      gzippedOnly: true
    }))
})

gulp.task('serve', [ 'live-reload' ], shell.task([
  'echo Starting Server!',
  'npm start'
]))

gulp.task('live-reload', function () {
  livereload.listen()

  gulp.watch(paths.css, ['styles']).on('change', livereload.changed)
  gulp.watch(paths.html, ['partials']).on('change', livereload.changed)
})
