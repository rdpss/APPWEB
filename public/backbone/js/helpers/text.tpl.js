define(['text'], function (text) {
    'use strict';

    var tpl = {
        load: function (name, req, load, config) {

            var tplBasePath = 'text!' + config.tplBasePath + name;

            // Do not bother with the work if a build
            if (config.isBuild) {
                load();
                return;
            }

            req([tplBasePath], function (value) {
                load(value);
            });
        }
    };

    return tpl;
});