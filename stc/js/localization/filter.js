'use strict';
//
/*===========================================================================================
Фильтр и общая настройка для заголовков
===========================================================================================*/

localizationModule.filter('localize', function(StcDictionary) {
    return function(input) {
	    //console.log('call localize');  
        return StcDictionary.getTranslate(input);
    }
});


servicesModule.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.defaults.headers.common['Accept-Language'] = StcAppSetting.lang.substring(0,2);
}]);