// This builds the library itself
module.exports = function (grunt) {
  // Configuration
  grunt.initConfig({
    jshint: {
      src: ['Gruntfile.js', 'server.js']
    },

    browserify: {
      dist: {
        files: {
          'web/javascript.min.js': 'web/javascript.jsz'
        },
        options: {
          transform: [['babelify', { presets: ['es2015'] }], ['uglifyify']],
          browserifyOptions: {
            debug: true
          }
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'package.js', // To bump versions
          'Gruntfile.js',
          'documentation/*.**',
          'web/**/*.**',
          'server.js',
          'about.md',
          'README.md'
        ],
        tasks: ['default'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    },

    pug: {
      compile: {
        options: {
          client: false
        },
        files: {
          'index.html': 'web/views/index.html.pug',
          'about.html': 'web/views/about.html.pug',
          'documentation/index.html': 'web/views/documentation.html.pug'
        }
      }
    },

    bytesize: {
      all: {
        src: [
          'web/style.css',
          'web/javascript.js'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-bytesize');

  grunt.registerTask('build', ['browserify']);
  grunt.registerTask('test', ['jshint', 'bytesize']);
  grunt.registerTask('default', ['pug', 'test']);
};
