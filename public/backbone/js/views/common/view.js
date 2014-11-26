// Filename: views/common/View.js
// the core functionalities of registering to events,
// rendering of composite views 
// all model binding etc, are done here 
define(["jquery", "backbone", "hammer","lazyLoader", "Seva"],

	    function ($, Backbone, Hammer, lazyLoader, Seva) {

        var delegateEventSplitter = /^(\S+)\s*(.*)$/;
        var viewOptions = ['hammerEvents', 'hammerOptions'];

        var View = Backbone.View;
        var delegateEvents = View.prototype.delegateEvents;
        var undelegateEvents = View.prototype.undelegateEvents;
        
        var bsdlObj = {
	    	staticData : {
	        	platform		: "mobile",
	        	environment     : "UIMOD",
	        	deviceId		: "NA",
	        	deviceType		: "NA",
	        	userAgent		: "D=User-Agent"
	    	},
	    	dynamicData : {
	        	server			: "m.seva.com",
	        	myStoreSetting	: Seva.Get.Cookie("myStoreId") != "" ? "yes" : "no"
	    	}
        };

        //Default Composite View Model to be used across the screens
        var View = Backbone.View.extend({
            isRendered: false,
            parentView: null,
            css : null,
            
            eventBsdlObj : {},
            eventType    : "",
            
            toggleCustomCheckBox: function(e) { 
            	
				var $obj = $(e.currentTarget),
					$span = $obj.find('span'),
					$checkbox = $obj.find(':checkbox'); 
				if ($obj.attr('aria-checked') == 'true') { 
					$obj.attr('aria-checked', 'false'); 
					$span.removeClass("true"); 
					$checkbox.prop('checked', false);
				} else { 
					$obj.attr('aria-checked', 'true'); 
					$span.addClass("true"); 
					$checkbox.prop('checked', true);
				} 
            }, 
            
            //Sets the associated model
            setModel: function (model) {
                var prevModel = this["model"];
                this.stopListening(prevModel);
                if (model != null) {
                    this.listenTo(model, "refresh", this.onModelRefresh);
                }
                this["model"] = model;
            },
            
            initialize : function(){

    			//Gomez
            	
            	var self	=	this;
    			
    			if(self.nft)
    			{
	    			if(self.nft.gmzViewId)
	    			{
	    				gomezObj.startGomezInterval(self.nft.gmzViewId);
	    				self.listenTo(self, 'logGomezViewEnds', function(){ 
	    					gomezObj.endGomezInterval(self.nft.gmzViewId); 
	    				});
	    			}
    			}
            },

            //Gets the associated model
            getModel: function () {
                return this["model"];
            },

            //Handles the model refresh to be overridden
            onModelRefresh: function () {

            },

            //updates the model
            updateModel: function () {

            },
            
            renderSubviewSpecifically : function(dummyView) {
            	this.performRenderCycle();
            	this.delegateEvents();
            },
            
            //Renders the view
            render: function () {
                this.performRenderCycle();
                this.delegateEvents();
                FSR.run();
//                _.each(this.subViews, function (subView) {
//                    subView.performRenderCycle();
//                    subView.delegateEvents();
//                });
                this.isRendered = true;

				//scrolling the page to top.
				document.body.scrollTop = document.documentElement.scrollTop = 0;

            },
            
            performRenderCycle: function () {
                this.preRender();
                this.postRender();
            },

            //Adds the sub view
            addSubView: function (id, view) {
                view.parentView = this;
                if (!this.subViews[id]) {
                    this.subViews[id] = view;
                    return this.subViews[id];
                }
                else
            	{
                	return this.subViews[id];
            	}
            },

            //Removes the sub view
            removeSubView: function (subView) {
            	subView.removeCss();
                subView.undelegateEvents();
                subView.undelegateHammerEvents();
                subView.dispose();
                subView.remove();
                subView = null;
            },
            setCss : function(cssFileArray){

            },
             removeCss : function(cssFileArray){

             },
            //Remove all sub views
            removeAllSubViews: function () {
                _.each(this.subViews, function (subView) {
                    subView.undelegateEvents();
                    subView.undelegateHammerEvents();
                    subView.dispose();
                    subView = null;
                });
                this.subViews = {};
            },

            toggleAttrib: function (el, attr) {
                el.prop(attr, !el.prop(attr));
            },

            toggleCheckBox: function (el) {
                this.toggleAttrib(el, 'checked');
            },

            toggleDisabled: function (el) {
                this.toggleAttrib(el, 'disabled');
            },

            getUSCityAndStateByZipCode: function (zipCodeObject, fieldWrapper) {
              var self = this,
                  zipCode = $.trim(zipCodeObject.val());

              if (zipCode.length == 5 && /^\d{5}([\-]?\d{4})?$/.test(zipCode)) {
            	  this.$('#city, #state').val('');
            	  this.$('#city, #state').removeClass('error');
            	  this.$('#city-error-message,#state-error-message').remove();
	        	  this.$('.zipcode-result').removeClass('hide');
	              this.$('#cityGrid,#stateGrid').removeClass('hide');
	              this.$('.us-field').removeClass('hide');
	              this.$('.enter_zip').addClass('hide');
	              this.callForUSCityAndStateByZipCode(zipCode,fieldWrapper,zipCodeObject)
               
              } else {
                    $('#city, #state').val('');
                    this.$('.zipcode-result').addClass('hide');
                    this.$('#cityGrid,#stateGrid').addClass('hide');
                    this.$('.enter_zip').removeClass('hide');
              }
            },

            //dispose
            clearPage: function () {
                this.removeAllSubViews();
                this.dispose();
                this.undelegateEvents();
            },

            //shows the view
            show: function () {
                this.$el.show();
            },

            //hides the view
            hide: function () {
                this.$el.hide();
            },

            // Hammer Integration Starts

            constructor: function (options) {
                options = options || {};
                _.extend(this, _.pick(options, viewOptions));
                Backbone.View.prototype.constructor.apply(this, arguments);
            },

            _hammered: false,

            undelegateEvents: function () {
                this.undelegateHammerEvents();
                return undelegateEvents.apply(this, arguments);
            },

            undelegateHammerEvents: function () {
                if (this._hammered) {
                    this.hammer().off('.hammerEvents' + this.cid);
                }
                return this;
            },

            delegateEvents: function () {
                delegateEvents.apply(this, arguments);
                this.delegateHammerEvents();
                return this;
            },

            delegateHammerEvents: function (events) {
                var options = _.defaults(this.hammerOptions || {}, Backbone.hammerOptions);
                if (!(events || (events = _.result(this, 'hammerEvents')))) return this;
                this.undelegateHammerEvents();
                for (var key in events) {
                    var method = events[key];
                    if (!_.isFunction(method)) method = this[events[key]];
                    if (!method) continue;

                    var match = key.match(delegateEventSplitter);
                    var eventName = match[1], selector = match[2];
                    eventName += '.hammerEvents' + this.cid;
                    method = _.bind(method, this);
                    if (selector === '') {
                        this.hammer(options).on(eventName, method);
                    } else {
                        this.hammer(options).on(eventName, selector, method);
                    }
                }
                return this;
            },

            hammer: function (options) {
                this._hammered = true;
                return this.$el.hammer(options);
            }
            // Hammer Integration Ends
            ,
            preRender: function () {
            	if(this.nft && this.nft.ensPageName)
				{
            		ensCustomEvent.create("mobileAjaxPageLoad", {ensPageName: this.ensPageName, test2:"2345"});
				}

            	if(this.css)
            	{
            		this.setCss();
            	}
            	
                this.renderView();
            },
            
            postRender: function () {
            	//TODO : Temp handling for testing
//            	if (this.nft && this.nft.ensPageName)
//        		{
//                  this.listenTo(this, 'logPageLoadDone', this.logPageLoadDone);
//        		}

            	// TODO:Temporary fixed for IOS8 device
            	var ios8Device = navigator.userAgent.match(/(iPad|iPhone|iPod).*CPU.*OS\s*8_\d/i) != null
            	if(ios8Device){
            		$(window).scrollTop(1);
            		
            		/* commented as this is not solving the problem for all the scenarios 
            		//added this code for replacing the Submit buttons dynamically to button and type submit for accessibility fix
            		setTimeout(function(){
    	            	$('input:submit').each(function(){
    	            		element = $(this);
    	            		strButton = "<button ";
    	            		$.each(element.get(0).attributes, function(i, attrib){
    	            			strButton += attrib.name + ' = "' +attrib.value + '" ';
    	            		});
    	            		strButton += ">" + element.val() + '</button>';
    	            		
    	            		objButton = $(strButton);
    	            		objButton.addClass("replacedButtonClass");
    	            		$(this).parent().append(objButton);
    	            		
    	            		$(this).remove();
    	            	});
            		}, 5000);
					*/
            	
            	}
            },
            
                	
            clearNotNeededPages: function (newSubViewsDefinition) {
                var oldSubViewArr = Object.keys(this.subViews);
                for (var i = 0; i < oldSubViewArr.length; i++) {
                    if (!newSubViewsDefinition[oldSubViewArr[i]]) {
                    	this.removeSubView(this.subViews[oldSubViewArr[i]]);
                    	this.subViews[oldSubViewArr[i]].destroy();
                        delete this.subViews[oldSubViewArr[i]];
                    }
                }
            //scroll to the when new page gets loaded
            document.body.scrollTop = document.documentElement.scrollTop = 0;   
            },
            serviceError: function(e){
            	return Seva.errorObj[e];
            },
            
            
         
            
          
          //********************** Start Bootstrapper Analytics *************************//            
            
            getDynamicBsdlObj : function(){
            	bsdlObj.dynamicData = {};
            	bsdlObj.dynamicData.server			= "m.seva.com";
            	bsdlObj.dynamicData.myStoreSetting	=  Seva.Get.Cookie("myStoreId") != "" ? "yes" : "no";
            	return bsdlObj.dynamicData;
            },
            
            setTimeBsdlObj : function(){
            	var date = new Date;
            	var timeformat = "am";
            	if(date.getHours() >= 12) timeformat = "pm"
            	switch(date.getDay()){
            		case 0 : return "weekday:sunday:" + date.getHours() + ":" + date.getMinutes() + timeformat;
            		case 1 : return "weekday:monday:" + date.getHours() + ":" + date.getMinutes() + timeformat;
            		case 2 : return "weekday:tuesday:" + date.getHours() + ":" + date.getMinutes() + timeformat;
            		case 3 : return "weekday:wednesday:" + date.getHours() + ":" + date.getMinutes() + timeformat;
            		case 4 : return "weekday:thursday:" + date.getHours() + ":" + date.getMinutes() + timeformat;
            		case 5 : return "weekday:friday:" + date.getHours() + ":" + date.getMinutes() + timeformat;
            		case 6 : return "weekday:saturday:" + date.getHours() + ":" + date.getMinutes() + timeformat;
            	}
            },
            
            getStaticData : function(){
            	try{
	            	if(Seva.Template.bridgeData.device_info.attribute){
	            		if(Seva.Template.bridgeData.device_info.attribute[0].value != "")
	            			bsdlObj.staticData.deviceType = Seva.Template.bridgeData.device_info.attribute[0].value.trim();
	            	}
	            	return bsdlObj.staticData;
            	}
            	catch(e){
            	}
            },
            
            staticTrackLogPage : function(){
            	try{
            		window.Bootstrapper._setStaticPageData(this.getStaticData());
            	}
            	catch(e){
            	}
            },
            
            dynamicTrackLogPage : function(){
            	try{
            		//Log data here
            	}
            	catch(e){

            	}
            },
            
            bsdlEventSaveAccount : function(){
            	this.eventBsdlObj = {};
            	this.eventType    = 'saveAccount';
            	this.bootstrapEventTracking();
            },
            
            clickLocation : function(){
            	var self = this, clickLocation = "";
            	try{
            		$("#viewport").find("div").each(function(){
                		if($(this).attr("data-page")){
                			clickLocation = $(this).attr("data-page");
                		}
                	});
            		return clickLocation;
            	}
            	catch(e){
            	}
            },
            
            bootstrapEventTracking : function(){
            	try{
            		if(!this.eventBsdlObj.pageName)
            		this.eventBsdlObj.location = this.clickLocation();            		
            		// Log Data here
            	}
            	catch(e){
            	}
            },
            
            //********************** End Bootstrapper Analytics *************************//
            
            /**
             * method called before the view is destroyed.
             */
            destroy:function(){
            	
            },
			/**
			 * this provides a way to mock calls by overriding the prototype
			 */
			getWindowLocation: function(){
				return window.location;
			},
			focusErrorContainer:function(){
				$('#error-container h2').focus();
            }
        });
        return View;
    });
