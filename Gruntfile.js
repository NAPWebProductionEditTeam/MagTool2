module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            build: {
                src: [
                    'bower_components/medium-editor/dist/js/medium-editor.js',
                    'bower_components/MediumButton/src/MediumButton.js',
                    'bower_components/mousetrap-js/mousetrap.js',
                    'bower_components/mousetrap-js/plugins/global-bind/mousetrap-global-bind.js',
                    'bower_components/bootstrap-sass/assets/javascripts/bootstrap/modal.js',
                    'bower_components/jszip/dist/jszip.js',
                    'src/js/jQuery/**/*.js',
                    'src/js/vendor.js',
                    'src/js/lib/**/*.js',
                    'src/js/Application/Application.js',
                    'src/js/Application/**/*.js',
                    'src/js/app.js'
                ],
                dest: 'build/js/MagazineTool.js'
            },
        },
        browserify: {
            vendor: {
                src: [],
                dest: 'src/js/vendor.js',
                options: {
                    require: ['html-minifier', 'relateurl', 'uglify-js', 'clean-css']
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', '!src/js/vendor.js'],
            options: {
                '-W008': true,
                '-W107': true,
                globals: {
                    jQuery: true
                }
            }
        },
        jscs: {
            files: ['Gruntfile.js', 'src/**/*.js', '!src/js/vendor.js'],
            options: {
                config: 'jscs.json',
                fix: true
            }
        },
        uglify: {
            build: {
                options: {
                    compress: {
                        negate_iife: false
                    }
                },
                files: {
                    'build/js/bookmark.min.js': ['src/js/bookmark.js']
                }
            },
            dist: {
                options: {
                    sourceMap: true
                },
                files: {
                    'dist/js/MagazineTool.min.js': '<%= concat.build.src %>'
                }
            },
            bookmark: {
                options: {
                    compress: {
                        negate_iife: false
                    }
                },
                files: {
                    'dist/js/bookmark.min.js': ['src/js/bookmark.js']
                }
            }
        },
        sass: {
            build: {
                options: {
                    sourceMap: true,
                    outputStyle: 'expanded'
                },
                files: {
                    'build/css/app.css': 'src/scss/app.scss'
                }
            },
            dist: {
                options: {
                    sourceMap: true,
                    outputStyle: 'compressed'
                },
                files: {
                    'dist/css/app.min.css': 'src/scss/app.scss'
                }
            }
        },
        htmlmin: {
            options: {
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeRedundantAttributes: true,
                removeEmptyAttributes: true,
                quoteCharacter: '"'
            },
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['tpl/**.html'],
                        dest: 'build/',
                    }
                ]
            },
            dist: {
                options: {
                    removeComments: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['tpl/**.html'],
                        dest: 'dist/',
                    }
                ]
            }
        },
        copy: {
            dist: {
                files: {
                    'dist/js/MagazineTool.js': ['<%= concat.build.dest %>'],
                    'dist/css/app.css': 'build/css/app.css'
                }
            }
        },
        'string-replace': {
            options: {
                replacements: [
                    {
                        pattern: '{{ APP_ENV }}',
                        replacement: function() {
                            return grunt.option('env') || 'dist';
                        }
                    },
                    {
                        pattern: /^/,
                        replacement: 'javascript:'
                    }
                ]
            },
            build: {
                files: {
                    'build/js/bookmark.min.js': 'build/js/bookmark.min.js'
                }
            },
            dist: {
                files: {
                    'dist/js/bookmark.min.js': 'dist/js/bookmark.min.js'
                }
            }
        },
        exec: {
            bower_update: {
                cmd: 'bower update'
            },
            npm_update: {
                cmd: 'npm update'
            }
        },
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['exec:bower_update']
            },
            npm: {
                files: ['package.json'],
                tasks: ['exec:npm_update']
            },
            js: {
                files: ['Gruntfile.js', 'jscs.json', 'src/**/*.js', '!src/js/vendor.js'],
                tasks: ['jshint', 'jscs', 'browserify', 'concat:build', 'uglify:build', 'string-replace:build', 'notify:concat']
            },
            tpl: {
                files: ['src/tpl/**'],
                tasks: ['htmlmin:build', 'notify:htmlmin']
            },
            sass: {
                files: ['src/scss/**/*.scss'],
                tasks: ['sass:build', 'notify:sass']
            },
            options: {
                spawn: false,
            },
        },
        notify: {
            concat: {
                options: {
                    title: 'Concat Complete',
                    message: 'JS files concatenated'
                }
            },
            uglify: {
                options: {
                    title: 'Uglify Complete',
                    message: 'JS files uglified'
                }
            },
            sass: {
                options: {
                    title: 'Sass Complete',
                    message: 'Sass files compiled'
                }
            },
            htmlmin: {
                options: {
                    title: 'Templates Minified',
                    message: 'Template files minified'
                }
            },
            build: {
                options: {
                    title: 'Build complete',
                    message: 'The grunt build was successfull'
                }
            },
            dist: {
                options: {
                    title: 'Distribution complete',
                    message: 'The grunt distribution build was successfull'
                }
            },
            bookmarks: {
                options: {
                    title: 'Bookmarks generated',
                    message: 'The dev and dist bookmarks were generated successfully'
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-exec');
    
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    grunt.loadNpmTasks('grunt-sass');
    
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    
    grunt.registerTask('env:dev', function() {
        grunt.option('env', 'dev');
    });
    grunt.registerTask('env-default:dev', function() {
        if (! grunt.option('env')) {
            grunt.option('env', 'dev');
        }
    });
    
    grunt.registerTask('default', ['env-default:dev', 'jshint', 'jscs', 'browserify', 'concat:build', 'uglify:build', 'sass:build', 'htmlmin:build', 'string-replace:build', 'notify:build']);
    grunt.registerTask('dist', ['exec', 'jshint', 'jscs', 'browserify', 'concat', 'uglify:dist', 'uglify:bookmark', 'sass', 'htmlmin:dist', 'copy', 'string-replace:dist', 'notify:dist']);
    grunt.registerTask('bookmarks', ['uglify:bookmark', 'string-replace:dist', 'env:dev', 'uglify:build', 'string-replace:build', 'notify:bookmarks']);
    
    grunt.registerTask('update', ['exec']);
    
    var changedFiles = Object.create(null);
    var onChange = grunt.util._.debounce(function() {
        var files = grunt.file.match(['Gruntfile.js', 'src/**/*.js'], Object.keys(changedFiles));
        
        grunt.config('jshint.files', files);
        grunt.config('jscs.files', files);
        changedFiles = Object.create(null);
    }, 200);
    
    grunt.event.on('watch', function(action, filepath) {
        changedFiles[filepath] = action;
        onChange();
    });
};
