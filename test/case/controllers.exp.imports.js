import './test/extjs/controller/Test.js';
import './test/extjs/controller/Users.js';
Ext.application({

    name: 'Test',

    controllers: ['Test', 'Test.controller.Users']
});