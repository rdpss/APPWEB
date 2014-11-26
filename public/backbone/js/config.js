require.config({
    "baseUrl": "js",

    "paths": {
        "buildReq":"libs/require",
        "modernizr": "libs/modernizr",
        "text": "libs/text",
        "jquery":"libs/jquery",
        "bootstrap":"libs/bootstrap",
        "underscore": "libs/underscore",
        "backbone": "libs/backbone",
        "hammer": "libs/jquery.hammer.min",
        "lazy": "helpers/lazy.require",
        "lazyLoader": "helpers/lazy.loader",
        "jcookie": "libs/jquery.cookie",
        "backboneValidation": "libs/backbone-validation",
        "Seva": "helpers/seva.helper",
        "sevaConfig" : "../config/sevaConfig",
        "imageCarousel":"libs/owl.carousel",
        "mixin": "helpers/underscore.mixin",
        "views":"views",
        "view": "views/common/view",
        "page": "views/common/page",
        "addToCartView" : "views/common/addToCartView",
        "model": "models/common/base.model",
        "collection": "collections/common/base.collection",
        "controllers": "controllers",
        "toolbox": "helpers/toolbox",
        "templates":"../build/templates"
        
    },
    
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
        
        "seva.helper": {
            "deps": ["jquery", "backbone", "bootstrap-tooltip", "bootstrap-popopover", "bootstrap-modal"],
            "exports": "Seva"
        },

        
        "modernizr": {
            "exports": "Modernizr"
        },

        "hammer": {
            "deps": ["jquery"],
            "exports": "Hammer"
        },
        "bootstrap":{
        	"deps": ["jquery"]
        },
        "imageCarousel":{
        	"deps": ["jquery"]
        }
    }

});
