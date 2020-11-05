const ExtJSEntry = require('./ExtJsEntry');

module.exports = new ExtJSEntry([{
    type: 'Call',
    argumentIndex: 0,
    callee: {
        object: 'Ext',
        method: 'application'
    }
}]);