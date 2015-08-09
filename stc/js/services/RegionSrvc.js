'use strict';
//dddв

/*===========================================================================================
Регионы, города
===========================================================================================*/

servicesModule.factory('RegionSrvc', function(DALSrvc) {
	return {
	    /* Все города по начальным буквам */
        getAllCitiesStartsWith: function(startsWith){
            return DALSrvc.getPromise('get', StcAppSetting.user + '/json/city/' + startsWith, null);
        }
    }
});
  
