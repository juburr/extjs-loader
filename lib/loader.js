/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Zoltan Magyar
 */
const loaderUtils = require("loader-utils");
const chalk = require('chalk');
const fs = require('fs');
const Promise = require('bluebird');
const {ExtClassParser, ExtJSEntry} = require('./extjs-class-parser.js');

module.exports.raw = true;

module.exports = function (content, map) {
    var self = this;
    if (self.cacheable) self.cacheable();
    var callback = self.async();
    var options = loaderUtils.getOptions(self) || {};

    if (map !== null && typeof map !== "string") {
        map = JSON.stringify(map);
    }

    try {
        let pathMap = options.paths;

        //Resolve custom path proccessors
        Promise.each(Object.keys(pathMap), function (map) {
            var objVal = pathMap[map];
            if (objVal.use === undefined) {
                return Promise.resolve();
            } else {
                if (objVal.use.ready) {
                    return objVal.use.ready();
                }
                var use = require(objVal.use);

                var ctor = new use(objVal.options);
                pathMap[map].use = ctor;
                return ctor.ready().then(function (list) {
                    let config = pathMap[map];
                    pathMap[map] = ctor;
                    if (Array.isArray(config.options.aliasForNs)) {
                        config.options.aliasForNs.forEach(ns => {
                            pathMap[ns] = ctor;
                        })
                    }
                    return Promise.resolve();
                })
            }
        }).then(() => {
            callback(null, new ExtClassParser(options).parse(content), map);
        });
    } catch (e) {
        console.error(chalk.red('error parsing: ') + e);
        callback(e);
    }

};
