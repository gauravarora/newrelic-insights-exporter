var path = require('path');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var del = require('del');
var nodemon = require('gulp-nodemon');
var isparta = require('isparta');
var sourcemaps = require('gulp-sourcemaps');


var libDir = "lib/";
var jsFiles = "src/**/*.js";

gulp.task('static', function () {
  return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nsp', function (cb) {
  nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('pre-test', function () {
  return gulp.src('lib/**/*.js')
    .pipe(excludeGitignore())
    .pipe(istanbul({
      includeUntested: true,
      instrumenter: isparta.Instrumenter
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (cb) {
  var mochaErr;

  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}))
    .on('error', function (err) {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', function () {
      cb(mochaErr);
    });
});

gulp.task('watch', function () {
  nodemon({
    script: 'src/app.js',
    ext: 'js',
    env: {'NODE_ENV': 'dev'},
    watch: 'src'
  })
});

gulp.task('clean', function () {
  return del(['dist', 'lib']);
});

gulp.task('build', ['clean'], function () {
  return gulp.src(libDir)
    .pipe(gulp.dest('dist'));
});

gulp.task('prepublish', ['nsp']);
gulp.task('default', ['static', 'test']);
