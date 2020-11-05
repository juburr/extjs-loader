const ExtJSEntry = require('./ExtJsEntry');

module.exports = new ExtJSEntry([{
    type: 'Call',
    argumentIndex: 1,
    callee: {
        object: 'Ext',
        method: 'define'
    }
}]);