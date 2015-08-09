'use strict';
//dddd

directivesModule.directive('stcperson', function(){
    return {
        replace: true,
        restrict: 'E',
        templateUrl: 'components/stcperson.csp',
        
        scope: {
            person: '=',
            companies: '=',
            companyDisabled: '=',
            allDisabled: '=',
            companySwitchOff: '=',
            webSiteOff: '=',
            companyExist: '='    
        },
        controller: function($scope){
          $scope.switchCompany = function(exist){
                $scope.companyExist = exist;
				
				if ($scope.person){
	                if (exist && $scope.person.company)
	                    $scope.person.company.notexist = '';
	                else if ($scope.person.company)
	                    $scope.person.company.exist = '';
				}
            };
	   	}
    }
});
