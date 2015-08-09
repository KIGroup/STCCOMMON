'use strict';
//ddвddddв

/*===========================================================================================
Отчеты
===========================================================================================*/

servicesModule.factory('ReportSrvc', function($cookies, $window) {
	
	return {
		certificates: function(trainingId){
    		var lang = $cookies.lang ? $cookies.lang.substring(0,2) : 'ru';
            $window.open(StcAppSetting.admin + '/text/' + lang + '/certificates/'+trainingId,'_blank');
    	},
    	students: function(trainingAccessCode){
    		var lang = $cookies.lang ? $cookies.lang.substring(0,2) : 'ru';
            $window.open(StcAppSetting.user + '/text/' + lang + '/students/'+trainingAccessCode,'_blank');
    	}
    }
});
  
