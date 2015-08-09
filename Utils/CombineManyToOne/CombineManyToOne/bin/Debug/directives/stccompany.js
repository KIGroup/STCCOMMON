'use strict';
//dddd

directivesModule.directive('stccompany', function(){
    return {
        replace: true,
        restrict: 'E',
        templateUrl: 'components/stccompany.csp',
        
        scope: {
            company: '=',
            requiredAll: '=',
            disableShortName: '='       
        },
        controller: function($scope){
           
	   	}
    }
});
