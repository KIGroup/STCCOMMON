'use strict';
//sdd

directivesModule.directive('stcschedule', function(){
    return {
        replace: true,
        restrict: 'E',
        templateUrl: 'components/stcschedule.csp',
        
        scope: {
            course: '='
        },
        controller: function($scope, $filter){           
            
            $scope.onClickTraining = function(tr){
                tr.detailsVisible = !tr.detailsVisible;
                if (tr.detailsVisible){
                    tr.headStyle = {color : 'rgb(175, 5, 5)'}    
                }
                else{
                    tr.headStyle = {};
                } 
            };  
	   	}
    }
});
