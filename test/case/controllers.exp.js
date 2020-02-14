require('./test/extjs/controller/Test.js');
require('./test/extjs/controller/Users.js');
Ext.application({

    name: 'Test',

    controllers: ['Test', 'Test.controller.Users']
});