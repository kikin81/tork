module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
     bowercopy: {
        options: {
            destPrefix:'tork/bc/'
        },
         libs: {
            files: {
                'js/jquery.js': 'jquery/dist/jquery.js',
                'js/angular.js': 'angular/angular.js',
                'js/angular-route.js': 'angular-route/angular-route.js',
                'js/bootstrap.js':'bootstrap/dist/js/bootstrap.js'
            },
        },
        css: {
          files: {
            'css/bootstrap.css':'bootstrap/dist/css/bootstrap.css',
            'css/bootstrap.css.map':'bootstrap/dist/css/bootstrap.css.map',
            'css/normalize.css':'html5-boilerplate/css/normalize.css',
            'css/main.css':'html5-boilerplate/css/main.css'
          }
        }
    },
    clean: ['bower_components','tork/bc']
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-npm-install');
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  // Default task(s).
  grunt.registerTask('default', ['clean','npm-install','bowercopy']);

};