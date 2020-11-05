const ExtJSEntry = require('./ExtJsEntry');
const ExtApplication = require('./application');

module.exports = new ExtJSEntry(
    [{
        type: 'Property',
        name: 'controllers'
    }],
    ExtApplication,
    function (node, root) {
        let requires = [];
        let applicationConfig = root.type === 'CallExpression' ? root.arguments[0] : null;
        if (applicationConfig && applicationConfig.type === 'ObjectExpression') {
            var nameProperty = applicationConfig.properties.find((node) => node.key.name === 'name');
            if (nameProperty) {
                nameProperty = nameProperty.value.value;
                if (node.value.type === 'ArrayExpression') {
                    requires = node.value.elements.map((element) => element.value.startsWith(nameProperty + '.') ? element.value : (nameProperty + '.controller.' + element.value))
                } else if (node.value.type === 'Literal') {
                    requires = [node.value.startsWith(nameProperty + '.') ? node.value : (nameProperty + '.controller.' + node.value)]
                }
            }
        }
        return {
            requires: requires
        }
    }
);