// Filename: views/common/Page.js
// Common functionalities such as showing error message
// linking with the respective browser etc 
define(
    ["jquery", "view", 'Seva', 'router','mixin'], function($, View, Seva, Router, _mixin) {
        //Default Composite View Model to be used across the screens
        var page = View.extend({
            controller: {},
            tmplAttr: "",
            tmplString: "",
            compiledTemplate: {},
            ID: 0,
            currentViewValidationSelector: "",
            selfServeMode: false,

            constructor: function Page() {
                View.prototype.constructor.apply(this, arguments);
            },

            setMasterHTML: function(newPageDefinition) {
                var master = $("#viewport");
                var newPageDef = $(newPageDefinition);
                newPageDef = $(newPageDef).filter('[data-child != "true"]');
                if (master[0].childNodes.length > 1) {
                    this.mergePageDefinition(master, newPageDef);
                }
                // @Todo: This HardCoded Classes has to be removed, once its retrieved from JSP of Page Meta Data.
                $('#viewport #main_body').addClass('main-content');
                //master.children('#main_body').addClass('main-content');
            },
            sessionCreator: function(pageId,stopSession) {
            	var pagesValidation=["mGiftWrap","mShipaddressform","mPayment","mDelivery","mReview","mPickupInStore","mCreditCard","mSelectCard"];
            	if(_.contains(pagesValidation, pageId)){
            	}

            },
            updatePageId: function(pageid) {
                var newId = Seva.Get.Config("pageLevelId")[pageid];
                (typeof(newId) != "undefined") && ($("body").attr("id", newId));

            },
            showAccordianLoader: function(){
            	if($("#subAccordianLoader").length && this.$el){
            		this.$el.css({"position":"relative"});
            	}
            },
            hideAccordianLoader: function(){
            	
            },

            loader: function() {
                var loaderEl = '<div id="subLoader"><span class="screen-reader-only">loading</span></div>';
                this.$el.html(loaderEl);
            },

            showLoader: function () {
                $(".SevaLoading").showSpacedLoader();
            },

            hideLoader: function () {
                $(".SevaLoading").removeSpacedLoader();
            },
            blinkErrorMessage : function(message) {
            	var element,template = '<div class="transientOverlayRoot selectOptionWarningRoot bb-select-option-tap-hint"><div class="transientOverlayBody bb-select-option-warning-body"><span class="textWrap">'+message+'</span></div></div>';
            	$("#viewport").append(template);
            	element = $('.transientOverlayRoot');
            	element.css("margin-top",(-1* element.find(".transientOverlayBody").height()/2));
            	element.delay(2500).fadeOut(400,function(){
            		element.remove();
            	});
            },
            
            initialize: function(options) {
            	
            	page.__super__.initialize.call(this, options);
            	try{
            		this.initializeView();
            	}catch(e){
            	}
               
                return this;
            },

            extendEvents: function(extendedEvents) {
                _.extend(this.events, extendedEvents);
                this.delegateEvents();
            },

            initializeValidation: function(validationConfig) {
                this.validationMessages = [];
                var self = this;
                var config = _.get(validationConfig, {}),
                    successFieldClass = _.get(config.successFieldClass, 'valid'),
                    errorFieldClass = _.get(config.errorFieldClass, 'error'),
                    errorElIdSuffix = _.get(config.errorElIdSuffix, '-error-message'),
                    errorElClass = _.get(config.errorElClass, 'errorMessage'),
                    wrapperSelector = _.get(config.wrapperSelector, '.field-wrapper'),
                    validateSelector = _.get(config.validateSelector, '.validation-field'),
                    successCallback = _.get(config.successCallback, 'onFormValid'),
                    errorCallback = _.get(config.errorCallback, 'onFormInValid'),
                    debugMode = _.get(config.debugMode, false),
                    validateMethod = 'validateForm',
                    validateEvents = {},
                    validateSelectorcheckbox = validateSelector + '[type=month], [type=checkbox], ' + validateSelector + '[type=radio], ' + 'select' + validateSelector;
                // validateEvents["keyup " + validateSelector] = validateMethod;
                validateEvents["blur " + validateSelector] = validateMethod;
                validateEvents["change " + validateSelectorcheckbox] = validateMethod;
                this.extendEvents(validateEvents);
                _.extend(Backbone.Validation.callbacks, {
                    valid: function(view, attr, selector) {
                        var control = view.$('[' + selector + '=' + attr + ']'),
                            controlId = attr + errorElIdSuffix,
                            fieldWrapper = control.parents(wrapperSelector),
                            controlIdSelector = '#' + controlId;
                        onSuccessMethod = Seva.util.toCamelCase('on_' + attr + '_success');
                        if (debugMode) {};
                        if (typeof(view[onSuccessMethod]) === "function" && self.currentViewValidationSelector == attr) {
                            view[onSuccessMethod]();
                        }
                        control.removeClass(errorFieldClass);
                        fieldWrapper.find(controlIdSelector).remove();
                    },
                    invalid: function(view, attr, error, selector) {
                        var control = view.$('[' + selector + '=' + attr + ']'),
                            controlId = attr + errorElIdSuffix,
                            fieldWrapper = control.parents(wrapperSelector),
                            controlIdSelector = '#' + controlId,
                            errorEl = "<div><a id=\"" + controlId + "\" class=\"errorMessage\" tabindex=\"-1\">" + error + "</a></div>";
                        if (control.is(':visible')) {
                            onErrorMethod = Seva.util.toCamelCase('on_' + attr + '_error');
                            if (debugMode) {};
                            if (typeof(view[onErrorMethod]) === "function" && self.currentViewValidationSelector == attr) {
                                view[onErrorMethod]();
                            }
                            control.addClass(errorFieldClass);
                            fieldWrapper.find(controlIdSelector).remove();
                            fieldWrapper.append(errorEl);
                            setTimeout(function(){
                                $("#"+controlId).focus(); 
                            },100); 
                            if (!(_.isDefined(view.exceptionValidators) && (_.indexOf(view.exceptionValidators, control.attr("id")) != -1))) view.validationMessages.push(error);
                        }
                    }
                });
                Backbone.Validation.bind(this);
                this.model.on('validated:valid', this.valid, this);
                this.model.on('validated:invalid', this.invalid, this);
            },

            validateForm: function(e) {
                var $el = $(e.target),
	                elType = $el.attr('type'),
	                isOption = (elType == 'checkbox' || elType == 'radio') ? true : false;
                fieldValue = ($el.val()) ? $el.val() : '';
                if (isOption) fieldValue = ($el.is(':checked')) ? true : undefined;
                this.currentViewValidationSelector = $el.attr('id');
                
                this.model.set(this.currentViewValidationSelector, fieldValue, {
                    forceUpdate: true,
                    validate: true
                });
            },

            resetFooterPageLoader:function() {
                $('#footer').css("marginTop", 'auto');
                $('.SevaLoading').removeSpacedLoader();
            },

            goTo: function(pageName, isSwap) {
                var currentUrl = domainUrl,
                    url;
                if (isSwap) {
                    (window.location.protocol == "http:") ? (currentUrl = secure_domain) : (currentUrl = domain);
                    window.location.assign(currentUrl + ((pageName.charAt(0) !== "/") ? '/' : '') + pageName);
                    return;
                }
                currentUrl = currentUrl.replace("/mobile/","").replace("/mobile","");
                url = currentUrl.replace(window.location.protocol + "//" + window.location.host, "");
                Backbone.history.navigate(url.slice(0, url.lastIndexOf("/")) + ((pageName.charAt(0) !== "/") ? '/' : '') + pageName, {
                    trigger: true,
                    replace: false
                });
            },

            getTpl: function(tplData) {
                // @todo: The below code is comments to avoid ajax call and should be removed once text.js feature is implemented.
                // var tplData = Seva.Template.getTpl(tplFile);
                // return tplData;
                // Check If the given `argument` is String.
                // And If `templates` object property is exist in the `View` Object.
                // And If the given `argument` String is exist in the template object.
                if (tplData.search(".html") == -1) {
                    var isTplDeclared = (_.isString(tplData) && _.isIterable(this.templates) && _.isDefined(this.templates[tplData])) ? true : false;
                    return (isTplDeclared) ? this.templates[tplData] : '';
                } else {
                    var tplDataTpl = Seva.Template.getTpl(tplData);
                    return tplDataTpl;
                }
            },

            tpl: function(tplObj, tplFile, tplVars) {
                var tplData = this.getTpl(tplFile),
                    compiledTpl = _.tpl(tplObj, tplData, tplVars);
                return compiledTpl;
            },

            subTpl: function(tplObj, tplFile, tplVars) {
                var tplData = this.getTpl(tplFile);
                _.subTpl(tplObj, tplData, tplVars);
            },

            addAsSubTpl: function(tplObj, compiledTpl) {
                _.addToTplBuffer(tplObj, compiledTpl);
            },

            mergeTpl: function(tplObj, tplFile, tplVars) {
                var tplData = this.getTpl(tplFile),
                    mergeTplVars = tplVars,
                    mergedTpl = _.mergeTpl(tplObj, tplData, mergeTplVars);
                return mergedTpl;
            },

            stop: function(e) {
				if(e && e.preventDefault) {
					e.preventDefault();
				}
            },

            stopAll: function(e) {
				if(e && e.stopPropagation) {
					this.stop(e);
					e.stopPropagation();
				}
            },

            loadEl: function(id) {
                var queryString = "#" + id;
                this.$el = $(queryString);
                return this;
            },

            show: function() {
                // TODO arguments configurabiility has to be checked
                View.prototype.show.apply(this, arguments);
            },

            dispose: function() {
                if (typeof this.onDispose == 'function') {
                    this.onDispose();
                }
                this.remove();
            },

            getPageDefn: function() {
                var pageDefn = undefined;
                if ($("#selfserver").attr("data-definition")) {
                    pageDefn = JSON.parse($("#selfserver").attr("data-definition"));
                    this.selfServeMode = true;
                }
                return pageDefn;
            },

            mergePageDefinition: function(master, newPageDef) {
                var currentNode = "#pageStart";
                var currentNodeIndex = 0,
                    i = 0,
                    j = 0,
                    add;
                for (j; j < newPageDef.length; j++) {
                    add = true;
                    for (i = currentNodeIndex; i < master[0].childNodes.length; i++) {
                        if (master[0].childNodes[i].nodeType != 3) {
                            if (newPageDef[j].getAttribute("data-name") == master[0].childNodes[i].getAttribute("data-Name")) {
                                add = false;
                                currentNode = "#" + newPageDef[j].id;
                                break;
                            } else {
                                if (i == master[0].childNodes.length) {
                                    add = true;
                                }
                            }
                        }
                    }
                    if (add) {
                        $(newPageDef[j]).insertAfter(currentNode);
                        currentNode = "#" + newPageDef[j].id;
                    }
                };
                //add margin to footer so no collapse should happen
                if (window.location.protocol == "http:" && $("#header").length != 0 && $("#footer").length != 0) {
                    if ($('#footer').offset().top - $('#header').offset().top == 0) {
                        var screenHeight = window.screen.availHeight;
                        $('#footer').css("marginTop", screenHeight);
                    };
                } else if (window.location.protocol == "https:") {
                    $('#footer').css("marginTop", 'auto');
                };
            },

            getProtocolData: function(cardProtocol, protocolVar) {
                var protocolObject = _.where(cardProtocol, {
                    "name": protocolVar
                })[0]
                protocolValue = (_.isIterable(protocolObject) && _.isDefined(protocolObject.value)) ? protocolObject.value : '';
                return protocolValue;
            },
            captureRoutingLinks: function(selector) {
                  if (window.history) {
                    selector = (selector) ? selector : "a";
                    $(this.$el.find(selector)).off("click",  this.processCapturedLinks).on("click",  this.processCapturedLinks);
                }
            },
            captureIpadRoutingLinks: function(selector) {
                if (window.history) {
                  selector = (selector) ? selector : "a";
                  try{
                	  $(this.$el.find(selector)).off("click",  this.processCapturedLinks).on("click",  function(){
                    	  var link = $(this).attr("href");
                    	  window.location.assign(link);
                      });
                  }catch(err){
                	  console.log(err);
                  }
                  
              }
            },
            
            processCapturedLinks:function(e){
                var filters = ["/store-locator","/MCustomReview","/gam", "/spot", "/co-cart", "/home", "/co-login", "/co-delivery", "/co-payment", "/co-selectcard", "co-creditcard", "/co-review", "/co-shipaddrform", "/share", "/email", "/sms", "/fiats", "/fiats-results","/co-forgotpassword","/co-pickupinstore","/co-giftwrap","/s","/p","/c","/giftcard/check-balance"];
                 try{

                var link = $(this).attr("href");
                
                // forward slash handling
                if(link && (link == "/")){
                	link = "/home"
                }
                    
                    if (link) {
                    	 if(link.search("signout=true") != -1){
                             $(".SevaLoading").showSpacedLoader();
                             
                           //Remove the cookie -- Vibha for jira 5590
                           Seva.Set.removeCookie('ordNum', '', '.seva.com');
                           if(document.location.href.indexOf("seva.com") == -1){
                        	   Seva.Set.removeCookie('ordNum', '', '');
                           }
                           Seva.Set.removeCookie('eordNum', '', '.seva.com');
                           if(document.location.href.indexOf("seva.com") == -1){
                        	   Seva.Set.removeCookie('eordNum', '', '');
                           }
                         }
                        $.each(filters, function(index, item) {
                            if (link.search(item) != -1) {
                                if ((window.location.protocol === "https:" && link.search("http:") != -1) || (window.location.protocol === "http:" && link.search("https:") != -1) || ((link.search("http") != -1) && Seva.util.confirmLink(link))) {
                                    if ($(e.currentTarget).attr("target") == "_blank") return false;
                                    e.preventDefault();
                                    window.location.assign(link);
                                    return false;
                                } 
                                else {
                                    if ((item === "/co-cart" || item === "/co-delivery" || item === "/co-giftwrap" || item === "/co-pickupinstore" || item === "/co-login" || item === "/co-payment" || item === "/co-selectcard" || item === "/co-creditcard" || item === "/gam" || item === "/co-review" || item === "/co-shipaddrform" || item === "/co-forgotpassword" || item === "/giftcard/check-balance") && window.location.protocol !== "https:") {
                                        e.preventDefault();
                                        window.location.assign(secure_domain + link);
                                        return false;
                                    } else if ((item === "/spot" || item === "/MCustomReview" || item === "/store-locator" || item === "/home" || item === "/c" || item === "/s" || item === "/sms" || item === "/email" || item === "/share" || item === "/fiats" || item === "/fiats-results" || item === "/p") && window.location.protocol !== "http:") {
                                        e.preventDefault();
                                        window.location.assign(domain + link);
                                        return false;
                                    } else {
                                        e.preventDefault();
                                        var urlFinal,hasDomain = (link.search("http") != -1) ? true : false,url,urlObj;
                                      
                                        
                                        //static domain url handling
                                        if(hasDomain){
                                        	var conDomain;
                                        	urlObj = Seva.util.parseURL(link);
                                        	conDomain = urlObj.protocol + "//" + urlObj.host;
                                        	if(conDomain !== window.location.origin){
                                        		 e.preventDefault();
                                        		 window.location.assign(link);
                                                 return false;
                                        	}
                                        }
                                        
	                                     // forward slash handling
                                        if(link == "/"){
                                        	link = "/mHome"
                                        }
                                         
                                        
                                        
                                        url = domainUrl.replace("/mobile/","").replace("/mobile","");
                                        url = url.replace(window.location.protocol + "//" + window.location.host, "");
                                        if(hasDomain){
                                        	urlFinal = link.replace(window.location.protocol + "//" + window.location.host, "");
                                        }else{
                                        	urlFinal = url.slice(0, url.lastIndexOf("/")) + link;
                                        }
                                        Router.app_router().navigate(urlFinal, {
                                            trigger: true,
                                            replace: false
                                        });
                                        Seva.linkUrl = link;
                                        return false;
                                    }
                                }
                            }
                        });
                    }
                 } catch(e){
                 }

            }
        });
        return page;
    });

