require('./test/extjs/view/View2.js');
require('./test/extjs/view/View3.js');
require('./test/extjs/view/View1.js');
Ext.define('Test.view.View', {
    extend: 'Test.view.View1',

    mixins: {
        view2: 'Test.view.View2',
        view3: 'Test.view.View3'
    }
});