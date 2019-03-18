const gulp = require("gulp");
const cleanCSS = require("gulp-clean-css");
const less = require("gulp-less");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const del = require('del');
 

const paths = {
    styles: {
        src: '../src/styles/index.less',
        dest: '../dist/styles/'
    }
};

function styles() {
    return gulp.src(paths.styles.src)
        .pipe(less({
            javascriptEnabled: true
        }))
        .pipe(autoprefixer({
            browsers: ["last 2 versions", "ie > 8"]
        }))
        .pipe(cleanCSS())
        .pipe(rename("index.css"))
        .pipe(gulp.dest(paths.styles.dest));
}

// 拷贝字体文件
// gulp.task("fonts", function ()
// {
//     // 拷贝 iview 使用的字体文件
//     gulp.src("../src/styles/iview/common/iconfont/fonts/*.*")
//         .pipe(gulp.dest("../dist/styles/fonts"));
// });

//var build = gulp.series(clean, gulp.parallel(styles, scripts));
const clean = () => del([ '../dist/styles' ]);

gulp.task('default', gulp.series(clean, styles))
