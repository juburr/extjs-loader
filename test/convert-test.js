const chai = require('chai');
chai.use(require('chai-string'));
const sinon = require("sinon").createSandbox();
const assert = chai.assert;
const expect = chai.expect;
const fs = require('fs');
const path = require('path');

const {ExtClassParser} = require('../lib/extjs-class-parser.js');

describe('ExtClassParser convert result', function () {

    var sandBox;
    beforeEach(() => {
        sinon.stub(fs, 'existsSync').returns(true);
    });

    afterEach(() => {
        sinon.restore();
    });

    const test = function (caseName, imports, done) {
        const source = fs.readFileSync(path.resolve('test/case', caseName + '.js'), {encoding: 'utf-8'});
        const expected = fs.readFileSync(path.resolve('test/case', caseName + '.exp' + (imports ? '.imports.js' : '.js')), {encoding: 'utf-8'});

        const parseResult = new ExtClassParser({
            imports: imports,
            paths: {
                Test: './test/extjs',
                Test2: './test/source'
            }
        }).parse(source);

        expect(expected).to.equalIgnoreSpaces(parseResult);
        done();
    }

    const cases = {
        'Simple': 'simple',
        'Requires': 'requires',
        'Single Requires': 'single_requires',
        'Requires app': 'requires.app',
        'Uses': 'uses',
        'Namespace bug is fixed': 'namespace',
        'Using override property in config': 'property_override',
        'Ext create': 'ext_create',
        'Stores': 'stores',
        'Controllers': 'controllers',
        'Model': 'model',
        'AutoCreateViewport': 'autoCreateViewport',
        'AutoCreateViewport True': 'autoCreateViewport_true',
        'Mixins Array': 'mixins_array',
        'Mixins Object': 'mixins_object',
        'Extend': 'extend',
        'Module Import': 'module',
        'Module Requires': 'js_require'
    }

    for (var key in cases) {
        if (cases.hasOwnProperty(key)) {
            it(key, function (done) {
                test(cases[key], false, done);
            });

            it(key + '/Imports', function (done) {
                test(cases[key], true, done);
            });
        }
    }

});