/**
 * Packages
 */

let gulp = require('gulp');
let babel = require('gulp-babel');
let remove = require('gulp-clean');
let concat = require('gulp-concat');
let htmlmin = require('gulp-htmlmin');
let postcss = require('gulp-postcss');
let rename = require('gulp-rename');
let rev = require('gulp-rev');
let revDelete = require('gulp-rev-delete-original');
let revReplace = require('gulp-rev-replace');
let svgo = require('gulp-svgo');
let uglify = require('gulp-uglify-es').default;
let calc = require("postcss-calc")
let combineMediaQuery = require('postcss-combine-media-query');
let presetEnv = require('postcss-preset-env');
let atImport = require('postcss-import');
let autoprefixer = require('autoprefixer');
let cssnano = require('cssnano');
let browserSync = require('browser-sync');


/**
 * Development Tasks
 */

gulp.task('css', () => {
	let plugins = [
		atImport,
		combineMediaQuery,
		cssnano,
		calc,
		autoprefixer({overrideBrowserslist: ['> 1%'], cascade: false}),
		presetEnv({ stage: 0 })
	];
	return gulp.src('./src/css/style.css')
		.pipe(postcss(plugins))
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('./src/css/'))
		.pipe(browserSync.stream());
});

gulp.task('js', () => {
	return gulp.src(['./src/js/**/*.js', '!./src/js/**/main.min.js'])
		.pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
		.pipe(gulp.dest('./src/js/'))
		.pipe(browserSync.stream())
});

gulp.task('liveserver-src', () => {
	browserSync.init({
    server: {
      baseDir: './src'
    }
  });
});

gulp.task('watch', gulp.series( async () => {
	gulp.watch(['./src/css/**/*.css', '!./src/css/**/style.min.css'], gulp.parallel( ['css'] ))
	gulp.watch(['./src/js/**/*.js', '!./src/js/**/main.min.js'], gulp.parallel( ['js'] ));
	gulp.watch('./src/**/*').on('change', browserSync.reload);
}))

gulp.task('development', gulp.series('css', 'js', 'watch', 'liveserver-src'))


/**
 * Build Task
 */

gulp.task('copy', () => {
	return gulp.src('./src/**/*')
	.pipe(gulp.dest('./dist'))
})

gulp.task('clean', () => {
	return gulp.src('./dist', {read: false, allowEmpty: true})
		.pipe(remove());
})

gulp.task('clean-css-src', function () {
	return gulp.src(['./dist/css/**/*.css', '!./dist/css/**/*.min.css'], {read: false})
		.pipe(remove());
})

gulp.task('minify-html', () => {
	return gulp.src('./dist/**/*.html')
	.pipe(htmlmin({collapseWhitespace: true, removeComments: true, removeEmptyAttributes: true}))
	.pipe(gulp.dest((file) => {return file.base;}));
});

gulp.task('minify-svg', () => {
	return gulp.src('./dist/**/*.svg')
	.pipe(svgo({ plugins: [{ removeViewBox: false }, { cleanupIDs: false }]	}))
	.pipe(gulp.dest((file) => {return file.base;}));
});

gulp.task('rev', () => {
  return gulp.src(['./dist/**/*.{css,js,jpg,jpeg,png,svg}', '!./dist/**/opengraph.png'])
    .pipe(rev())
    .pipe(revDelete())
    .pipe(gulp.dest('./dist/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist/'))
})

gulp.task('revReplace', () => {
  return gulp.src(['./dist/index.html', './dist/**/*.css', './dist/**/*.js'])
    .pipe(revReplace({
			manifest: gulp.src('./dist/rev-manifest.json'),
			replaceInExtensions: ['.html', '.yaml', '.js', '.css']
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('liveserver-dist', () => {
	browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
});

gulp.task('build', gulp.series('css', 'js', 'clean', 'copy', 'rev', 'revReplace', 'clean-css-src', 'minify-html', 'minify-svg'))