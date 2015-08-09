'use strict';
//

/*===========================================================================================

===========================================================================================*/

controllersModule.controller('FeedBackCtrl', function($scope, $filter, $routeParams, UtilsSrvc, TrainingSrvc){
    $scope.menu.hide=true;
    $scope.menu.brandCaption = $filter('localize')('Система учёта курсов');
    $scope.menu.appTitle = $scope.menu.brandCaption;
    $scope.page = {training:{}, feedBack:{rating:0}};
    
    $scope.page.init = function(){
        $scope.page.loadTraining();
        $scope.page.loadFeedbackTemplate();
    };

    /* Подгрузить обучение */
    $scope.page.loadTraining = function(){
        TrainingSrvc.getForUser($routeParams.id).then(
            function(data){
                $scope.page.training = data;
            },
            function(response){
                $scope.page.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };
    
    /* Подгрузить шаблон отзыва */
    $scope.page.loadFeedbackTemplate = function(){
        TrainingSrvc.getFeedBackTemplate().then(
            function(data){
                $scope.page.feedBack = data;
            },
            function(response){
                $scope.page.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Save feedback
    $scope.page.submit = function(){
        if (!$scope.page.allRatingsAreFilled)
            return;
        
        TrainingSrvc.saveFeedBack($scope.page.feedBack, $routeParams.id, $routeParams.code).then(
            function(data){
                $scope.page.hide = true;
                $scope.page.alert = UtilsSrvc.getAlert('Готово!', 'Ваш отзыв принят. Спасибо!', 'success', true);
            },
            function(response){
                $scope.page.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });        
    };
    
    $scope.page.allRatingsAreFilled = function(){
        if (!$scope.page.feedBack || !$scope.page.feedBack.items)
            return true;
        
        for(var i=0; i < $scope.page.feedBack.items.length; i++){
            var item = $scope.page.feedBack.items[i];
            if (item.type.isRequired == 1 && item.type.isScaleType == 1 && item.scaleValue == 0)
                return false; // не заполнили все рейтинги!
        }
        
        return true;
    };

    $scope.page.init();
});

