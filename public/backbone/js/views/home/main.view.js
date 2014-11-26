// Filename: HeaderPage.js
//Handles the Home page events
define(
    ["jquery", "page", 'text!templates/home/main.html' ], function($, Page, mainTPL) {
        var MainBody = Page.extend({

            templates: {
                "main": mainTPL
            },
            //Page events
            events: {
            },
            initializeView: function () {
            },

            //Render view
            renderView: function () {

                this.compiledTemplate = this.getTpl("main");
                this.$el.eHtml(this.compiledTemplate);
            }
        });
        return MainBody;
    });
