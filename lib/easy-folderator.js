var fs = require('fs');
var path = require('path');
var Promise = require('promise');
var async = require('async');
var S = require('string');
var walker = require('easy-file-walker');
var readdir = Promise.denodeify(fs.readdir);
var fsstat = Promise.denodeify(fs.stat);

function checkForEmptyOptions (options) {
	return function (callback) {
		var err = null;
		if (!options) 
			err = new Error('Options object is empty');
		callback(err);
	}
}

function checkForMissingRootDir (options) {
	return function (callback) {
		var err = null;
		if (!options.rootDir)
			err = new Error('Options missing rootDir option');
		callback(err);
	}
}

function checkRootDirExists (options) {
	return function (callback) {
		fs.stat(options.rootDir, function (err, stats) {
			if (err) {
				callback(err); 
				return;
			}

			if (!stats.isDirectory())
				err = new Error(
					'Root directory: ' + 
					options.rootDir +
					' is not a directory');
			callback(err);
		});
	}
}

function captializeFirstLetter (str) {
	var strLessFirstLetter = str.substring(1);
	var capitalizedFirstLetter = str.substring(0, 1).toUpperCase();
	return capitalizedFirstLetter + strLessFirstLetter;
}

function packageJSFile (file, pack, options) {
	// console.log(file);
	var fileParts = file.split('/');
	var fileName = fileParts.pop();

	if (fileParts.length > 0) {
		packageFolder(
				fileParts.join('/'),
				pack,
				options);
	}

	var packLevel = pack;

	fileParts.forEach(function (part) {
		var propertyName = S(part).camelize().s;
		packLevel = packLevel[propertyName];
	});

	var name = fileName.slice(0, -3);
	var propertyName = S(name).camelize().s;
	if (options.captializeRequires)
		propertyName = captializeFirstLetter(propertyName);
	var fullPath = path.join(options.rootDir, file);
	packLevel[propertyName] = require(fullPath);
}

function packageFolder (file, pack, options) {

	var fileParts = file.split('/');
	var prevLevel = pack;

	fileParts.forEach(function (part) {
		var propertyName = S(part).camelize().s;
		if (typeof prevLevel[propertyName] === 'undefined')
			prevLevel[propertyName] = {};
		prevLevel = prevLevel[propertyName];
	});
}

function packageRootDir (options) {
	var pack = {};
	return function (callback) {

		walker
			.walk(options.rootDir)
			.then(function (files) {
				var count = 0;

				async.waterfall([
						function (callback) {
							files.forEach(function (file) {
								callback(null, file);
							});
						},
						function (file, callback) {
							var fullPath = path.join(options.rootDir, file);
							fsstat(fullPath)
								.then(function (stat) {
									callback(null, file, stat);
								}, function (err) {
									callback(err);
								});	
						},
						function (file, stat, callback) {

							if (!stat.isDirectory()) {
								if (file.substr(-3) === '.js') {
									packageJSFile(file, pack, options);
								}
							} else {
								// Adds folders to the module that are empty
								packageFolder(file, pack, options);
							}

							count++;
							if (count === files.length)
								callback(null, pack);
						}
					], function (err, pack) {
						callback(null, pack);
					});

			}, function (err) {
				callback(err);
			});
		
	};
}

function createPackage (options) {
	return new Promise(function (resolve, reject) {
		async.waterfall([
			checkForEmptyOptions(options),
			checkForMissingRootDir(options),
			checkRootDirExists(options),
			packageRootDir(options)
		],
		function (err, results) {
			if (err) {
				reject(err); 
				return;
			}
			resolve(results);
		});
	});
}

var folderator = {
	createPackage: createPackage
};

module.exports = folderator;