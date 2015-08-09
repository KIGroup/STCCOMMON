'use strict';
//ddd

/*===========================================================================================
Создание обучения без подгрупп
===========================================================================================*/

controllersModule.controller('CreateTrainingCtrl', function($scope, $location, UtilsSrvc, TrainingSrvc){
    
    $scope.training = {data:{timeStart:'10:00', timeFinish: '14:00', orders: []}};
    
    $scope.training.submit = function(){
        TrainingSrvc.save($scope.training.data).then(
            function(data){
                 $location.path('/trainings');
            },
            function(response){
                $scope.training.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
});

