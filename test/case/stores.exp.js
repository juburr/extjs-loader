require('./test/extjs/store/Test.js');
require('./test/extjs/store/Users.js');
Ext.define('Test.controller.View', {

    stores: ['Test', 'Users'],

    lets: function () {
        let array1 = [1, 2];
        let array2 = [1, ...array1];
        let obj1 = {a: 1};
        let obj2 = {b: 2};
        let object = {...obj1, ...obj2};
        console.log(array2 + object);
    }
});