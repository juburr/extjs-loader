Ext.define('Test.controller.View', {

    stores: ['Test', 'Users'],

    lets: function () {
        let array1 = [1, 2];
        let array2 = [1, ...array1];
        console.log(array2);
    }
});