// Filename: router.js
define(['jquery','underscore','backbone',"lazyLoader","Seva"], function ($, _, Backbone, LazyLoader,Seva) {
    var AppRouter = Backbone.Router.extend({
        controllerMap: {hc: "controllers/home/home.controller"
        				},
        currentController: null,

        getMetaDataFromJson: false,
        
        
        routeData : {},
        
        routes: {
            //default will take to the home page
            '*actions': 'defaultAction'
        },
        constructor: function Router() {
            Backbone.Router.prototype.constructor.apply(this, arguments);
        },
   

        initController: function (controller,context) {
            if(controller!=undefined){
            	if(this.currentController){
            		this.currentController.stopListening();
                	delete this.currentController;
            	}
            	this.currentController = controller;
            	
            	if(_.isEmpty(this.routeData)){
            		 controller.setPageMetaData(context);
            	}else{
            		 controller.setPageMetaData(context, _.extend({},this.routeData));
            		 this.routeData ={};
            	}
               
                var pageName = controller.pageMetaData.page_name;
                controller.Shell.clearNotNeededPages(controller.pageMetaData.SubViews);
                controller.Shell.setMasterHTML(controller.pageMetaData.page_grid);
                controller.Shell.updatePageId(controller.pageMetaData.page_name);
                this.listenTo(controller,"navigate", this.navigateInitiate);
                controller.lazLdResource(controller.Shell, controller);
            }
        },

        navigateInitiate: function(options){
            this.navigate(options.fragment,options.trigger);
            this.backboneRouted = true;
        }

    });
    
     var app_router= null;
    
    var initialize = function () {
        app_router = new AppRouter();
        var basepath = domainUrl.replace(window.location.protocol + "//" + window.location.host+"/", "")
        app_router.on('route:defaultAction', function (action) {
            LazyLoader.loadController([this.controllerMap.hc], this,action,app_router.currentController);
        });

        Backbone.Events.on('ROUTE_DATA',function(data){
        	 _.extend(app_router.routeData,data);
        });
        
        Backbone.Events.on('jsonLoaded',function(data){
        	gomezObj.initGomez(data);
       });
        
        Backbone.history.start({ pushState:true,root: ""}); 
    };
    var getRouter = function(){
    	return app_router;
    };
    return {
        initialize: initialize,
        "app_router" : getRouter
    };
});

