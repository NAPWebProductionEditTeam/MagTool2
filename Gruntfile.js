module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            build: {
                src: [
                    'bower_components/medium-editor/dist/js/medium-editor.js',
                    'bower_components/MediumButton/src/MediumButton.js',
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
                globals: {
                    jQuery: true
                }
            }
        },
        jscs: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            options: {
                config: 'jscs.json'
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
        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['tpl/**'],
                        dest: 'build/',
                    }
                ]
            },
            dist: {
                static_mappings: {
                    files: {
                        'dist/js/MagazineTool.js': ['<%= concat.build.dest %>'],
                        'dist/css/app.css': ['<%= concat.build.dest %>']
                    }
                },
                dynamic_mappings: {
                    files: [
                        {
                            expand: true,
                            cwd: 'src/',
                            src: ['tpl/**'],
                            dest: 'dist/',
                        }
                    ]
                }
            }
        },
        watch: {
            js: {
                files: ['<%= jshint.files %>'],
                tasks: ['jshint', 'jscs', 'concat:build', 'uglify:build', 'notify:concat']
            },
            tpl: {
                files: ['src/tpl/**'],
                tasks: ['copy:build']
            },
            sass: {
                files: ['src/scss/**/*.scss'],
                tasks: ['sass:build', 'notify:sass']
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
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-notify');
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    grunt.loadNpmTasks('grunt-sass');
    
    grunt.registerTask('default', ['jshint', 'jscs', 'concat:build', 'uglify:build', 'sass:build', 'copy:build', 'notify']);
    grunt.registerTask('dist', ['jshint', 'jscs', 'concat', 'uglify', 'sass', 'copy', 'notify']);
};
