import './test/extjs/store/Test.js';
import './test/extjs/store/Users.js';
Ext.define('Test.controller.View', {

    stores: ['Test', 'Users']
});