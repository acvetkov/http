module.exports = function (grunt) {

    'use strict';

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: require('./package.json')
    });

    grunt.config('mocha', {
        test: {
            src: ['test/test.html'],
            options: {
                run: true,
                reporter: 'Nyan'
            }
        }
    });

    grunt.config('webpack.build', {
        entry: './src/http.js',
        output: {
            path: 'build/',
            filename: 'http.<%=pkg.version%>.js',
            libraryTarget: 'umd',
            library: 'http'
        }
    });

    grunt.config('uglify.build', {
        files: {
            'build/http.<%=pkg.version%>.min.js': ['build/http.<%=pkg.version%>.js']
        }
    });

    grunt.config('clean.build', {
        src: [
            'build/*.js',
            '!build/*.min.js'
        ]
    });

    grunt.config('jscs.build', {
        src: 'src/**/*.js',
        options: {
            config: '.jscsrc',
            reporter:  'console'
        }
    });

    grunt.config('jshint', {
        options: {
            jshintrc: true,
            reporter: require('jshint-stylish')
        },
        build: 'src/**/*.js'
    });

    grunt.registerTask('test', 'mocha');
    grunt.registerTask('code', ['jshint:build', 'jscs']);
    grunt.registerTask('build', ['webpack:build', 'uglify:build', 'clean:build']);
    grunt.registerTask('default', ['code', 'test', 'build']);
};
