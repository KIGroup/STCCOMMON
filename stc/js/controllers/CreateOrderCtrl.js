'use strict';
//dedd

/*===========================================================================================
Создание заявки
===========================================================================================*/

controllersModule.controller('CreateOrderCtrl', function($scope, $routeParams, $cookies, YandexSrvc, OrderSrvc, CompanySrvc, RegionSrvc, CourseTeacherSrvc, UtilsSrvc){
    $scope.menu.brandCaption = 'Форма регистрации на обучение компании InterSystems';
    $scope.menu.appTitle = 'Форма регистрации на обучение компании InterSystems';
    		
    $scope.menu.selectMenu('createOrder');    
    $scope.ordForm = {};

    /* Инициализация */
    $scope.ordForm.init = function(){
        $scope.ordForm.btnDisabled = false;
        $scope.ordForm.cities = [];
        $scope.ordForm.courses = [];
        $scope.ordForm.companies = [];
        $scope.ordForm.caption = 'Создание заявки';
        $scope.ordForm.btnClearShow = true;
    };

    /* Подгрузить курсы */
    $scope.ordForm.loadCourses = function(){
        CourseTeacherSrvc.getAll(1).then(
            function(data){
                $scope.ordForm.courses = data;
                
                if ($routeParams.course){
	                for (var i = 0; i < data.length; i++){
                	 	if ($routeParams.course == data[i].id){
                	 		$scope.ordForm.order = {course: data[i]};
                	 		break;
                	 	}
	                }
                }
            },
            function(response){
                $scope.ordForm.alert = UtilsSrvc.getAlert('Ошибка!', response.data, 'error', true);
            }); 
    };
    
    /* Создать еще одну заявку */
    $scope.ordForm.again = function(){
        $scope.ordForm.date = "";
        $scope.ordForm.order.date = "";
        $scope.ordForm.order.course = {};
        $scope.ordForm.order.studentsNumber = "";
        $scope.ordForm.btnNewShow = false;
        $scope.ordForm.btnClearShow = true;
        $scope.ordForm.btnDisabled = false;
        
        if ($scope.ordForm.alert) $scope.ordForm.alert.visible = false;
    };

    /* Стереть все */
    $scope.ordForm.clear = function(){
        $scope.ordForm.order = {};
        $scope.ordForm.date = "";
        if ($scope.ordForm.alert) $scope.ordForm.alert.visible = false;
    };

    /* Проверка данных на корректность */
    $scope.ordForm.formatData = function(){
	    $scope.ordForm.order.date = UtilsSrvc.getValidDate($scope.ordForm.date);
        if ($scope.ordForm.order.date == "")
        	$scope.ordForm.date = "";
    };
    
    /* Создать заявку */
    $scope.ordForm.create = function(){
        OrderSrvc.createOrder($scope.ordForm.order).then(
            function(data){
                $scope.ordForm.alert = UtilsSrvc.getAlert('Готово!', 'Ваша заявка принята.', 'success', true);
                $scope.ordForm.btnDisabled = true;
                $scope.ordForm.btnNewShow = true;
                $scope.ordForm.btnClearShow = false;
            },
            function(response){
                $scope.ordForm.alert = UtilsSrvc.getAlert('Ошибка!', response.data, 'error', true);
            });
    };

    /* Отправка формы */
    $scope.ordForm.submit = function(){
        $scope.ordForm.create();
    };
    

    $scope.ordForm.init();
    $scope.ordForm.loadCourses();
  });

