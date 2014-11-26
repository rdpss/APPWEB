define([],function(){
   var config ={};
   config.loactionHost = window.location.host;
   config.configuration = {
		getErrorText:function(key){
			var ErrorLookUp={
					"A" :  "B"
					};
			return ErrorLookUp[key]
		}
	}
	
   config.forceCache= []

	return config;
});
