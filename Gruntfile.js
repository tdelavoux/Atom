const sass = require("sass");

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		uglify: {
			options: {
				banner: "/*! <%= pkg.name %> /<%= pkg.version %>/ <%= grunt.template.today('yyyy-mm-dd hh:mm') %> */\n",
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
			sourceMap: true,
			outputStyle: "compressed",
		},
		build: {
			files: {
				"dist/<%= pkg.version %>/css/<%= pkg.name %>.css": "src/css/main.scss"
			}
		}
	},
	});

// Load the plugins
grunt.loadNpmTasks("grunt-contrib-uglify");
grunt.loadNpmTasks("grunt-sass");

// Default task(s).
grunt.registerTask("default", [
	"uglify",
	"sass",
]);
};
