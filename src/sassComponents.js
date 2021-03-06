'use strict';
var plumber      = require('gulp-plumber'),		 // уведомления об ошибках
    autoprefixer = require('gulp-autoprefixer'), // установка префиксов
    notify       = require('gulp-notify'),       // всплывающие уведомления
    newer        = require('gulp-newer'),        // ограничение выборки для ускорения компиляции
    sass         = require('gulp-sass'),         // компилятор sass на C без compass
    browserSync  = require('browser-sync'),      // livereload
    sourcemaps   = require('gulp-sourcemaps'),
    duration     = require('gulp-duration'),     // время выполнения
    debug        = require('gulp-debug'),       // отладка
    gulpIf      = require('gulp-if');


var isDevelopment = function() {
    return !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
};

module.exports =  function (options) {
    var gulp = options.gulp;
    return gulp.src(options.path.src.sassComponents, {since: gulp.lastRun('sassComponents')})
        .pipe(plumber(gulpIf(isDevelopment(), notify.onError({
            message: '<%= error.message %>',
            title: 'Sass Components Error!'
        }), function (error) {
            console.log(error.message)
        })))
        .pipe(gulpIf(isDevelopment() && options.sourcemaps, sourcemaps.init()))
        .pipe(sass.sync({
            includePaths: [process.env['INIT_CWD'] + options.includePath]
        }))
        .pipe(autoprefixer({
            browsers: ['last 12 versions', '> 1%'],
            cascade:  false,
            remove:   false
        }))
        .pipe(debug({'title': '- sassComponents'}))
        .pipe(duration('sassComponents time'))
        .pipe(gulpIf(isDevelopment() && options.sourcemaps, sourcemaps.write()))
        .pipe(gulp.dest(function(file) {
            return file.base;
        }))
}