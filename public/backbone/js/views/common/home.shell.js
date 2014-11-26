// Filename: HomeShell.js
//Handles the Home page events

define(
    ["jquery", "page"],

    function ($, Page) {
        var HomeShell = Page.extend({
            subViews: {},

            //Page events
            events: {
            	
            },

            constructor: function HomeShell() {
                Page.prototype.constructor.apply(this, arguments);
            },

            initializeView:function(){
            	var self =this;
            	$(window).on("orientationchange scroll",function(e){
            		self.stopAll(e);
            		Backbone.Events.trigger(e.type,e);
            	 
            	});
            },

            //Render view
            renderView: function () {
            	// Put Identifier for Bot Agent rendering to stop in app.js
            	if ($("#botend").length == 0) {
            		$('#viewport').append( "<div id=\"botend\"/>" );
            	}
            	
                // The Shell can have DVM/ Skin content put into them
            }
            
            

        });
        return HomeShell;
    }
);