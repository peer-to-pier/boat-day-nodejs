module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'app/frontend/*.js',
        dest: 'app/public/dist/<%= pkg.name %>.min.js'
      }
    },
    sass: {
      dist: {
        files: {
          'app/public/dist/<%= pkg.name %>.min.css': 'app/sass/main.scss'
        }
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/tether/dist/js/',
            src: 'tether.min.js',
            dest: 'app/public/vendors/'
          }, {
            expand: true,
            cwd: 'bower_components/jquery/dist/',
            src: 'jquery.min.*',
            dest: 'app/public/vendors/'
          }, {
            expand: true,
            cwd: 'bower_components/filament-sticky/',
            src: 'fixedsticky.*',
            dest: 'app/public/vendors/'
          }
        ]
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');

  // Default task(s).
  grunt.registerTask('development', ['sass', 'uglify', 'copy']);
  grunt.registerTask('production', ['copy']);
  grunt.registerTask('js', ['uglify']);

};