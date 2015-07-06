var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var webserver = require('gulp-webserver');

gulp.task('lint', function() {
	return gulp.src('src/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Concatenate, Minify, and Uglify JS
gulp.task('scripts', function() {
	return gulp.src('src/*.js')
		.pipe(concat('div-printer.js'))
		.pipe(gulp.dest('dist'))
		.pipe(rename('div-printer.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
	gulp.watch('src/*.js', ['lint', 'scripts']);
});

gulp.task('webserver', function() {
	gulp.src('')
		.pipe(webserver({
			livereload: false,
			open: true
		}));
});

gulp.task('default', ['lint', 'scripts', 'watch', 'webserver']);
gulp.task('ci', ['scripts']);
