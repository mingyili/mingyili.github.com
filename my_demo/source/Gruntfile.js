/* jshint node: true */
module.exports = function(grunt) {
    // Force use of Unix newlines

    //var dist = 'www/egou/licai/';
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Metadata.
        meta: {
            distPath: './www/egou/licai/dist/',
			distComjsPath: './www/egou/licai/dist/common/js/',
            devPath: './www/egou/licai/dev/',
            devComjsPath: './www/egou/licai/dev/common/js/',
            devComlessPath: './www/egou/licai/dev/common/css/'
        },
        banner: '/*!\n' + ' * Last Update : <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %>\n' + ' */\n',
        clean: {
            dist: ['<%= meta.distPath %>']
        },
        concat: {
            options: {
                separator: ';',
                stripBanners: true
            },
            sm: {
                src: [
                    '<%= meta.devComjsPath %>sui/intro.js', 
                    '<%= meta.devComjsPath %>sui/device.js', 
                    '<%= meta.devComjsPath %>sui/util.js', 
                    '<%= meta.devComjsPath %>sui/detect.js', 
                    '<%= meta.devComjsPath %>sui/zepto-adapter.js', 
                    '<%= meta.devComjsPath %>sui/fastclick.js', 
                    '<%= meta.devComjsPath %>sui/template7.js', 
                    '<%= meta.devComjsPath %>sui/page.js', 
                    '<%= meta.devComjsPath %>sui/tabs.js',
                    '<%= meta.devComjsPath %>sui/modal.js', 
                    //'<%= meta.devComjsPath %>sui/calendar.js', 
                    //'<%= meta.devComjsPath %>sui/picker.js', 
                    //'<%= meta.devComjsPath %>sui/datetime-picker.js', 
                    '<%= meta.devComjsPath %>sui/iscroll.js', 
                    '<%= meta.devComjsPath %>sui/scroller.js', 
                    '<%= meta.devComjsPath %>sui/pull-to-refresh-js-scroll.js', 
                    '<%= meta.devComjsPath %>sui/pull-to-refresh.js', 
                    '<%= meta.devComjsPath %>sui/infinite-scroll.js',
                    //'<%= meta.devComjsPath %>sui/searchbar.js', 
                    '<%= meta.devComjsPath %>sui/panels.js', 
                    '<%= meta.devComjsPath %>sui/router.js', 
                    '<%= meta.devComjsPath %>sui/init.js',
                    '<%= meta.devComjsPath %>common.js',
                    ],
                dest: '<%= meta.distComjsPath %>base.js'
            },
            extend: {
                src: [
                    '<%= meta.devComjsPath %>sui/swiper.js', 
                    '<%= meta.devComjsPath %>sui/swiper-init.js', 
                    '<%= meta.devComjsPath %>sui/photo-browser.js'
                    ],
                dest: '<%= meta.distComjsPath %>base-extend.js'
            },
            cityPicker: {
                src: [
                    '<%= meta.devComjsPath %>sui/city-data.js', 
                    '<%= meta.devComjsPath %>sui/city-picker.js'
                    ],
                dest: '<%= meta.distComjsPath %>base-city-picker.js'
            },
			/*zepto: {
                src: [
                    '<%= meta.devComjsPath %>sui/zepto.js',
                    '<%= meta.devComjsPath %>sui/zepto-adapter.js',
					'<%= meta.devComjsPath %>sui/fastclick.min.js',					
                    ],
                dest: '<%= meta.distComjsPath %>zepto.min.js'
            }*/
        },
        less: {
            main: { //主要编译的
                expand: true, // Enable dynamic expansion.
                cwd: '<%= meta.devPath %>', // Src matches are relative to this path.
                src: ['*/css/**/*.less', '!common/**/*.less', '!*/css/base/**/*.less'], // Actual pattern(s) to match.
                dest: '<%= meta.distPath %>', // Destination path prefix.
                ext: '.css', // Dest filepaths will have this extension.
                // filter:["base"]
            },
            options: {
                banner: '<%= banner %>',
                tasks: ["cssmin"], //编译并且进行压缩'less:main',
            }
        },
        autoprefixer: {
            options: {
                browsers: [
                    'Android 2.3',
                    'Android >= 4',
                    'Chrome >= 20',
                    'Firefox >= 24', // Firefox 24 is the latest ESR
                    'Explorer >= 9',
                    'iOS >= 6',
                    'Opera >= 12',
                    'Safari >= 6'
                ]
            },
            rests: {
                src: ['<%= less.main.dest %>*/css/reset.css']
            },
			extent: {
                src: ['<%= less.main.dest %>*/css/reset-extend.css']
            }
        },
        cssmin: {
            all: {
                files: [
                    {
                        expand: true, 
                        cwd: '<%= meta.distPath %>', 
                        src: ['*/css/**/*.css'], 
                        dest: '<%= meta.distPath %>', 
                    }
                ],
            }
        },
        copy: {
            corejs:{
                expand: true,
                cwd: '<%= meta.devComjsPath %>',
                src: ['core/**/*.js'],
                dest: '<%= meta.distComjsPath %>',
				flatten: true
            },
            js:{
                expand: true,
                cwd: '<%= meta.devPath %>',
                src: ['*/js/**/*.js', '!common/**/*'],
                dest: '<%= meta.distPath %>'
            },
            fonts: {
                expand: true,
				cwd: '<%= meta.devPath %>',
                src: ['*/fonts/**/*', '!common/**/*'],
                dest: '<%= meta.distPath %>'
            },
            img: {
                expand: true,
				cwd: '<%= meta.devPath %>',
                src: ['*/img/**/*'],
                dest: '<%= meta.distPath %>'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                mangle: true,
				preserveComments: 'false',
                report: "min"
            },
            build: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= meta.distPath %>', // Src matches are relative to this path.
                        src: ['*/js/**/*.js'], // Actual pattern(s) to match.
                        dest: '<%= meta.distPath %>', // Destination path prefix.
                    }
                ],
            }
        },
        watch: {
            js: {
                expand: true,
                files: [
                        '<%= meta.devPath %>*/js/**/*.js',
                    ],
                tasks: ['dist-js'],
                options: {
                    livereload: false
                }
            },
            css: {
                expand: true,
                files: [
                        '<%= meta.devPath %>**/*.less',
                    ],
                tasks: ['dist-css'],
                options: {
                    livereload: false
                }
            },
            extend: {
                expand: true,
                files: [
                        '<%= meta.devPath %>*/fonts/**/*',
                        '<%= meta.devPath %>*/img/**/*',
                    ],
                tasks: ['copy'],
                options: {
                    livereload: false
                }
            },
            configFiles: { //监听 Gruntfile变动
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            }
        }
    });

    grunt.event.on('watch', function(action, filepath, target) {
        console.log("end~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log("调试信息：" + target + ': ' + filepath + ' has ' + action + "\n" + grunt.template.today("yyyy-mm-dd hh:MM:ss"));
        console.log("end~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Default task(s).
    grunt.registerTask('build-css', ['less', 'autoprefixer','cssmin']);
    grunt.registerTask('build-js', ['concat', 'uglify']);
    grunt.registerTask('dist-css', ['less', 'autoprefixer']);
    grunt.registerTask('dist-js', ['concat', 'copy:js']);
    
    grunt.registerTask('build', ['clean', 'copy', 'build-css', 'build-js']);
    grunt.registerTask('default', ['dist-css', 'dist-js', 'watch']);
};
