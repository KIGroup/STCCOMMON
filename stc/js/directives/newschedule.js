'use strict';
//sdd

directivesModule.directive('newstcschedule', function(){
    return {
        replace: true,
        restrict: 'E',
        templateUrl: 'components/newstcschedule.csp',
        
        scope: {
            group: '='
        },
        controller: function($scope, $filter){           
            
	   	}
    }
});
