define(["jquery", "jcookie", "sevaConfig"], function($, jCookie, sevaConfig) {
    /**
     * Top level namespace for Seva Helper.
     *
     * @namespace
     */
    Seva = {};
    Seva.Config = {};
    templates = {};
    UIMod = uiMod = uimod = true;
    /* var localCache = {
            data: {},
            remove: function(url) {
                delete localCache.data[url];
            },
            exist: function(url) {
                return localCache.data.hasOwnProperty(url) && localCache.data[url] !== null;
            },
            get: function(url) {
                
                return localCache.data[url];
            },
            set: function(url, cachedData, callback) {
                localCache.remove(url);
                localCache.data[url] = cachedData;
                if ($.isFunction(callback)) {
                    callback(cachedData, "FRMURL")
                };
            }
        };*/
    var _history=[];
    Seva.setHistory=function(url){
    	(_history.length >= 5)?(_history=_history.splice(1, 5)):null;
    	_history.push(url);
    };
    Seva.getPreviousURL=function(index){
    	index=index||-2
    	return _history[_history.length-Math.abs(index)];
    };
    /**
     * @createCookieString private method to formats a cookie value for an object containing multiple values.
     * @param hash An object of key-value pairs to create a string for.
     * @param delimiter an delimiter used to construct the cookie string.
     * @return A string suitable for use as a cookie value.
     *
     */
    var _createCookieString = function(hash, delimiter, splitter) {
        var text = [],
            delimiter = delimiter || "~",
            splitChar = (splitter) ? splitter : ":";
        if (_.isObject(hash)) {
            for (var key in hash) {
                if (!_.isFunction(hash[key])) {
                    text.push(key + splitChar + hash[key]);
                }
            }
        }
        return text.join(delimiter);
    };
    /**
     * @parseCookieHash private method to  parses a cookie hash string into an object.
     * @param text The cookie hash string to parse. The string should already be URL-decoded.
     * @param delimiter an delimiter used to split the cookie string.
     * @return  An object containing entries for each cookie value.
     *
     *
     */
    var _parseCookieHash = function(text, delimiter, splitter) {
        var delimiter = delimiter || "~",
            hashParts = text.split(delimiter),
            hashPart = null,
            hash = {},
            splitChar = (splitter) ? splitter : ":";
        if (text.length > 0) {
            for (var i = 0, len = hashParts.length; i < len; i++) {
                hashPart = hashParts[i].split(splitChar);
                hash[hashPart[0]] = hashPart[1];
            }
        }
        return hash;
    };
    // List of User Related Functions.
    Seva.User = {
        isAnonymous: true,
        email: ""
    };
    /** start changes for search scroll **/
    Seva.searchScrollReq = false;
    Seva.pageVisited = [];
    Seva.scrollToRecentlyViewedItem = function() {
      try {
        var baseName = Seva.Get.TCookie("mCurrentProduct");
        if (baseName) {
          baseName = baseName.split("|");
          if (baseName.length > 0) {
            baseName = baseName.slice(-1).pop();
            var side = $("a[href$=" + baseName + "]").parents('li').prev();
            if (side.length > 0) {
              $.scrollToTag(side);
            }
          }
        }
      } catch (logTracking) {
        return true;
      }
    };
    /** End changes for search scroll **/
    //List of Get Functions to get the value.
    Seva.Get = {
        // Function to Get the Config Value.
        Config: function(cVar, defaultValue) {
            var defaultVal = (Seva.util.hasValue(defaultValue)) ? defaultValue : "applicationName";
            // Get the Specific Configurations.
            var configVar = Seva.util.getValue(cVar, defaultVal);
            var configValue = Seva.util.getValue(Seva.Config[configVar], '');
            return configValue;
        },
        
        /**
         * @TCookie Public method to set or update value in to cookie.
         * @param key String used to set value
         * @param options (Optional) Options for the cookie.
         * @return value retrieved from the cookie
         *
         */
        TCookie: function(key, options) {
            options = options || {}
            var delimiter = options.delimiter ? options.delimiter : "~";
                cVar = options.name ? options.name : "sevaMobileCookie",
                splitter = options.splitter ? options.splitter : ":" ,
                Cookietext = Seva.Get.Cookie(cVar);
            var hash = _parseCookieHash.call(null, Cookietext, delimiter,splitter);
            return hash[key];
        },
        // Function to Get the Cookie Value.
        Cookie: function(cVar) {
            var cVar = Seva.util.getValue(cVar, false);
            $.cookie.raw = true;
            if (cVar) {
                var cValue = Seva.util.getValue($.cookie(cVar), '');
                return cValue;
            }
        }
    };
    //List of Set Functions to assign the value.
    Seva.Set = {
        /**
         * @TCookie Public method to set or update value in to cookie.
         * @param key String used to set value
         * @param value String to be set.
         * @param options (Optional) Options for the cookie.
         *
         */
        TCookie: function(key, value, options) {
            options = options || {}
            var delimiter = options.delimiter ? options.delimiter : "~",
                cVar = options.name ? options.name : "sevaMobileCookie",
                Cookietext = Seva.Get.Cookie(cVar),
                splitter = options.splitter ? options.splitter : ":",
                hash = _parseCookieHash.call(null, Cookietext, delimiter, splitter);
            hash[key] = value;
            Cookietext = _createCookieString.call(null, hash, delimiter, splitter);
                     Seva.Set.Cookie(cVar, Cookietext, Seva.util.getValue(options.expires, 1800000), Seva.util.getValue(options.domain, ".seva.com"))
                     if(document.location.href.indexOf("seva.com") == -1) {
                        Seva.Set.Cookie(cVar, Cookietext, Seva.util.getValue(options.expires, 1800000), Seva.util.getValue(options.domain, ""))
                     }
        },
        
        prefCookieIfNeeded : function(ffStatus,sfsStatus){
            if ( ffStatus === "true" && Seva.Get.Cookie("Pref").indexOf("F=Y") == -1) {
                   Seva.Set.TCookie("F","Y",{"name":"Pref","delimiter":"|","domain":".seva.com","splitter":"="});
            }
            if ( sfsStatus === "true" && Seva.Get.Cookie("Pref").indexOf("SFS=Y") == -1) {
                Seva.Set.TCookie("SFS","Y",{"name":"Pref","delimiter":"|","domain":".seva.com","splitter":"="});
         }
         },
     
        /**
         * @TCookie Public method to remove value.
         * @param key String used to set value
         * @param value String to be set.
         * @param options (Optional) Options for the cookie.
         *
         */
        removeTCookie: function(key, options) {
            options = options || {}
            var delimiter = options.delimiter ? options.delimiter : "~",
                cVar = options.name ? options.name : "sevaMobileCookie",
                Cookietext = Seva.Get.Cookie(cVar),
                splitter = options.splitter ? options.splitter : ":",
                hash = _parseCookieHash.call(null, Cookietext, delimiter, splitter);
            delete hash[key];
            Cookietext = _createCookieString.call(null, hash, delimiter, splitter);
            if(Cookietext !== ""){
            	Seva.Set.Cookie(cVar, Cookietext, Seva.util.getValue(options.expires, 1800000), Seva.util.getValue(options.domain, ".seva.com"))
                if(document.location.href.indexOf("seva.com") == -1) {
                      Seva.Set.Cookie(cVar, Cookietext, Seva.util.getValue(options.expires, 1800000), Seva.util.getValue(options.domain, ""));
                   }
            } else {
            	Seva.Set.Cookie(cVar, Cookietext, -1 , Seva.util.getValue(options.domain, ".seva.com"));
                if(document.location.href.indexOf("seva.com") == -1) {
                      Seva.Set.Cookie(cVar, Cookietext,-1, Seva.util.getValue(options.domain, ""));
                   }
            }
            
           },
           
         removeCookie : function( name, path, domain ) {
        	  if( this.getCookie( name ) ) {
        		    document.cookie = name + "=" +
        		      ((path) ? ";path="+path:"")+
        		      ((domain)?";domain="+domain:"") +
        		      ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
        		  }
        		},
        		
       getCookie : function(name){
    	   var name = name + "=";
    	    var ca = document.cookie.split(';');
    	    for(var i=0; i<ca.length; i++) {
    	        var c = ca[i];
    	        while (c.charAt(0)==' ') c = c.substring(1);
    	        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    	    }
    	    return "";
       },
        	
        // Function to Store the Cookie Value.
        Cookie: function(cVar, cValue, expireAt, cdomain, isSecured) {
            var cVar = Seva.util.getValue(cVar, false);
            if(expireAt != "session"){	
            	expireAt = Seva.util.getValue(expireAt, 1800000);
                expireAt = Seva.util.getExpiryDate(expireAt);
            } 
            var tdomain = (typeof(cdomain) == 'undefined') ? window.location.hostname : cdomain;
            var isSecured = (typeof(isSecured) == 'undefined') ? false : true;
            $.cookie.raw = true;
            if (cVar) {
                var cValue = Seva.util.getValue(cValue, false);
                var options = {  
                        path: '/',
                        domain: tdomain,
                        secure:isSecured
                    };
                if(expireAt != "session"){
                	options["expires"]=expireAt;
                }
                $.cookie(cVar, cValue,options );
            }
        }
    };
    // List of Template Functions.
    Seva.Template = {
        //used as a exchange of data between base controller and spot view
        bridgeData: '',
        getTpl: function(path) {
            var TplData = "";
            var TplPath = domainUrl + 'templates/' + path;
            Seva.util.dynamicRequest(TplPath, function(data) {
                TplData = data
            }, "html")
            return TplData;
        },
        getLoaderTpl: function() {
            return this.getTpl('common/nav_loader.html');
        }
    };
    Seva.util = {
        storeEmailDetail: "",
        renderInternalCSSLinks: function(cssDefs) {
            //removing the earlier page css using data attribute "page-specific"
            $('link[data="page-specific"]').attr('disabled', 'disabled');
            $('link[data="page-specific"]').remove();
            var imgServerConfigator = 'http://Img2.sevaimg2.com/wcsstore/marketing';
            _.each(cssDefs, function(linkCss) {
                linkCss.cssfile = imgServerConfigator + (linkCss.cssfile).split("marketing")[1];
                linkCss.cssfile = Seva.util.removeMinified(linkCss.cssfile);
                if (window.location.protocol === "https:" && linkCss.cssfile.search("http:") != -1) {
                    linkCss.cssfile = linkCss.cssfile.replace("http:", "https:");
                } else if (window.location.protocol === "http:" && linkCss.cssfile.search("https:") != -1) {
                    linkCss.cssfile = linkCss.cssfile.replace("https:", "http:");
                }
                $('<link rel="stylesheet" type="text/css" href="' + linkCss.cssfile + '" data="page-specific" />').appendTo('head');
            });
        },



        log: function(msg) {
            
            
        },
        
        hasValue: function(cVar) {
            return (cVar != 'undefined' && cVar != '' && typeof(cVar) != 'undefined') ? true : false;
        },
        getExpiryDate : function(expires) {
                   var date = new Date();
        	        date.setTime(date.getTime() + (expires));
        	         return date;
        },
        getValue: function(cVar, defaultValue) {
            return (Seva.util.hasValue(cVar)) ? cVar : defaultValue;
        },
        dynamicRequest: function(url, callback, contentType) {
            $.ajax({
                url: url,
                contentType: typeof(contentType) == 'undefined' ? "application/json" : contentType,
                async: false,
                type: "GET",
                success: callback
            });
        },
        dynamicRequestasync: function(url, callback, contentType, gomez_obj,isJSOP) {
        	var ajaxOptions ={
                    url: url,
                    contentType: typeof(contentType) == 'undefined' ? "application/json" : contentType,
                    async: true,
                    type: "GET",
                    success: callback,
                    gomez_obj: gomez_obj,
                    error: callback
                }
        	 if(isJSOP ) {
        		 ajaxOptions["dataType"] = 'jsonp';
        		 ajaxOptions["callback"]=sevaCallback;
        	 }
        	
            $.ajax(ajaxOptions);
        },
        dynamicRequestFromCache: function(url, callback, contentType) {
            var self = this;
            $.ajax({
                url: url,
                contentType: typeof(contentType) == "undefined" ? "application/json" : contentType,
                async: false,
                type: "GET",
                timeout: 300000,
                context: self,
                /*beforeSend: function() {
                        url = url + "#" + this.getHourOfRequest();
                        if (localCache.exist(url)) {
                            callback(localCache.get(url), "FRMCACHE");
                            return false;
                        }
                        return true;
                    },*/
                success: function(response, status) {
                    //localCache.set(url, response, callback);
                    callback(response, status);
                },
	            error : function(response,status){
	            	callback(response, status);
	            }
            });
        },
        getHourOfRequest: function() {
            var a = new Date();
            return "" + a.getMonth() + a.getDay() + a.getHours();
        },
        showProcess: function(obj) {
            var process = $(obj).loader();
            process.show();
        },
        hideProcess: function() {
            $(".SevaLoading").remove();
        },
        isPrivateBrowse: function() { /*returns true if safari private browse is ENABLED*/
            var storageTestKey = 'sTest',
                storage = window.sessionStorage;
            try {
                storage.setItem(storageTestKey, 'test');
                storage.removeItem(storageTestKey);
                return false;
            } catch (e) {
                if (e.code == DOMException.QUOTA_EXCEEDED_ERR && storage.length == 0) {
                    return true;
                } else {
                    return true;
                    throw e;
                }
            }
        },
        
        validateEmail: function(mail) {
            var regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regexEmail.test(mail);
        },
        removeMinified: function(lnk) {
            return lnk;
        },
        toCamelCase: function(string) {
            if (string.split(' ').length == 1 && string.split('_').length == 1) return string;
            var hyphenated = string.replace(/ |_/g, '-');
            return hyphenated.toLowerCase().replace(/(\-[a-z])/g, function($1) {
                return $1.toUpperCase().replace('-', '');
            });
        },
        isSecure: function() {
            if (window.location.protocol == "https:") {
                return true;
            }
            return false;
        },
        URL : function(link) {
            var urlOBJ = Seva.util.parseURL(link);
           
            return urlOBJ;
        },
        parseURL : function(link){
        	var urlOBJ;
        	var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
            var result = parse_url.exec(link);
            var names = ['href', 'protocol', 'slash', 'host', 'port', 'pathName', 'search', 'hash'];
            var i;
            urlOBJ = {};
            for (i = 0; i < names.length; i += 1) {
                urlOBJ[names[i]] = (result[i] !== undefined ? result[i] : "");
            }
            urlOBJ.hostname = urlOBJ.host;
            urlOBJ.origin = urlOBJ.protocol + urlOBJ.slash + urlOBJ.host + (urlOBJ.port !== ""? ":" + urlOBJ.port : "");
            return urlOBJ;
        },
        isFullyQualifiedUrl : function(s) { var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/ ;return regexp.test(s); },
        confirmLink : function(link){
        	var isAbsurl = false;
        	try{
        		isAbsurl = (Seva.util.URL(decodeURIComponent(link)).host != window.location.host) ?  true :  false;
        		return isAbsurl;
        	}
        	catch(e){
        		return false;
        	}
        
        },
        daySuffix: function(i) {
            var j = i % 10;
            if (j == 1 && i != 11) return i + "st";
            if (j == 2 && i != 12) return i + "nd";
            if (j == 3 && i != 13) return i + "rd";
            return i + "th";
        },
        getDateFormatted: function(value,format)
        {
        	var date = "";
               if(_.isDefined(value))
                   date = new Date(Date.parse(value.replace(/-/g, " ")));
               else
                  return '';
        	var formattedDate;
        	if(date == 'Invalid Date')
        		return '';
        	switch(format) {
        		case 'mm/dd/yy':
        			formattedDate =  (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear().toString().substring(2,4);
        			break;
        		case 'mm/dd/yyyy':
        			formattedDate =  (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
        			break;
        		case 'dd/mm/yy':
        			formattedDate =  date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear().toString().substring(2,4);
        			break;
        		case 'dd/mm/yyyy':
        			formattedDate =  date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
        			break;
        		case 'yyyy/mm/dd':
        			formattedDate = date.getFullYear().toString().substring(2,4)+'/'+(date.getMonth()+1)+'/'+date.getDate();
        			break;
        		case 'mm/dd':
        			formattedDate = (date.getMonth()+1) +'/' + date.getDate();
        			break;
                case 'mmm dd':
                    formattedDate = (this.getMonthIndex(date.getMonth())) +' ' + date.getDate();
                    break;
        	}
        	return formattedDate;
        },
        getMonthIndex: function (month) {                        
            var monthArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            return monthArray[month];
        },
        getMonthShortName: function (value) {                        
            var monthArray = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            return monthArray.indexOf(value);
        },isValidDate: function(year,month,date){
            var dayobj = new Date(year, month, date);
            return ( (dayobj.getFullYear()!=year) || (dayobj.getMonth()!=month) || (dayobj.getDate()!=date) ) ? false : true;
        }

    };

    Seva.TemplateMapping = {
        mappings: {},
        load: function() {
            // Seva.util.dynamicRequest(domainUrl + Seva.Config.templateMappingFile, function(data) {
            Seva.TemplateMapping.mappings = sevaConfig.templates;
            //})
        },
        getTemplateString: function(id) {
            var path = Seva.TemplateMapping.mappings[id];
            var tmplString = "";
            Seva.util.dynamicRequest(domainUrl + path, function(data) {
                tmplString = data
            }, "html")
            return tmplString;
        }
    };
    Seva.loadConfig = function(configFile) {
        Seva.util.dynamicRequest(configFile, Seva.configSucess, "application/json")
    };
    Seva.init = function() {
       Seva.TemplateMapping.load();
       Seva.util.showProcess("body");
    };
    Seva.errorService = function(data) {
        Seva.errorObj = data;
    };
    Seva.getParameterByName = function(name, url) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        if (url) {
            var results = regex.exec(url);
        } else {
            var results = regex.exec(location.search);
        }
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    Seva.getLegalCopyContent = function(term,successCallBack,errorCallBack,context) {
        var url = Seva.Config["staticContentUrl"];
        var key = Seva.Config["staticContentKey"];
        url = url + "/" + term + "?key=" +key;
        $.ajax({
            url: url,
            contentType:'application/json',
            type: 'GET',
            dataType: 'jsonp',
            success:successCallBack,
            error:errorCallBack,
            context:context
        })
    };
    Seva.getPageDefinitions = function() {
        var pageMetaStr = $('#page-meta').html();
        return $.parseJSON(pageMetaStr);
    };
    Seva.TemplateCache = {
        get: function(id) {
            var tmplString = templates[id];
            if (!tmplString) {
                tmplString = Seva.TemplateMapping.getTemplateString(id);
                templates[id] = tmplString;
            }
            return tmplString
        }
    }
    $.fn.loader = function() {
        var _loader = function() {
            return '<div class="SevaLoading"><span></span></div>';
        };
        this.show = function() {
			//$('html').addClass('loader-active');
        	if($('.SevaLoading').length === 0 ) {
        		$(this).prepend(_loader()).focus();
        	} else { 
        		$('.SevaLoading').focus();
        	}
        };
        this.hide = function() {
            $(".SevaLoading").remove();
			//$('html').removeClass('loader-active');
        };
        return this;
    }
    /****
     * function: to show loader when page is empty
     */
    $.fn.showSpacedLoader = function() {
        $(this).show();
        //$('html').addClass('loader-active');
    }
    $.fn.removeSpacedLoader = function() {
        //$('html').removeClass('loader-active');
        $(this).hide();
    }
    /*******************
     * jquery function to show an hide loader inside any DOM element
     * @returns {$.fn.loaderInElement}
     */
    $.fn.loaderInElement = function() {
			this.loader = function() {
            return '<div class="SevaLoading" style="display:block;position:absolute;"></div>';
        };
        this.show = function() {
            $(this).prepend(this.loader).focus();
        };
        this.hide = function() {
            $(this).find(".SevaLoading").remove();
        };
        return this;
    }
    /****
     * scroll to any element in page
     * @param:
     *                    param: #id or .class selector
     *                   duration: any time in ms or 'slow','fast','swing'
     *
     */
    $.scrollToTag = function(param, duration) {
        var aTag;
        try {
            aTag = $(param)
			if(aTag && aTag.length) {
				$('html,body').animate({
					scrollTop: aTag.offset().top
				}, duration);
			}
        } catch (e) {
        }
    }
    $.fn.replaceClass = function(findClass, replaceClass) {
        $(this).removeClass(findClass).addClass(replaceClass);
    }
    $.fn.eHtml = function(htmlContent) {
        $(this).html(htmlContent).focus();
    }
    $.fn.eShow = function() {
        $(this).show().focus();
    }
    $.fn.eHide = function() {
        $(this).hide().focus();
    }
    
    /*
     * common page load extension on every view & modal change
     * 
     */
    $.viewReady=function(){};
    $.onPageLoadComplete = function(){
    	if(typeof($.viewReady)!="undefined"){
    		setTimeout($.viewReady(),1000);
		}
    }
    Seva.init();
    return Seva;
    }
    )
    ;