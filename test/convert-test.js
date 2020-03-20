var chai = require('chai');
chai.use(require('chai-string'));
var assert = chai.assert;
var expect = chai.expect;
var fs = require('fs');
var path = require('path');

const {ExtClassParser} = require('../lib/extjs-class-parser.js');

describe('ExtClassParser convert result', function () {

    let test = function (caseName, done) {
        let source = fs.readFileSync(path.resolve('test/case', caseName + '.js'), {encoding: 'utf-8'});
        let expected = fs.readFileSync(path.resolve('test/case', caseName + '.exp.js'), {encoding: 'utf-8'});

        let parseResult = new ExtClassParser({
            paths: {
                Test: './test/extjs',
                Test2: './test/source'
            }
        }).parse(source);

        expect(expected).to.equalIgnoreSpaces(parseResult);
        done();

    }

    it('Simple', function (done) {
        test('simple', done);
    });

    it('Requires', function (done) {
        test('requires', done);
    });

    it('Single Requires', function (done) {
        test('single_requires', done);
    });

    it('Requires app', function (done) {
        test('requires.app', done);
    });

    it('Uses', function (done) {
        test('uses', done);
    });

    it('Namespace bug is fixed', function (done) {
        test('namespace', done);
    });

    it('Using override property in config', function (done) {
        test('property_override', done);
    });

    it('Ext create', function (done) {
        test('ext_create', done);
    });

    it('Stores', function (done) {
        test('stores', done);
    });

    it('Controllers', function (done) {
        test('controllers', done);
    });

    it('Model', function (done) {
        test('model', done);
    });

    it('AutoCreateViewport', function (done) {
        test('autoCreateViewport', done);
    });

    it('AutoCreateViewport True', function (done) {
        test('autoCreateViewport_true', done);
    });

    it('Mixins Array', function (done) {
        test('mixins_array', done);
    });

    it('Mixins Object', function (done) {
        test('mixins_object', done);
    });
});