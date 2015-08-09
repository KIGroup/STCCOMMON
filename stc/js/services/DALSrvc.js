'use strict';
//dddxdddddв

/*===========================================================================================
Доступ к БД через REST
===========================================================================================*/

servicesModule.factory('DALSrvc', function($resource, $q) {	
	return {
		getPromise: function(method, url, obj){
    		var resource = $resource(url);
            var deferred = $q.defer();
            
            resource[method](obj,
                        function(data){
                            deferred.resolve(data.children ? data.children : data);
                        },
                        function(response){
	                        if (response.data == ""){
	                        	response.data = "Error status: " + response.status + ". Method: " + response.config.method + ". Url: " + response.config.url + "."; 
	                        }
                            
                            deferred.reject(response);
                        });

            return deferred.promise;
    	}
    }
});
  
