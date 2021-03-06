module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                mangle: false,
                compress: false,
                beautify: true
            },
            angular: {
                files: {
                    '<%= torkDst %>/js/app.js': ['<%= torkSrc %>/js/routes.js',
                        '<%= torkSrc %>/js/controllers.js',
                        '<%= torkSrc %>/js/directives.js',
                        '<%= torkSrc %>/js/services.js'
                    ]
                }
            }
        },
        bowercopy: {
            options: {
                destPrefix: 'tork/bc/'
            },
            libs: {
                files: {
                    'js/lib/jquery.js': 'jquery/dist/jquery.js',
                    'js/lib/angular.js': 'angular/angular.js',
                    'js/lib/angular-route.js': 'angular-route/angular-route.js',
                    'js/lib/angular-resource.js': 'angular-resource/angular-resource.js',
                    'js/lib/bootstrap.js': 'bootstrap/dist/js/bootstrap.js',
                    'js/lib/moment.js': 'moment/moment.js',
                    'js/lib/d3.js': 'd3/d3.js'
                },
            },
            css: {
                files: {
                    'css/bootstrap.css': 'bootstrap/dist/css/bootstrap.css',
                    'css/font-awesome.css': 'font-awesome/css/font-awesome.css',
                    'css/bootstrap.css.map': 'bootstrap/dist/css/bootstrap.css.map',
                    'css/normalize.css': 'html5-boilerplate/css/normalize.css',
                    'css/main.css': 'html5-boilerplate/css/main.css'
                }
            },
            media: {
                files: {
                    'fonts': 'font-awesome/fonts/*.*'
                }
            }
        },
        stylus: {
            compile: {
                options: {
                    compress: false
                },
                files: {
                    '<%= torkDst %>/css/style.css': ['<%= torkSrc %>/stylus/*.styl']
                }
            }
        },
        clean: {
            all: ['bower_components', 'node_modules', 'tork/bc'],
            app: ['tork/bc']
        },
        watch:{
            scripts: {
                files : '<%= torkSrc %>/js/*.js',
                tasks: ['uglify'],
                options: {
                    livereload: true,
                }
            },
            css: {
                files: '<%= torkSrc %>/stylus/*.styl',
                tasks: ['stylus'],
                options: {
                    livereload: true,
                }
            }
        },
        torkSrc: 'tork/src/',
        torkDst: 'tork/dest/'
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-npm-install');
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // Default task(s).
    grunt.registerTask('default', ['npm-install', 'bowercopy', 'stylus', 'uglify']);

};