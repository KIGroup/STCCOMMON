'use strict';
//sdddddddddd

directivesModule.directive('stcalertlabel', function(){
    return {
        replace: true,
        restrict: 'E',
        templateUrl: 'components/stcalertlabel.csp',
        
        scope: {
            data: '='
        },
        controller: function($scope, $timeout){           
           $scope.data = {visible: false};
           
	       
	       $scope.$watch('data', function(){
                if ($scope.data && $scope.data.visible && $scope.data.cssClass == 'success'){
                     $timeout(function(){
                      $scope.data.visible=false;
                    }, 2000);       
                }  
           });
	   	}
    }
});
