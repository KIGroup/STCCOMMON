'use strict';
//ddd

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
        controller: function($scope, RegionSrvc){
            $scope.cities = [];
            
            // Подгружать города по набору
            $scope.loadCities = function(startsWith){       
                if(!startsWith || startsWith.length == 0)
                    $scope.cities = [];
                
                if (!startsWith || startsWith.length != 2)
                    return;  

                RegionSrvc.getAllCitiesStartsWith(startsWith).then(
                    function(data){
                        $scope.cities = data;
                    },
                    function(response){
                        $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                    }); 
            };

            $scope.loadCities();
	   	}
    }
});
