'use strict';
//

/*===========================================================================================

===========================================================================================*/

controllersModule.controller('FeedBackCtrl', function($scope, $filter, $routeParams, UtilsSrvc, TrainingSrvc){
    $scope.menu.hide=true;
    $scope.menu.brandCaption = $filter('localize')('Система учёта курсов');
    $scope.menu.appTitle = $scope.menu.brandCaption;
    $scope.page = {training:{}, feedBack:{rating:0}};
    
    $scope.init = function(){
        $scope.loadTraining();
        $scope.loadFeedbackTemplate();
    };

    /* Подгрузить обучение */
    $scope.loadTraining = function(){
        TrainingSrvc.getForUser($routeParams.id).then(
            function(data){
                $scope.training = data;
            },
            function(response){
                $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };
    
    /* Подгрузить шаблон отзыва */
    $scope.loadFeedbackTemplate = function(){
        TrainingSrvc.getFeedBackTemplate().then(
            function(data){
                $scope.feedBack = data;
            },
            function(response){
                $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Save feedback
    $scope.submit = function(){
        if (!$scope.allRatingsAreFilled())
            return;
        
        TrainingSrvc.saveFeedBack($scope.feedBack, $routeParams.id, $routeParams.code).then(
            function(data){
                $scope.hide = true;
                $scope.alert = UtilsSrvc.getAlert('Готово!', 'Ваш отзыв принят. Спасибо!', 'success', true);
            },
            function(response){
                $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });        
    };
    
    $scope.allRatingsAreFilled = function(){
        if (!$scope.feedBack || !$scope.feedBack.items)
            return true;
        
        for(var i=0; i < $scope.feedBack.items.length; i++){
            var item = $scope.feedBack.items[i];
            if (item.type.isRequired == 1 && item.type.isScaleType == 1 && item.scaleValue == 0)
                return false; // не заполнили все рейтинги!
        }
        
        return true;
    };

    $scope.init();
});

