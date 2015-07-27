module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compass: {
      dist: {
        options: {
          config: 'config.rb',
          sassDir: 'sass/',
          cssDir: '../assets/css/',
          quiet: true
        }
      }
    },
    watch: {
      css: {
        files: ['sass/**/*.scss'],
        tasks: ['compass', 'notify:watchCSS']
      }
    },
    notify:{
      start:{
        options:{
          title: 'GRUNT Start',
          message: 'Great succes!'
        }
      },
      watchCSS: {
        options:{
          title: 'CSS compiled',
          message: 'Great success!'
        }
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-notify');

  // Setup tasks
  grunt.registerTask('default', ['compass']);
  grunt.registerTask('start', ['compass','notify:start','watch']);

};