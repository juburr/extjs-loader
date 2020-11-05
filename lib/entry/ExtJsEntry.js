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
        const processor = this.processor;
        if (processor && typeof processor === 'function') {
            return processor.apply(this, arguments);
        }
    }
}