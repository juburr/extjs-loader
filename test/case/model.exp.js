require('./test/extjs/data/Model.js');
Ext.define('Test.store.Store', {
    extend: 'Ext.data.Store',

    model: 'Test.data.Model'
})