/**
 * This class is my own wrapper on esprima to calculate validity of node position in content.
 *
 * Each instance of this class provides following information
 *
 * * path - inverted path of node in content. From node up to root node
 * * parent - parent entry
 * * processor - function, that will be invoked for calculation required imports
 *
 * Following path's step types are supported:
 *  * Property - step of reading key of ObjectExpression property
 *  * Call - step of checking executig CallExpression of some method of some object with some argument
 */
module.exports = class ExtJSEntry {

    path = null;
    parent = null;
    processor = function () {
    };

    /**
     * Entry of Ext.define(...) expression
     * @type {ExtJSEntry}
     */
    static ExtDefine = new ExtJSEntry([{
        type: 'Call',
        argumentIndex: 1,
        callee: {
            object: 'Ext',
            method: 'define'
        }
    }]);

    /**
     * Entry of Ext.application(...) expression
     * @type {ExtJSEntry}
     */
    static ExtApplication = new ExtJSEntry([{
        type: 'Call',
        argumentIndex: 0,
        callee: {
            object: 'Ext',
            method: 'application'
        }
    }])

    /**
     * Set of default ExtJS imports
     * @type {ExtJSEntry[]}
     */
    static Entries = [
        new ExtJSEntry([{
                type: 'Property',
                name: 'requires'
            }],
            [ExtJSEntry.ExtDefine, ExtJSEntry.ExtApplication],
            function (node) {
                let requires = [];
                if (node.value.type === 'ArrayExpression') {
                    requires = node.value.elements.map((element) => element.value);
                } else if (node.value.type === 'Literal') {
                    requires = [node.value.value];
                }
                return {
                    remove: true,
                    requires: requires
                }
            }
        ),
        new ExtJSEntry([{
                type: 'Property',
                name: 'mixins'
            }],
            [ExtJSEntry.ExtDefine, ExtJSEntry.ExtApplication],
            function (node) {
                let requires = [];
                if (node.value.type === 'ArrayExpression') {
                    requires = node.value.elements.map((element) => element.value);
                } else if (node.value.type === 'ObjectExpression') {
                    requires = node.value.properties.map((node) => {
                        return node.value.value;
                    });
                }
                return {
                    requires: requires
                }
            }
        ),
        new ExtJSEntry([{
                type: 'Property',
                name: 'autoCreateViewport'
            }],
            ExtJSEntry.ExtApplication,
            function (node, root) {
                let requires = [];
                if (node.value.type === 'Literal') {
                    if (typeof node.value.value === "boolean") {
                        let applicationConfig = root.type === 'CallExpression' ? root.arguments[0] : null;
                        if (applicationConfig && applicationConfig.type === 'ObjectExpression') {
                            var nameProperty = applicationConfig.properties.find((node) => node.key.name === 'name');
                            if (nameProperty) {
                                nameProperty = nameProperty.value.value;
                                requires = [nameProperty + '.view.View'];
                            }
                        }
                    } else {
                        requires = [node.value.value];
                    }
                }
                return {
                    requires: requires
                }
            }
        ),
        new ExtJSEntry(
            [{
                type: 'Property',
                name: 'uses'
            }],
            [ExtJSEntry.ExtDefine, ExtJSEntry.ExtApplication],
            function (node) {
                let requires = [];
                if (node.value.type === 'ArrayExpression') {
                    requires = node.value.elements.map((element) => element.value);
                } else if (node.value.type === 'Literal') {
                    requires = [node.value.value];
                }
                return {
                    remove: true,
                    async: true,
                    requires: requires
                }
            }
        ),
        new ExtJSEntry(
            [{
                type: 'Property',
                name: ['override', 'extend']
            }],
            ExtJSEntry.ExtDefine,
            function (node) {
                return {
                    weight: 1,
                    requires: [node.value.value]
                }
            }
        ),
        new ExtJSEntry(
            [{
                type: 'Property',
                name: ['model']
            }],
            ExtJSEntry.ExtDefine,
            function (node) {
                return {
                    requires: [node.value.value]
                }
            }
        ),
        new ExtJSEntry(
            [{
                type: 'Call',
                argumentIndex: 0,
                callee: {
                    object: 'Ext',
                    method: 'create'
                }
            }],
            null,
            function (node) {
                if (node.type === 'Literal') {
                    return {
                        requires: [node.value]
                    }
                }
            }
        ),
        new ExtJSEntry(
            [{
                type: 'Property',
                name: 'stores'
            }],
            ExtJSEntry.ExtDefine,
            function (node, root) {
                let requires = [];
                let clazz = root.type === 'CallExpression' ? root.arguments[0].value : null;
                if (clazz) {
                    let index = clazz.lastIndexOf('.controller.');
                    if (index > 0) {
                        let prefix = clazz.substring(0, index) + '.store.';
                        if (node.value.type === 'ArrayExpression') {
                            requires = node.value.elements.map((element) => prefix + element.value)
                        } else if (node.value.type === 'Literal') {
                            requires = [prefix + node.value.value]

                        }
                    }
                }
                return {
                    requires: requires
                }
            }
        ),
        new ExtJSEntry(
            [{
                type: 'Property',
                name: 'controllers'
            }],
            ExtJSEntry.ExtApplication,
            function (node, root) {
                let requires = [];
                let applicationConfig = root.type === 'CallExpression' ? root.arguments[0] : null;
                if (applicationConfig && applicationConfig.type === 'ObjectExpression') {
                    var nameProperty = applicationConfig.properties.find((node) => node.key.name === 'name');
                    if (nameProperty) {
                        nameProperty = nameProperty.value.value;
                        if (node.value.type === 'ArrayExpression') {
                            requires = node.value.elements.map((element) => element.value.startsWith(nameProperty + '.') ? element.value : (nameProperty + '.controller.' + element.value))
                        } else if (node.value.type === 'Literal') {
                            requires = [node.value.startsWith(nameProperty + '.') ? node.value : (nameProperty + '.controller.' + node.value)]
                        }
                    }
                }
                return {
                    requires: requires
                }
            }
        )
    ]

    constructor(path, parent, processor) {
        this.path = path;
        this.parent = parent;
        this.processor = processor;
    }

    /**
     * Checks that node is applicaple to current entry. If entry is not applicable, then returns null
     * @param node
     * @returns {null|root node of expression}
     */
    test(node) {
        var me = this;
        var path = me.path;
        for (let i = 0, len = path.length; i < len; i++) {
            let step = path[i];
            if (step.type == 'Property') {
                if (node.key && node.key.type === 'Identifier') {
                    let key = node.key.name;
                    let name;
                    if (Array.isArray(step.name)) {
                        name = step.name.find((n) => n === key);
                    } else {
                        if (key === step.name) {
                            name = step.name;
                        }
                    }
                    if (name) {
                        node = node.$parent;
                        continue;
                    }
                }
            } else if (step.type === 'Call') {
                var parent = node.$parent;
                if (parent && parent.type === 'CallExpression') {
                    var nodeCallee = parent.callee;
                    var object = nodeCallee.object && nodeCallee.object.type === 'Identifier' ? nodeCallee.object.name : null;
                    var method = nodeCallee.property && nodeCallee.property.type === 'Identifier' ? nodeCallee.property.name : null;

                    if (object === step.callee.object && method === step.callee.method && node === parent.arguments[step.argumentIndex]) {
                        node = parent;
                        continue;
                    }
                }
            }
            return null;
        }
        if (Array.isArray(me.parent)) {
            return me.parent.find((parent) => parent.test(node));
        } else {
            return me.parent ? me.parent.test(node) : node;
        }
    }

    process() {
        return this.processor.apply(this, arguments);
    }


}