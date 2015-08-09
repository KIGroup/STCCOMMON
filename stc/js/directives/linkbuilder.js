'use strict';
//sddddd

directivesModule.directive('linkbuilder', function(){
    return {
        replace: true,
        restrict: 'E',
        templateUrl: 'components/linkbuilder.csp',
        
        scope: {
          isVisible: '='
        },
        controller: function($scope){           
          $scope.data = {name: '', href: ''};

          $scope.getResult = function(){
              $scope.data.isBlank = true;

              if ($scope.data.isBlank){
                  return "<a href='" + $scope.data.href + "' target='_blank'>" + $scope.data.name + '</a>';
              }
              else{
                  return "<a href='" + $scope.data.href + "'>" + $scope.data.name + '</a>';
              }
          }; 
          
           
          
            
 
            $scope.$watch('isVisible', function(){
                if ($scope.isVisible){
                    $('#InfoModal').modal('show');
                }
                else{
                    $('#InfoModal').modal('hide');
                }

            });     
	   	}
    }
});
