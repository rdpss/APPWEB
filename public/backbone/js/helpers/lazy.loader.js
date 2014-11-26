define(["lazy"], function(lazyRequire) {
    var requireOnce = lazyRequire.once();
    var LazyLoader = {
        loadPages: function(pageNameArray, inPageShell, inController, callback) {
            var self = this;
            try {
                objLength = 0;
                totLength = Object.keys(pageNameArray).length;
                _.each(pageNameArray, function(key, value) {
                    requireOnce([value], function(a) {
                        inController.renderLoadedSubViews(a, inPageShell, key, value);
                        callback.call(inController,key, value);
                        objLength++;
                        if (objLength == totLength) {
                            inController.process();
                            inController.isRendered = true;
                        }
                    });
                });
                inPageShell.renderView();
            } catch (err) {
                // TODO Handle Error gracefully abd pass back error to UI
                
            }
        },
        /* Loads the controller based on the router to intialize the page
         dep: controller to be lazy loaded, router initialize will called
         after controller load */
        loadController: function(controller, router, action, currentController,path) {
            try {
                path=path||"";
                requireOnce(controller, function(a) {
                    $("#page-meta").ready(function($) {
                    	var proceed = true,page_name=_.invert(router.controllerMap)[controller];
                    	if(page_name && !(page_name == "cart" || page_name == "forgotpassword" || page_name == "login" || path == "login" ||path == "guestregistration")){

                    	}
                    	
                    	if(proceed){
                        if (currentController instanceof a) {
                            currentController.cname=controller[0]+path;
                            router.initController(currentController, action);
                        } else {
                            router.initController(new a(controller[0]+path), action);
                        }
                    	}
                    });
                });
            } catch (err) {
                // TODO Handle Error gracefully abd pass back error to UI
                
            }
        }
    }
    return LazyLoader;
});