Ext.define('Test.store.Store', {
    extend: 'Ext.data.Store',

    requires: ['Test.data.Model'],

    model: 'Test.data.Model'
})