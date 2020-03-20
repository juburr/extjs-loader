var chai = require('chai');
chai.use(require('chai-string'));
var assert = chai.assert;
var expect = chai.expect;
var fs = require('fs');
var path = require('path');

const {ExtClassParser} = require('../lib/extjs-class-parser.js');

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