const ExtJSEntry = require('./ExtJsEntry');
const ExtDefine = require('./define');

module.exports = new ExtJSEntry(
    [{
        type: 'Property',
        name: 'stores'
    }],
    ExtDefine,
    function (node, root) {
        let requires = [];
        let clazz = root.type === 'CallExpression' ? root.arguments[0].value : null;
        if (clazz) {
            let index = clazz.lastIndexOf('.controller.');
            if (index > 0) {
                let prefix = clazz.substring(0, index) + '.store.';
                if (node.value.type === 'ArrayExpression') {
                    requires = node.value.elements.map((element) => prefix + element.value)
                } else if (node.value.type === 'Literal') {
                    requires = [prefix + node.value.value]

                }
            }
        }
        return {
            requires: requires
        }
    }
);