// This builds the library itself
module.exports = function (grunt) {
  // Configuration
  grunt.initConfig({
    jshint: {
      ignore_warning: {
        src: ['Gruntfile.js', 'server.js'],
        options: {
          '-W043': true  // Allow for multiline with \ backslash
        }
      }
    },

    // uglify: {
    //   options: {
    //     banner: '/* Umbrella JS ' + grunt.file.readJSON('package.json').version + ' umbrellajs.com */\n'
    //   },
    //   my_target: {
    //     files: {
    //       'umbrella.min.js': 'umbrella.js'
    //     }
    //   }
    // },

    watch: {
      scripts: {
        files: [
          'package.js', // To bump versions
          'Gruntfile.js',
          'documentation/*.**',
          'public/*.**',
          'views/**/*.**',
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
          'index.html': 'views/index.html.pug',
          'about.html': 'views/about.html.pug',
          'documentation/index.html': 'views/documentation.html.pug'
        }
      }
    },

    // concat: {
    //   main: {
    //     // No test files
    //     options: {
    //       process: function (src, file) {
    //         return /test\.js/.test(file) ? '' : src;
    //       }
    //     },
    //     files: {
    //       'umbrella.js': ['src/umbrella.js', 'src/plugins/**/*.js', 'src/export.js'],
    //       'documentation.md': ['src/readme.md', 'src/plugins/**/readme.md']
    //     }
    //   },
    //   test: {
    //     files: {
    //       'test/test.js': ['src/test.js', 'src/plugins/**/test.js']
    //     }
    //   }
    // },

    bytesize: {
      all: {
        src: [
          'public/style.css',
          'public/javascript.js'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-bytesize');

  grunt.registerTask('build', ['concat', 'uglify', 'pug']);
  grunt.registerTask('test', ['bytesize']);
  grunt.registerTask('default', ['pug', 'test']);
};
