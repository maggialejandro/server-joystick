'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Get require.js configs for each page
  var files = grunt.file.expand('app/scripts/*.js');
  var requirejsOptions = {};

  files.forEach(function(file) {
      var filename = file.split('/').pop();

      if(filename != 'common.js'){
        requirejsOptions[filename] = {
          options: {
              baseUrl: '<%= yeoman.app %>/scripts',
              mainConfigFile : "<%= yeoman.app %>/scripts/common.js",
              paths: {
                requireLib: 'libs/require'
              },
              include: 'requireLib',
              findNestedDependencies: true,
              name: filename.split('.')[0],
              out: '<%= yeoman.dist %>/public/scripts/'+filename
          }
        };
      }

  });

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'server.js',
          debug: true
        }
      },
      test: {
        options: {
          script: 'server.js',
          node_env: 'test'
        }
      },
      prod: {
        options: {
          script: 'dist/server.js',
          node_env: 'production'
        }
      }
    },
    requirejs: requirejsOptions,
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>',
        app: 'Firefox'
      }
    },
    watch: {
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        //tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        //tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '<%= yeoman.app %>/scripts/templates/{,*//*}*.html',
          '<%= yeoman.app %>/views/{,*//*}*.{html,jade,ejs}',
          '{.tmp,<%= yeoman.app %>}/styles/{,*//*}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*//*}*.js',
          '<%= yeoman.app %>/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}',
        ],

        options: {
          livereload: true
        }
      },
      express: {
        files: [
          'server.js',
          'lib/**/*.{js,json}'
        ],
        //tasks: ['newer:jshint:server', 'express:dev', 'wait'],
        tasks: ['express:dev'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      server: {
        options: {
          jshintrc: 'lib/.jshintrc'
        },
        src: [ 'lib/{,*/}*.js']
      },
      all: [
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/views/*',
            '<%= yeoman.dist %>/public/*',
            '!<%= yeoman.dist %>/public/.git*',
          ]
        }]
      },
      heroku: {
        files: [{
          dot: true,
          src: [
            'heroku/*',
            '!heroku/.git*',
            '!heroku/Procfile'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
      target: {
        src: [
          'app/views/*.ejs'
        ]
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            //'<%= yeoman.dist %>/public/js/{,*/}*.js',
            '<%= yeoman.dist %>/public/styles/{,*/}*.css',
            //'<%= yeoman.dist %>/public/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/public/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: [
        '<%= yeoman.app %>/views/*.ejs'
      ],
      options: {
        dest: '<%= yeoman.dist %>/public'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/views/{,*/}*.ejs',
             '<%= yeoman.dist %>/views/{,*/}*.jade'],
      css: ['<%= yeoman.dist %>/public/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>/public']
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/public/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          //collapseWhitespace: true,
          //collapseBooleanAttributes: true,
          //removeCommentsFromCDATA: true,
          //removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/views',
          src: ['*.ejs', 'partials/**/*.ejs'],
          dest: '<%= yeoman.dist %>/views'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>/public',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'images/{,*/}*.{webp}',
            'fonts/**/*'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>/views',
          dest: '<%= yeoman.dist %>/views',
          src: '**/*.jade'
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/public/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/scripts/libs',
          dest: '<%= yeoman.dist %>/public/scripts/libs',
          src: [
            'require.js'
          ]
        }, {
          expand: true,
          dest: '<%= yeoman.dist %>',
          src: [
            'package.json',
            'server.js',
            'lib/**/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        //'svgmin',
        'htmlmin'
      ]
    },

  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('dev', [
    'express:dev',
    'open',
    'watch'
  ]);

  grunt.registerTask('alfa', [
    'express:test',
    'jshint:server',
    'open'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'requirejs',
    'bowerInstall',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'copy:dist',
    'cssmin',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('beta', [
    'express:prod',
  ]);

};
