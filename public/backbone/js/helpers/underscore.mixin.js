define(["jquery"],
    function ($) {
		// Here the list of Underscore Mixin Functions.
		_.mixin({

			/**
			 * `getCurrencySymbol` Function is used to get the Currency Symbol as per argument of Currency Code..
			 * @param  {string} code 	Currency Code.
			 * @return {string}      	HTML entity charactor for Currency Symbol.
			 */
		  getCurrencySymbol: function(code) {
			  var currencySymbol;
				switch(code)
				{
					// Check If the Code is American / Canadian Dollar.
					case 'USD':
					case 'CAD':
						currencySymbol = '&dollar;';
						break;
					// Check If the Code is EURO.
					case 'EUR':
						currencySymbol = '&euro;';
						break;
          default:
            currencySymbol = '&dollar;';
            break;
				}

		  	return currencySymbol;
		  },

		  /**
		   * `repeat` Function is used to repeat the given string
		   * @param  {[type]} input      [description]
		   * @param  {[type]} multiplier [description]
		   * @return {[type]}            [description]
		   */
			repeat: function (input, multiplier) {
			  var y = '';
			  while (true) {
			    if (multiplier & 1) {
			      y += input;
			    }
			    multiplier >>= 1;
			    if (multiplier) {
			      input += input;
			    } else {
			      break;
			    }
			  }
			  return y;
			},

		  isDefined: function (givenValue) {
		  	return (!_.isUndefined(givenValue));
		  },

		  hasValue: function(givenValue) {
		  	return (!_.isEmpty(givenValue)) ? true : false;
		  },

		  get: function (givenValue, elseValue) {
		  	return (_.isDefined(givenValue) && _.hasValue(givenValue)) ? givenValue : elseValue;
		  },

		  isInteger: function (value) {
		  	return ((value % 1) === 0);
		  },

		  /**
		   * `isSecured` Function return true / false as per the domain protocol.
		   * @return {Boolean} Return True, if the site protocol is `https` value from the variable `window.isSecure`.
		   */
		  isSecured: function () {
		  	var isSecured = (window.isSecure) ? true : false;
		  	return isSecured;
		  },

		  /**
		   * `baseURL` Function to return the secure / non-secure path.
		   * @param  {[string]} path     the given string will be concatenated with base path.
		   * @param  {[string]} protocol 'http|https'
		   * @return {[string]}          The base path Url.
		   */
		  baseURL: function (path, protocol) {
		  	if(path) {
					var baseURL = (_.isSecured()) ? window.secure_domain : window.domain;
			  	baseURL += path;

			  	// Check if protocol choice is selected.
			  	if(protocol) baseURL = (protocol == 'http') ? window.domain : window.secure_domain;

			  	return baseURL;
		  	}
		  },

		  /**
		   * `join` Function is similar to Javascript `join` function and also it will remove the falsy values.
		   * @param  {[array]} givenVar    Array of strings.
		   * @param  {[string]} sepearator String to separate the array element after joined as a one string.
		   * @return {[string]}            Joined String.
		   */
		  join: function (givenVar, sepearator) {
		  	var compacted = _.isArray(givenVar) ? _.compact(givenVar) : false;
		  	if(compacted) return compacted.join(sepearator);
		  },
		  
		  /**
		   * The `getSelection` Function will be get any matches in the string
		   * @return true
		   */
		  getSelection: function(fullstring, matchingword){
			  var patt = new RegExp(matchingword, 'gi');
			  if(fullstring.match(patt)){ 
			      return true;                          
			  }
		  },

		  isIterable: function (givenVar) {
		  	var isIterable = false;
		  	if(givenVar != 'undefined' && _.hasValue(givenVar)) {
		  		// Check if its Array.
		  		if(_.isArray(givenVar)) {
		  			if(givenVar.length > 0) return true;
		  		}
		  		// Else, Check If its Object.
		  		else if(_.isObject(givenVar)) {
		  			if(_.size(givenVar) > 0) return true;
		  		}
		  	}
		  	return isIterable;
		  },
		  
		  stripCharacter: function(fullstring, num, maskletter){
			  var pattern = new RegExp(".(?=.{"+num+"})","g");
			  var maskedStr = fullstring.replace(pattern, maskletter);
			  return maskedStr;
		  },
		 /**
		  * The `clearTplBuffer` Function will be clear the tplBuffer property in Underscore Object.
		  * @return {[None]} No Return Value.
		  */
		 clearTplBuffer: function () {
		    _.tplBuffer = [];
		 },
		
	    /**
	     * The `initTplBuffer` Function will be create the property in Underscore Object will be prevoked on initialize.
	     * @return {[None]} No Return Value.
	     */
	    initTplBuffer: function () {
	        _.tplBuffer = [];
	    }(),

	    /**
	     * The `tpl` Function is used to compile the given template in to main base Object.
	     * @param  {[string]} tplObj  The Main Base Object is used inside the template.
	     * @param  {[string]} tpl     Underscore HTML Template data.
	     * @param  {[object]} tplVars Object parsed to the Template.
	     * @return {[string]}         Return Compiled HTML Template data.
	     */
	    tpl: function (tplObj, tpl, tplVars) {
	        var compiledTpl = _.template(tpl, tplVars, {
	            variable: tplObj
	        });
	        return compiledTpl;
	    },

	    /**
	     * The `subTpl` Function is used to compile the given template and store in to the Underscore Tpl Buffer.
	     * @param  {[string]} tplObj  The Main Base Object is used inside the template.
	     * @param  {[string]} tpl     Underscore HTML Template data.
	     * @param  {[object]} tplVars Object parsed to the Template.
	     * @return {[none]}           No Return Value.
	     */
	    subTpl: function (tplObj, tpl, tplVars) {
	        var compiledTpl = _.tpl(tplObj, tpl, tplVars);
	        _.tplBuffer.push({
	            "id": tplObj,
	            "compiledTpl": compiledTpl
	        });
	    },

	    /**
	     * The `addToBuffer` Function is used to add the compiled Template to Tpl Buffer.
	     * @param {[type]} tplObj      [description]
	     * @param {[type]} compiledTpl [description]
	     */
	    addToTplBuffer: function (tplObj, compiledTpl) {
	        _.tplBuffer.push({
	            "id": tplObj,
	            "compiledTpl": compiledTpl
	        });
	    },

	    /**
	     * The `mergeTpls` Function will first compile the given template and merge the dependent Sub Templates from the Tpl Buffer.
	     * @param  {[string]} tplObj    The Main Base Object is used inside the template.
	     * @param  {[string]} tpl       Underscore HTML Template data.
	     * @param  {[object]} tplVars   Object parsed to the Template.
	     * @param  {[bool]} clearBuffer If True, Clear the Template Buffer.
	     * @return {[type]}             Return Compiled HTML Template data.
	     */
	    mergeTpl: function (tplObj, tpl, tplVars, clearBuffer) {
	        var varsIndex,
				tplBuffer = _.tplBuffer,
	        		mergeTplVars = {};
	        if (clearBuffer) _.tplBuffer = [];

	        if (_.isArray(tplBuffer)) {
	            for (index in tplBuffer) {
	                if (_.isObject(tplVars)) {
	                		var tplId = tplBuffer[index].id,
	                        tplData = tplBuffer[index].compiledTpl;
	                    mergeTplVars[tplId] = tplData;
	                }
	            }

	            if (_.isObject(tplVars)) {
	            	for (varsIndex in tplVars) {
	            		mergeTplVars[varsIndex] = tplVars[varsIndex];
	            	}
	            }
	        }
					var compiledTpl = _.tpl(tplObj, tpl, mergeTplVars);
	        return compiledTpl;
	    },

	    /**
	     * The `mergeSubTpl` Function will merge all the Buffer Sub Tpls.
	     * @param  {[type]} clearBuffer If True, Clear the Template Buffer.
	     * @return {[string]}           Return Compiled HTML Template data.
	     */
	    mergeSubTpl: function (clearBuffer) {
	        var tplBuffer = _.tplBuffer,
	            tplVars = [];
	        if (clearBuffer) _.tplBuffer = [];

	        if (_.isArray(tplBuffer)) {
	            for (index in tplBuffer) {
	                var tplData = tplBuffer[index].compiledTpl;
	                tplVars.push(tplData);
	            }

	            var mergedTpl = tplVars.join('');
	            return mergedTpl;
	        }
	    },
	    /**
	     * `currencySplit` Function will split the minus symbol.
	     * @param price
	     * @returns {String} returns absolute value with .00 
	     */
	    currencySplit: function(price) {
	    	var priceSplit = price.split("."),
	    		priceAbs   = Math.abs(priceSplit[0]),
	    		priceDisplay = priceAbs+"."+priceSplit[1];
	    	return priceDisplay;
	    },
	    /**
	     * `getVal` Function will retrieve value from object.
	     * @example
	     * 
	     *    _.getVal({"name":{"age":6,"p":[{"i":3},{"t":39},{"j":30}]}},"name.p[2].j");
	     *    =>30
	     *    _.getVal({"name":{"age":6,"p":[{"i":3},{"t":39},{"j":30}]}},"name.p.2.j");
	     *    =>30
	     *    _.getVal({"name":{"age":6,"p":[{"i":3},{"t":39},{"j":30}]}},"name.p[2].j.test.test2");
	     *    =>undefined
	     * 
	     * @param {Object} obj an object
	     * @param {String} key/path to value
	     * @returns returns value for the key if found else return undefined
	     */
	    getVal : function (obj,key) {
	    	obj=_.clone(obj);
	    	var value;
	    	try{
	    	if(key){ 
	        var keys = key.replace(/\[["']?(.+?)["']?\]/g, function($1,$2){return "."+$2.replace(/\./g,"~!");}).replace(/^\./,"").split('.'),
	            i = 0,
	            len = keys.length;
	          while ((obj = obj[keys[i++].replace(/~!/g,".")]) != null && i < len) {};
	          value = i < len ? void 0 : obj;
	    	}
	    	}catch(e){
	    		
	    	}
	          return value;
	      },
	      
	      /**
		     * `flattenObject` Function will Flatten objects into a single-depth object.
		     * @example
		     * 
		     *    _.flattenObject({"name":{"age":6,"p":[{"i":3},{"t":39},{"j":30}]}});
		     *    =>{name.age: 6, name.p.0.i: 3, name.p.1.t: 39, name.p.2.j: 30}
		     *    
		     * 
		     * @param {Object} obj an object
		     * @returns returns Object
		     */
	      flattenObject : function(ob) {
	    		var toReturn = {};
	    		
	    		for (var i in ob) {
	    			if (!ob.hasOwnProperty(i)) continue;
	    			
	    			if ((typeof ob[i]) == 'object') {
	    				var flatObject = _.flattenObject(ob[i]);
	    				for (var x in flatObject) {
	    					if (!flatObject.hasOwnProperty(x)) continue;
	    					
	    					toReturn[i + '.' + x] = flatObject[x];
	    				}
	    			} else {
	    				toReturn[i] = ob[i];
	    			}
	    		}
	    		return toReturn;
	    	},
	    stringToObject:function(string,delimiter,keyvaldelimiter){
	    	var obj={};
	    	try{
	    		var arr = string.split(delimiter);
	    		arr.map(function(item){
	    			var itemSplit=item.split(keyvaldelimiter);
	    			obj[itemSplit[0]]=itemSplit[1];
	    		});
	    	}catch(e){
	    		
	    	}
	    	return obj;
	    },
	    /*
	     *  `buildUrlStringFromProductTitle` Function used for building PDP page url form Product Title
	     *  @param title 
	     *  @param partNumber - product partNumber
	     *  @retrun {string} link for PDP Item. 
	     * 
	     */
	    
	    buildUrlStringFromProductTitle : function(title,partNumber){
	    	try{
	    		
	    	
	    	var  link= title.replace(/&#{0,1}[a-z0-9]+;/ig,"").replace(/[^a-zA-Z ]/g, "").replace(/\s/g,"-").replace("--","-").toLowerCase();
	    	return window.domain+'/p/'+link+'/-/A-'+partNumber;
	    	}catch(e){
	    		return "";
	    	}
	    },
	    /*
	     *  `convertToUSAmountFormat` Function to convert amount to US Format
	     *  @param number - 1000
	     *  @param partNumber - product partNumber
	     *  @retrun converted text 1,000. 
	     * 
	     */
	    
	    
	    convertToUSAmountFormat : function(number){
	    	var value= number,
	    	decimalSection = "";
	    	try{
	    		if(value){
	    			
	    			value = ""+value;
	    			decimalSection = value.split(".")[1];
	    			value = value.split(".")[0];
	    			value = value.split("").reverse().join("").match(/.{1,3}/g).join(',').split("").reverse().join("");
	    			value += "."+decimalSection;
		    	}
	    	}catch(e){
	    		
	    		value = number;
	    	}
	    	
	    	return value
	    }
	    
		});
	}
);
