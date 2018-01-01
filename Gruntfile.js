const filters = require('./docs/filters.js');
const files = require('./docs/files.js');

const fs = require('fs')

function extract(src) {
  const data = {};
  const readme = fs.readFileSync(src + 'README.md', 'utf-8');
    data.title = (readme.match(/^\#\s(.+)/mg) || []).map(one => one.replace(/^\#\s/, ''))[0];
  if (!data.title) throw new Error('Your file ' + file + '/README.md has no h1 in markdown');
  data.sections = (readme.match(/^\#\#[\s](.+)/gm) || []).map(one => one.replace(/^\#\#\s/, ''));
  return data;
}

function getInfo(src) {
  delete require.cache[require.resolve(src)];
  const info = {};
  if (/documentation/.test(src)) {
    const base = { title: 'Introduction', url: '/documentation/' };
    info.introduction = Object.assign({}, extract(src), base);
  }
  return require(src).reduce((obj, one) => {
    return Object.assign({}, obj, { [one]: extract(src + one + '/') });
  }, info);
}

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
          'docs/assets/style.min.css',
          'docs/assets/javascript.js'
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
        files: { 'docs/assets/style.min.css': 'docs/assets/style.scss' }
      }
    },

    pug: {
      compile: {
        options: {
          client: false,
          data: file => {
            return {
              require,
              file,
              tutorials: getInfo('./docs/tutorials/'),
              documentation: getInfo('./docs/documentation/'),
              slug: str => str.toLowerCase().replace(/[^\w]+/g, '-')
            };
          },
          filters: filters
        },
        files: transform('docs')
      }
    },

    watch: {
      scripts: {
        files: [
          'Gruntfile.js',

          // Docs
          'docs/**/*.*',
          'README.md',

          // For testing:
          'server.js',
          'src/**/*.js',

          // To bump versions
          'package.js'
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
