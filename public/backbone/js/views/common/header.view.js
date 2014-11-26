//Handles the Home page events
define(
    ["jquery", "page",
        "models/common/header/header.model",
        'text!templates/common/header.html'],

    function ($, Page, HeaderModel, headerMainTpl) {

        var Header = Page.extend({

            model: new HeaderModel(),
            templates: {
                "headerMain": headerMainTpl
            },
            //Page events
            events: {
            },
            initializeView: function () {
            },

            //Render view
            renderView: function () {

                this.compiledTemplate = this.getTpl("headerMain");
                this.$el.eHtml(this.compiledTemplate);
            }

        });
        return Header;
    });