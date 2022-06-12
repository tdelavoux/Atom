const sass = require('dart-sass');

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> /<%= pkg.version %>/ <%= grunt.template.today("yyyy-mm-dd-hh:mm") %> */\n',
				mangle: false
			},
			build_concat: {
				src: "src/js/*.js",
				dest: "dist/<%= pkg.version %>/js/<%= pkg.name %>-all.min.js",
			},
			build_individuals: {
				files: [
					{
						expand: true,
						cwd: "src/js/",
						src: "*.js",
						dest: "dist/<%= pkg.version %>/js/",
						ext: ".min.js"
					}
				]
			}
		},
		sass: {
			options: {
				implementation: sass,
				sourceMap: true
			},
			build_unminified: {
				files: {
					'build/css/<%= pkg.name %>.css': 'src/css/*.scss'

				}
			}
		},
		cssmin: {
			css: {
				expand: true,
				cwd: "build/css/",
				src: "*.css",
				dest: "dist/<%= pkg.version %>/css/",
				ext: ".min.css"
			}
		}
	});

	// Load the plugins
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	// Default task(s).
	grunt.registerTask("default", [
		"uglify",
		"sass",
		"cssmin",
	]);
};
