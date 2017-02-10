/* jshint esversion: 6 */
const filters = require('./docs/filters.js');

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
          'docs/javascript.min.js': 'docs/javascript.jsz'
        },
        options: {
          transform: [['babelify', { presets: ['es2015'] }], ['uglifyify']],
          browserifyOptions: {
            debug: true
          }
        }
      }
    },

    // Launch a small static server
    connect: {
      server: {
        options: {
          port: 3000,
          hostname: '*',
          base: 'docs',
          livereload: true,
          useAvailablePort: false
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'package.js', // To bump versions
          'Gruntfile.js',
          'documentation/*.**',
          'docs/**/*.**',
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
          client: false,
          data: {},
          filters: filters
        },
        files: {
          'docs/index.html': 'docs/index.html.pug',
          'docs/about/index.html': 'docs/about/index.html.pug',
          'docs/documentation/index.html': 'docs/documentation/index.html.pug',
          'docs/documentation/server/index.html': 'docs/documentation/server/index.html.pug',
          'docs/documentation/middleware/index.html': 'docs/documentation/middleware/index.html.pug',
          'docs/documentation/router/index.html': 'docs/documentation/router/index.html.pug',
          'docs/documentation/advanced/index.html': 'docs/documentation/advanced/index.html.pug'
        }
      }
    },

    bytesize: {
      all: {
        src: [
          'docs/style.css',
          'docs/javascript.js'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-bytesize');

  grunt.registerTask('build', ['browserify']);
  grunt.registerTask('test', ['jshint', 'bytesize']);
  grunt.registerTask('default', ['pug', 'test', 'connect']);
};
