const filters = require('./docs/filters.js');

// This builds the library itself
module.exports = function (grunt) {
  // Configuration
  grunt.initConfig({

    bytesize: {
      all: {
        src: [
          'docs/style.min.css',
          'docs/javascript.js'
        ]
      }
    },

    jshint: {
      options: { esversion: 6 },
      src: ['Gruntfile.js', 'server.js', 'src']
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

    sass: {
      dist: {
        options: { style: 'compressed' },
        files: { 'docs/style.min.css': 'docs/style.scss' }
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
          'docs/errors/index.html': 'docs/errors/index.html.pug',
          'docs/sponsor/index.html': 'docs/sponsor/index.html.pug',
          'docs/documentation/index.html': 'docs/documentation/index.html.pug',
          'docs/documentation/options/index.html': 'docs/documentation/options/index.html.pug',
          'docs/documentation/middleware/index.html': 'docs/documentation/middleware/index.html.pug',
          'docs/documentation/router/index.html': 'docs/documentation/router/index.html.pug',
          'docs/documentation/advanced/index.html': 'docs/documentation/advanced/index.html.pug'
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'package.js', // To bump versions
          'Gruntfile.js',
          'documentation/*.**',
          'docs/**/*.*',
          'server.js',
          'about.md',
          'README.md',
          'src/**/*.js'
        ],
        tasks: ['default'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bytesize');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('build', ['sass', 'pug']);
  grunt.registerTask('test', ['bytesize']);
  grunt.registerTask('default', ['build', 'test', 'connect']);
};
