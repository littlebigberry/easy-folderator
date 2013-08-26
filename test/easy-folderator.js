var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should();

var path = require('path');

var folderator = require('../');

describe('folderator', function () {

	describe('#createPackage:"Error Handling"', function () {
		
		it('should produce an error when no options are present', function (done) {
			
			folderator
				.createPackage()
				.then(null, function (err) {
					err.should.not.equal(null);
					done();
				});

		});

		it('should produce an error when no rootDir is specified', function (done) {
			
			folderator
				.createPackage({})
				.then(null, function (err) {
					err.should.not.equal(null);
					done();
				});

		});

		it('should produce an error when rootDir is not a directory', function (done) {
			
			folderator
				.createPackage({
					rootDir: '/fake/az/dir'
				})
				.then(null, function (err) {
					err.should.not.equal(null);
					done();
				});

		});

	});

	describe('#createPackage:"Package Creation"', function () {
		
		var promise;
		var dir = path.join(__dirname, 'mocks', 'package');

		beforeEach(function () {
			promise = folderator
				.createPackage({
					rootDir: dir
				});
		});

		it('should have a result that\'s not undefined', function (done) {
			
			promise
				.then(function (result) {
					expect(result).to.not.be.undefined;
					done();
				})
				.done();
		});

		it('should have property innerFolder', function (done) {

			promise
				.then(function (pack) {
					pack.should.have.property('innerFolder');
					done();
				})
				.done();	

		});

		it('should have a property testModule', function (done) {
			promise
				.then(function (pack) {
					pack.should.have.property('testModule');
					done();
				})
				.done();
		});

		it('should have property testModule with property testProp equal to Woot, woot', function (done) {
			promise
				.then(function (pack) {
					pack.testModule.should.have.property('testProp');
					pack.testModule.testProp.should.equal('Woot, woot');
					done();
				})
				.done();
		});

		it('should have property innerFolder with property testModule with property testProp equal to Woof, woof!', function (done) {
			promise
				.then(function (pack) {
					// console.log(pack.innerFolder);
					pack.innerFolder.testModule.testProp.should.equal('Woof, woof!');
					done();
				})
				.done();
		});

		it('should have property innerFolder with property deeperInnerFolder with property testModule with property testProp equal to Bark, bark!', function (done) {
			promise
				.then(function (pack) {
					pack.innerFolder.deeperInnerFolder.testModule.testProp.should.equal('Bark, bark!');
					done();
				})
				.done();
		});

		it('should have property anotherInnerFolder', function (done) {
			promise
				.then(function (pack) {
					pack.should.have.property('anotherInnerFolder');
					done();
				})
				.done();
		});

	});

	describe('#createPackage:"Option Handling"', function () {

		var dir = path.join(__dirname, 'mocks', 'package');

		it('should captialize require prop names', function (done) {
			folderator
				.createPackage({
					rootDir: dir,
					captializeRequires: true
				})
				.then(function (pack) {
					pack.should.have.property('TestModule');
					pack.TestModule.testProp.should.equal('Woot, woot');
					done();
				})
				.done();
		});

	});

});