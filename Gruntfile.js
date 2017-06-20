const filters = require('./docs/filters.js');
const files = require('./docs/files.js');

// Generate the documentation final:origin pairs
const transform = dir => files(__dirname + '/' + dir)
  .filter(str => /\.html\.pug$/.test(str))
  .reduce((docs, one) => {
    docs[one.replace(/\.pug$/, '')] = one;
    return docs;
  }, {});

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
        files: transform('docs')
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
