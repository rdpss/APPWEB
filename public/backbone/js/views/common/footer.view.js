// Filename: HeaderPage.js
//Handles the Home page events

define(
    ["jquery", "page", "Seva", "router","text!templates/common/footer.html"],

    function ($, Page, Seva, Router, footerMainTpl) {
        var Footer = Page.extend({

            //Page events
            events: {
            },
            
            templates:{
              "footerMain": footerMainTpl
            },

            constructor: function Footer() {
                Page.prototype.constructor.apply(this, arguments);
            },

            //Initialize View
            initializeView: function(){
            },

            //Render view
            renderView: function () {
                this.compiledTemplate = this.getTpl("footerMain");
                this.$el.html(this.compiledTemplate);
            }

        });
        return Footer;
    }
);
