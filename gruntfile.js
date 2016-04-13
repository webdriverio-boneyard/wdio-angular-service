module.exports = function (grunt) {
    grunt.initConfig({
        pkgFile: 'package.json',
        clean: ['build'],
        babel: {
            options: {
                sourceMap: false,
                plugins: ['transform-object-assign'],
                presets: ['es2015']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: './lib',
                    src: ['*.js'],
                    dest: 'build',
                    ext: '.js'
                }]
            }
        },
        mocha_istanbul: {
            coverage: {
                src: ['test/spec/*.js'],
                options: {
                    scriptPath: require.resolve('isparta/bin/isparta'),
                    reporter: 'spec',
                    mochaOptions: ['--compilers', 'js:babel/register', '--recursive'],
                    require: ['should']
                }
            }
        },
        watch: {
            dist: {
                files: ['./lib/*.js'],
                tasks: ['babel:dist']
            }
        },
        eslint: {
            options: {
                parser: 'babel-eslint'
            },
            target: ['index.js']
        },
        contributors: {
            options: {
                commitMessage: 'update contributors'
            }
        },
        bump: {
            options: {
                commitMessage: 'v%VERSION%',
                pushTo: 'upstream'
            }
        }
    })

    require('load-grunt-tasks')(grunt)
    grunt.registerTask('default', ['build'])
    grunt.registerTask('build', 'Build wdio-angular-service', function () {
        grunt.task.run([
            'eslint',
            'clean',
            'babel'
        ])
    })
    grunt.registerTask('release', 'Bump and tag version', function (type) {
        grunt.task.run([
            'build',
            'contributors',
            'bump:' + (type || 'patch')
        ])
    })
}
