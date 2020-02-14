Ext.define('Test.view.View', {
    extend: 'Ext.view.Panel',

    someFunc: function () {
        var panel = Ext.create('Test.item.Panel', {prop1: 1});

        var variable = 'Test.item.Panel2';
        Ext.create(variable, {prop1: 1});
    }
});