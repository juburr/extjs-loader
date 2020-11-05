const ExtJSEntry = require('./ExtJsEntry');
const ExtDefine = require('./define');

module.exports = new ExtJSEntry(
    [{
        type: 'Property',
        name: ['model']
    }],
    ExtDefine,
    function (node) {
        return {
            requires: [node.value.value]
        }
    }
);