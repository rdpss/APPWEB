// Filename: Collection.js
// The base collection to be extended by all collection classes
define(["backbone"], function (Backbone) {
    // Defining the base collection to be used across
    // All common collection related features go here
    var Collection = Backbone.Collection.extend({

        constructor: function Collection() {
            Backbone.Collection.prototype.constructor.apply(this, arguments);
        }
    });

    return Collection;
})