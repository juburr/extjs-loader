const ExtJSEntry = require('./ExtJsEntry');
const ExtDefine = require('./define');

module.exports = new ExtJSEntry(
    [{
        type: 'Property',
        name: ['override', 'extend']
    }],
    ExtDefine,
    function (node) {
        return {
            weight: 1,
            requires: [node.value.value]
        }
    }
);