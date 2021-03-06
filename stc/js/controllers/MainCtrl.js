'use strict';
//ddddddddвdd

/*===========================================================================================
Главный контроллер, работа с языком и меню
===========================================================================================*/

controllersModule.controller('MainCtrl', function($scope, $window, $location, $cookies, DALSrvc, $filter, UtilsSrvc){

    $scope.menu = {user: $cookies.user,
                   admin: ($cookies.admin === 'true'),
                   readOnlyMode: ($cookies.readOnlyMode === 'true'),
                   loginCaption: ($cookies.admin === 'true' ? 'Выход' : 'Вход'),
                   languages: [{id: 'ru-RU', name: 'Русский', flag: 'img/flags/ru.png'}, 
                               {id: 'en-US', name: 'English', flag: 'img/flags/en.png'}]};

    var idx = UtilsSrvc.getIndexes($scope.menu.languages, 'id', StcAppSetting.lang ? StcAppSetting.lang : 'ru-RU');
    if (idx.length != 0)
    { 
        $scope.menu.lang = $scope.menu.languages[idx[0]];
        $cookies['lang'] = $scope.menu.lang.id;
    }

    $scope.pageStore = {};
    
    // Метод определяющий порядок написания полного имени человека
    $scope.getFullNameForCurLang = UtilsSrvc.getFullNameForCurLang;
    
    $scope.menu.init = function(){
        $scope.menu.createOrder  = {id: 'createOrder',  name: 'Создать заявку*'};
        $scope.menu.orders       = {id: 'orders',       name: 'Заявки'};
        $scope.menu.trainings    = {id: 'trainings',    name: 'Обучения*'};
        $scope.menu.companies    = {id: 'companies',    name: 'Организации'};
        $scope.menu.courses      = {id: 'courses',      name: 'Курсы'};
        $scope.menu.settings      = {id: 'settings',    name: 'Параметры системы'};
        $scope.menu.persons      = {id: 'persons',      name: 'Сотрудники'};
        $scope.menu.certificates = {id: 'certificates', name: 'Сертификаты'};

        $scope.menu.analytics    = {id: 'analytics',    name: 'Аналитика'};
        $scope.menu.analyticsMap = {id: 'analyticsMap', name: 'Карта точек обучения'};
        $scope.menu.analyticsCourse  = {id: 'analyticsCourse' , name: 'Курсы'};
        $scope.menu.analyticsTeacher = {id: 'analyticsTeacher', name: 'Преподаватели'};
        $scope.menu.analyticsCompany = {id: 'analyticsCompany', name: 'Организации'};
        $scope.menu.analyticsOrder = {id: 'analyticsOrder', name: 'Заявки'};

        $scope.menu.other = {id: 'other', name: 'Ещё'};
        $scope.menu.mailingGroups = {id: 'mailingGroups', name: 'Группы рассылки'};
        $scope.menu.mailingSubscription = {id: 'mailingSubscription', name: 'Оформление подписки'};
        $scope.menu.mailingJournal = {id: 'mailingJournal', name: 'Журнал рассылок'};
    };

    // Выбор меню - сделать активным пункт
    $scope.menu.selectMenu = function(menuId){
        $scope.menu.hide = false;
        
        if ($scope.menu.timeOutIntervalId){
            $window.clearTimeout($scope.menu.timeOutIntervalId);
        }
        
        $scope.menu.analytics.css = '';

        if ($scope.menu.admin){
            $scope.menu.brandCaption = 'Система учёта курсов';
            $scope.menu.appTitle = 'Система учёта курсов';
        }
        
        if (!$scope.menu.active || $scope.menu.active.id == menuId){
            $scope.menu.active = $scope.menu[menuId];
            $scope.menu.active.css = 'active';
        }
        else{
            $scope.menu[menuId].css = 'active';
            $scope.menu.active.css = '';
            $scope.menu.active = $scope.menu[menuId];
        }
    };

    // Сменить язык - перезагрузить приложение
    $scope.menu.switchLang = function(lang){
        if ($cookies.lang == lang)
            return;
            
        $cookies['lang'] = lang;
        $window.location.reload();
    };

    // Вход - выход
    $scope.menu.login = function(){
        $scope.menu.admin = ($cookies.admin === 'true');
        
        DALSrvc.getPromise('get', StcAppSetting.admin + '/json/checkAdmin/' + ($scope.menu.admin === true ? 0: 1), null).then(
            function(data){
                if (data.privileges=='read'){
                    $cookies['readOnlyMode'] = 'true';
                    $scope.menu.readOnlyMode = true;
                }
                else{
                    $cookies['readOnlyMode'] = 'false';
                    $scope.menu.readOnlyMode = false;
                }
                
                $scope.menu.user = data.user;
                $scope.menu.admin = true;
                $scope.menu.loginCaption = 'Выход';
                $scope.menu.brandCaption = 'Система учёта курсов';
                $cookies['user'] = data.user;
                $cookies['admin'] = 'true';
                
                if ($location.path() == '/createorder'){
                    $location.path('/orders');
                }
            },
            function(response){
                $scope.menu.user = "";
                $scope.menu.admin = false;
                $cookies['user'] = '';
                $cookies['admin'] = 'false';
                $cookies['readOnlyMode'] = 'false';
                $scope.menu.readOnlyMode = false;
                $scope.menu.loginCaption = 'Вход';
                $location.path('/createorder');
                $scope.menu.brandCaption = 'Форма регистрации на обучение компании InterSystems';
                $scope.menu.appTitle = 'Форма регистрации на обучение компании InterSystems';
            });
    }
    
    $scope.goTo = function(url){;
         $location.path(url);
    };
    
    $scope.menu.init();
    
});

