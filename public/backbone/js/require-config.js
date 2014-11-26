//FileName: require-config.js
//Configuring the initial required modules to load the app and respective paths
var ImgServer ="backbone/js";
var domainUrl = window.location.protocol+"//"+window.location.host+"/";
require.config({
	"waitSeconds":0,
    "baseUrl": domainUrl + ImgServer,
    "paths": {
    	// Libraries.
        "modernizr": "libs/modernizr",
        "text": "libs/text",

        /* TODO: change jquery url to image server */
        "jquery":"libs/jquery",
        "bootstrap":"libs/bootstrap",
        "underscore": "libs/underscore",
        "backbone": "libs/backbone",
        "backboneValidation": "libs/backbone-validation",
        "hammer": "libs/jquery.hammer.min",
        "lazy": "helpers/lazy.require",
        "lazyLoader": "helpers/lazy.loader",
        "jcookie": "libs/jquery.cookie",
        "imageCarousel":"libs/owl.carousel",
        "sevaConfig" : "../config/sevaConfig",

        // Helper Script and App JS Files.
        "Seva": "helpers/seva.helper",
        "mixin": "helpers/underscore.mixin",
        "views":"views",
        "view": "views/common/view",
        "page": "views/common/page",
        "model": "models/base/base.model",
        "collection": "collections/common/base.collection",
        "controllers": "controllers",
        "toolbox": "helpers/toolbox",
        "templates":"../templates"
    },

    //Sets the configuration for third party
    //scripts that are not AMD compatible
    shim: {

        "underscore": {
            "exports": "_"
        },
        
        "mixin": {
        	"deps": ["underscore"],
            "exports": "_mixin"
        },

        "backbone": {
            "deps": ["underscore", "jquery"],
            "exports": "Backbone"
        },

        "backboneValidation": {
            "deps": ["backbone"],
            "exports": "bValidator"
        },

        "toolbox": {
            "deps": ["underscore"],
            "exports": "Toolbox"
        },

        //seva.helper
        "seva.helper": {
            "deps": ["jquery", "backbone", "bootstrap-tooltip", "bootstrap-popopover", "bootstrap-modal"],
            "exports": "Seva"
        },

        //modernizr
        "modernizr": {
            "exports": "Modernizr"
        },

        "hammer": {
            "deps": ["jquery"],
            "exports": "Hammer"
        },
        
        "imageCarousel":{
        	"deps": ["jquery"]
        },
        "bootstrap":{
        	"deps": ["jquery"]
        }
    }

});

require(['app'],function(App){
	if ($("#botend").length == 0) {
		App.initialize();
	}
});
