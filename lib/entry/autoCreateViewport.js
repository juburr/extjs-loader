const ExtJSEntry = require('./ExtJsEntry');
const ExtApplication = require('./application');

module.exports = new ExtJSEntry([{
        type: 'Property',
        name: 'autoCreateViewport'
    }],
    ExtApplication,
    function (node, root) {
        let requires = [];
        if (node.value.type === 'Literal') {
            if (typeof node.value.value === "boolean") {
                let applicationConfig = root.type === 'CallExpression' ? root.arguments[0] : null;
                if (applicationConfig && applicationConfig.type === 'ObjectExpression') {
                    var nameProperty = applicationConfig.properties.find((node) => node.key.name === 'name');
                    if (nameProperty) {
                        nameProperty = nameProperty.value.value;
                        requires = [nameProperty + '.view.Viewport'];
                    }
                }
            } else {
                requires = [node.value.value];
            }
        }
        return {
            requires: requires
        }
    }
);