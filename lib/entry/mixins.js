const ExtJSEntry = require('./ExtJsEntry');
const ExtApplication = require('./application');
const ExtDefine = require('./define');

module.exports = new ExtJSEntry([{
        type: 'Property',
        name: 'mixins'
    }],
    [ExtDefine, ExtApplication],
    function (node) {
        let requires = [];
        if (node.value.type === 'ArrayExpression') {
            requires = node.value.elements.map((element) => element.value);
        } else if (node.value.type === 'ObjectExpression') {
            requires = node.value.properties.map((node) => {
                return node.value.value;
            });
        }
        return {
            requires: requires
        }
    }
);