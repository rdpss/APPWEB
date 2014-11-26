define(["underscore", "mixin", "backbone", "toolbox", "lazyLoader", "views/common/home.shell", "Seva", "jquery"], function (_, _mixin, Backbone, Toolbox, LazyLoader, Shell, seva, $) {
    var BaseController = Toolbox.Base.extend({
        context: null,
        pageMetaData: {},
        localCache: {},
        getMetaDataFromJson: false,
        constructor: function (name) {
            this.cname = name;
        },
        Shell: new Shell({vid: "" }),

        parseQueryString: function (queryString) {
            var params = {};
            if (queryString) {
                _.each(
                    _.map(decodeURI(queryString).split(/&/g), function (el, i) {
                        var aux = el.split('='), o = {};
                        if (aux.length >= 1) {
                            var val = undefined;
                            if (aux.length == 2)
                                val = aux[1];
                            o[aux[0]] = val;
                        }
                        return o;
                    }),
                    function (o) {
                        _.extend(params, o);
                    }
                );
            }
            return params;
        },

        lazLdResource: function (inPageShell, inController) {
            this.setPageTitle();
            LazyLoader.loadPages(this.pageMetaData.SubViews, inPageShell, inController, function (key, value) {
            });
        },
        //this is used for rendering the subviews if they are not present in list of sub views
        renderLoadedSubViews: function (a, inPageShell, key, value) {
            var tempView = null;

            if (!(inPageShell.subViews[value])) {
                tempView = inPageShell.addSubView(value, ((new a({ vid: value, routeData: (this.routeData || null) })).loadEl(key)));
                this.listenToEvent(tempView, key);
                tempView.renderSubviewSpecifically();
            }
            else {
                //key =
                this.listenToEvent(this.Shell.subViews[value], key);
                this.rerenderSubViewIfNeeded(a, inPageShell, key, value);
            }
            ;

            // this.setSearchBarStatus(value);


        },
        setSearchBarStatus: function (value) {
            if (value === "views/common/header.view" || value === "views/checkout/common/header.view") {
                if (this.pageMetaData["page_name"] === "mHome") {
                    $('html').addClass('search-active');
                } else {
                    $('html').removeClass('search-active');
                }
            }

        },


        //this method is called when view is rendered and if we want to rerender or if we want to do any thing specific we can override here
        //template - gives template of the view, inPageShell - returns shell
        //key - gives template name , value - gives template definition
        rerenderSubViewIfNeeded: function (template, inPageShell, key, value) {

        },

        setPageMetaData: function (inContext) {
            var self = this;

            if (this.getMetaDataFromJson)
            {
                this.setPageMetaDataFromJson(inContext);
            }else
            {
                //storing the page-meta in seva since we need to pass this data to spot template if user goes from home to any spot page or travels b/w spot pages
                Seva.Template.bridgeData = this.pageMetaData = JSON.parse($("#page-meta").html());
                this.getMetaDataFromJson = true;
                this.build_number = this.pageMetaData["build_number"];
                this.listenGlobalEvents();
            }
            if(this.build_number != this.pageMetaData["build_number"]){

                window.location.reload(true);
            };
            seva.util.renderInternalCSSLinks(this.pageMetaData.cssfiles);
            this.pageMetaData.SubViews = this.loadSubViews(this.pageMetaData.page_grid);
            $.onPageLoadComplete();
        },

        setPageMetaDataFromJson: function (inContext, inurl) {
            // Write code to get it from Json using the inContext Do an ajax

            var self = this, pathName = document.location.pathname;
            if (!pathName || pathName === "/") {
                pathName = "/home";
            }
            if (pathName.indexOf("/mobile/") != -1) {
                pathName = pathName.replace("/mobile/", "/mobile/config/");
            } else {
                pathName = "/config" + pathName;
            }
            key = this.cname + '#' + seva.util.getHourOfRequest();
            var data = this.localCache[key];
            if (data) {
                if (typeof data != "string") {
                    Seva.Template.bridgeData = self.pageMetaData = data;
                }
                else {
                    Seva.Template.bridgeData = self.pageMetaData = $.parseJSON(data);
                }

            } else {
                var origin = document.location.origin;
                if (!origin) {
                    (isSecure) ? (origin = secure_domain) : (origin = domain);
                }
                seva.util.dynamicRequestFromCache(origin + pathName, function (data, status) {
                }, "application/json");
            }
        },


        loadSubViews: function (pageGrid) {
            var subviews = {};
            var html = $.parseHTML(pageGrid);
            $.each(html, function (index, val) {
                var obj = {};
                obj[$(val).attr("data-name")] = val.id;
                _.extend(subviews, obj);
            });
            return subviews;
        },

        getPageMetaDataAttributes: function (dataAttribute) {
            var attribute = (dataAttribute != undefined) ? dataAttribute : 0;
            var returnAttributes = {};

            // Check If Attribute is Not Null.
            if (attribute) {

                // Check If Given Attribute is Exist in Page Meta Data.
                if (this.pageMetaData[attribute]) {

                    // Check If Given Attribute has attribute Property.
                    if (this.pageMetaData[attribute].attribute) {
                        var attributesObject = this.pageMetaData[attribute].attribute;

                        // Iterating the Attribute Object.
                        for (property in attributesObject) {
                            returnAttributes[attributesObject[property].name] = attributesObject[property].value;
                        }

                        return returnAttributes;
                    }
                }
            }
        },

        getDeviceInfo: function () {
            var deviceInfo = this.getPageMetaDataAttributes('device_info');
            return deviceInfo;
        },
        listenGlobalEvents: function () {
            //gomez ajax part
            var self = this;
            window.onresize = function () {
                Backbone.Events.trigger('window:resize');
            };
        },
        listenToEvent: function (view, viewName) {
        },

        setPageTitle: function () {
            $("title").text("Seva Mobile : Expect More. Pay Less.");
        }

    });


    _.extend(BaseController.prototype, Backbone.Events);
    return BaseController;

});