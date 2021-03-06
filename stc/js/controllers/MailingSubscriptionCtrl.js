'use strict';
//dddddfdc

/*===========================================================================================
Подписка/отписка, создание и изменение
===========================================================================================*/

controllersModule.controller('MailingSubscriptionCtrl', function($scope, $routeParams, $filter, $timeout, $location, MailingSrvc, UtilsSrvc){
    $scope.menu.brandCaption = $filter('localize')('Подписка на анонсы обучающих курсов InterSystems');
    $scope.menu.appTitle = $scope.menu.brandCaption;
    
    $scope.menu.selectMenu('mailingSubscription');
     
    $scope.mitemForm = {};
    
    $scope.mitemForm.init = function(){
        if ($routeParams.confirmCode){
            $scope.mitemForm.confirmData($routeParams.confirmCode);
            $scope.mitemForm.isConfirmation = true;
            return;
        }

        if ($routeParams.accessCode){
            $scope.mitemForm.caption = 'Отмена / изменение подписки';
            $scope.mitemForm.actionName = 'Сохранить';
            $scope.mitemForm.removeBtnVisible = true;
            $scope.mitemForm.loadData($routeParams.accessCode);    
        }
        else{
            $scope.mitemForm.caption = 'Оформление подписки';
            $scope.mitemForm.actionName = 'Подписаться';
        }
    };

    // Загрузить участника
    $scope.mitemForm.loadData = function(code){
        MailingSrvc.getGroupItemByAccessCode(code).then(
            function(data){
                $scope.mitemForm.mitem = data;
            },
            function(response){
                 $scope.mitemForm.confirmAlert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                 $scope.mitemForm.isConfirmation = true;
            }); 
    };

    // Подтвердить подписку
    $scope.mitemForm.confirmData = function(code){
        MailingSrvc.confirmSubscription(code).then(
            function(data){
	            console.log(data);
                $scope.mitemForm.confirmAlert = UtilsSrvc.getAlert('Готово!', 'Активация подписки завершена.', 'info', true);
            },
            function(response){
	            console.log(response);
                $scope.mitemForm.confirmAlert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            	console.log($scope.mitemForm.confirmAlert);
            }); 
    };

    // Сохранить / создать подписку
    $scope.mitemForm.submit = function(){
        if ($scope.mitemForm.mitem.id){
            MailingSrvc.updateSubscription($scope.mitemForm.mitem, $routeParams.accessCode).then(
                function(data){
                    $scope.mitemForm.alert = UtilsSrvc.getAlert('Готово!', 'Изменения сохранены.', 'success', true);
                    $scope.form.$setPristine();
                },
                function(response){
                    $scope.mitemForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        }
        else{   
            MailingSrvc.createSubscription($scope.mitemForm.mitem).then(
                function(data){
                    $scope.mitemForm.alert = UtilsSrvc.getAlert('Готово!', 'На указанный адрес было отправлено письмо, для активации подписки перейдите по ссылке в письме.', 'info', true);
                    $scope.form.$setPristine();
                },
                function(response){
                    $scope.mitemForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        } 
    };

    // Отмена подписки
    $scope.mitemForm.removeSubscription = function(){
        MailingSrvc.removeSubscription($routeParams.accessCode).then(
                function(data){
                    $scope.mitemForm.alert = UtilsSrvc.getAlert('Готово!', 'Подписка отменена.', 'info', true);
                    $timeout(function(){
                    	$location.path('/mailing/subscription');
                    }, 2000);  
                },
                function(response){
                    $scope.mitemForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
    };

    // Очистка формы
    $scope.mitemForm.clear = function(){
        $scope.mitemForm.mitem = {};
        $scope.form.$setPristine();
        $scope.mitemForm.alert = {visible: false};
    };

    
    $scope.mitemForm.init();
});
    

