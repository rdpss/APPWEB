// Filename: app.js
// This file defines the app modules that will
function sevaCallback(){

};
/*empty function to avoid callback issue*/
function myCallback(treeResponse){
	return treeResponse;
};


define(["router"], function (Router) {
        var App = {
            // Initializes the APP module and listen for events
            initialize: function () {
                this.mainRouter = Router.initialize();
                //override backbone _updateHash method to avoid security risk with empty function
                Backbone.history._updateHash = function(){
                    return true;
                };

            }
        };
        return App;
    }
);
;


