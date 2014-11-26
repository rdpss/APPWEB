// Filename: Model.js
// The base model to be extended by all model classes
define(["backbone","Seva"],function (Backbone,seva) {
        // Defining the base model to be used across
        // All common model related features go here
        var Model = Backbone.Model.extend({
        	//TO-DO read the url from config
        	//msgurl:"/labels.json",
        	
            constructor: function Model() {
                var self = this;
                Backbone.Model.prototype.constructor.apply(this, arguments);
                //TODO commented due to CORS issue. Fix it
/*                seva.util.dynamicRequestFromCache(this.msgurl,function(data,status){
                	
                	for(key in data){
                    	if(data.hasOwnProperty(key)){
                    		self.set(key,data[key]);
                    	}
                    }
                }, "application/json")*/
            },

            // Returns a deep copy of the model object
            getCopy: function (id) {
                var value = this.get(id);
                return $.extend(true, {}, value);
            },

            refresh: function () {
                this.trigger("refresh");
            },

            cleanup: function () {
                this.clear();
            }

        });
        return Model;
    }
);