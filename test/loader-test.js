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
});

describe('ExtClassParser resolve class', function () {

    let test = function (paths, className, expected, done) {
        let parser = new ExtClassParser({
            paths: paths
        });

        var resolve = parser.resolveClassFile(className);

        expect(expected).to.equalIgnoreSpaces(resolve[0]);
        done();
    }

    it('Correct resolve similar path', (done) => {
        test({
            Ext: './test/extjs',
            "Ext.ux": './test/source'
        }, 'Ext.ux.data.Model', './test/source/data/Model.js', done);
    });

    it('Checking reqexp', (done) => {
        test({
            "Ext.ux": './test/source',
            ExtTux: './test/exttux'
        }, 'ExtTux.data.Model', './test/exttux/data/Model.js', done);
    });

});