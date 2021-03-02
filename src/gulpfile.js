const gulp = require('gulp');
const connect = require('gulp-connect');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');
const esOptions = require('./.eslintrc');
const debug = require('debug')('gulp');

gulp.task('watch', () => {
  gulp.watch('**/*.js')
    .pipe(connect.reload());
});

// Lint Task
gulp.task('lint', () => {
  return gulp.src(['./**/*.js', '!./node_modules/**'])
    .pipe(eslint(esOptions))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// gulp.task('connect', connect.server({
//     root: [outputDir],
//     open: { browser: 'Google Chrome' }
// }));

gulp.task('develop', ['lint'], () => {
  nodemon({
      script: 'launch.js',
      ext: 'html js',
      ignore: ['ignored.js'],
    })
    .on('restart', ['lint'], () => {
      debug('restarted!');
    });
});

gulp.task('default', ['watch', 'connect']);
