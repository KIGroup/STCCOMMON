'use strict';
//

/*===========================================================================================
Для работы с яндексом
===========================================================================================*/

servicesModule.factory('YandexSrvc', function(DALSrvc) {
	return {
		// Получить координаты адреса
        getResult: function(string){
	       return DALSrvc.getPromise('get', 'http://geocode-maps.yandex.ru/1.x/?lang=' +  StcAppSetting.lang + '&format=json&geocode=' + string, null);
        },
        getMapLink: function(lat, lng){
           return 'http://maps.yandex.ru/?ll=' + lng + ',' + lat + '&pt=' + lng + ',' + lat + '&l=map&z=15';
        }
    }
});
  
