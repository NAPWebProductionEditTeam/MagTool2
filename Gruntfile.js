module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            build: {
                src: [
                    'bower_components/medium-editor/dist/js/medium-editor.js',
                    'bower_components/MediumButton/src/MediumButton.js',
                    'bower_components/mousetrap-js/mousetrap.js',
                    'src/js/jQuery/**',
                    'src/js/lib/**',
                    'src/js/Application/Application.js',
                    'src/js/Application/**/*.js',
                    'src/js/app.js'
                ],
                dest: 'build/js/MagazineTool.js'
            },
        },
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            options: {
                // options here to override JSHint defaults
                '-W008': true,
                globals: {
                    jQuery: true
                }
            }
        },
        jscs: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            options: {
                config: 'jscs.json',
                fix: true
            }
        },
        uglify: {
            options: {
                sourceMap: true
            },
            build: {
                files: {
                    'build/js/bookmark.min.js': ['src/js/bookmark-dev.js']
                }
            },
            dist: {
                files: {
                    'dist/js/MagazineTool.min.js': ['<%= concat.build.dest %>'],
                    'dist/js/bookmark.min.js': ['src/js/bookmark-production.js']
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
                    'dist/css/app.css': ['<%= concat.build.dest %>']
                }
            }
        },
        watch: {
            js: {
                files: ['Gruntfile.js', 'src/**/*.js'],
                tasks: ['jshint', 'jscs', 'concat:build', 'uglify:build', 'notify:concat']
            },
            tpl: {
                files: ['src/tpl/**'],
                tasks: ['htmlmin:build', 'notify:htmlmin']
            },
            sass: {
                files: ['src/scss/**/*.scss'],
                tasks: ['sass:build', 'notify:sass']
            },
            bower: {
                files: ['bower.json'],
                tasks: ['exec:bower_update']
            },
            npm: {
                files: ['package.json'],
                tasks: ['exec:npm_update']
            },
            options: {
                spawn: false,
            },
        },
        exec: {
            bower_update: {
                cmd: 'bower update'
            },
            npm_update: {
                cmd: 'npm update'
            }
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
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-exec');
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    grunt.loadNpmTasks('grunt-sass');
    
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    
    grunt.registerTask('default', ['jshint', 'jscs', 'concat:build', 'uglify:build', 'sass:build', 'htmlmin:build', 'notify:build']);
    grunt.registerTask('dist', ['jshint', 'jscs', 'concat', 'uglify', 'sass', 'htmlmin:dist', 'copy', 'notify:dist']);
    
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
