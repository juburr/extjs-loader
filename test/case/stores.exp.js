require('./test/extjs/store/Test.js');
require('./test/extjs/store/Users.js');
Ext.define('Test.controller.View', {

    stores: ['Test', 'Users']
});