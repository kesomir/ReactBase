'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var open = require('gulp-open');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');


var config = {
	port: 9005,
	devBaseUrl: 'http://localhost',
	paths: {
		html: './src/*.html',
		js: [
			'node_modules/react/dist/react.min.js',
			'node_modules/react-dom/dist/react-dom.min.js',
			'./src/scripts/react.js'
		],
        jsx: './src/**/*.jsx',
		css: [
			'node_modules/bootstrap/dist/css/bootstrap.min.css',
			'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
            './src/css/*.css',
		],
        scss: './src/scss/*.scss',
        cssOut: './src/css',
		dist: './dist',
		mainJs: './src/scripts/main.js',
		mainJsx: './src/scripts/react.jsx',

	}
}

//start local dev server
gulp.task('connect', function(){
	connect.server({
		root: ['dist'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});
})

gulp.task('open', ['connect'], function(){
	gulp.src('dist/index.html')
		.pipe(open({uri: config.devBaseUrl + ':' + config.port + '/'}));
});

gulp.task('html', function(){
	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
});

gulp.task('jsx', function(){
    gulp.src(config.paths.jsx)
        .pipe(babel({
            presets: ['es2015', 'react']
        }))
        .pipe(gulp.dest('src'));
});

gulp.task('js', function(){
	browserify(config.paths.js)
		.bundle()
		.on('error', console.error.bind(console))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.paths.dist + '/scripts'))
		.pipe(connect.reload());
});

gulp.task('scss', function () {
  gulp.src(config.paths.scss)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./src/css'));
});

gulp.task('css', function(){
	gulp.src(config.paths.css)
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest(config.paths.dist + '/css'));
})

gulp.task('watch', function(){
	gulp.watch(config.paths.html, ['html'])
    gulp.watch(config.paths.css, ['scss']);
	gulp.watch(config.paths.js, ['js', 'lint'])
});

gulp.task('lint', function(){
	return gulp.src(config.paths.js)
			.pipe(eslint('eslint.config.json'))
			.pipe(eslint.format())
			.pipe(eslint.failOnError());
});

gulp.task('run', ['html', 'scss', 'css', 'jsx', 'js', 'lint', 'open', 'watch']);