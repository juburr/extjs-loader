const ExtJSEntry = require('./ExtJsEntry');
const ExtDefine = require('./define');
const ExtApplication = require('./application');

module.exports = new ExtJSEntry(
    [{
        type: 'Property',
        name: 'uses'
    }],
    [ExtDefine, ExtApplication],
    function (node) {
        let requires = [];
        if (node.value.type === 'ArrayExpression') {
            requires = node.value.elements.map((element) => element.value);
        } else if (node.value.type === 'Literal') {
            requires = [node.value.value];
        }
        return {
            remove: true,
            async: true,
            requires: requires
        }
    }
);