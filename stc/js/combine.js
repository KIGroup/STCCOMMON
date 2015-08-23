// Combine date time is 23.08.2015 16:43:34


// ===============================================================================================================================
// File: 1. controllers/MainCtrl.js
// ===============================================================================================================================
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


// ===============================================================================================================================
// File: 2. controllers/ScheduleFrameCtrl.js
// ===============================================================================================================================
'use strict';
//d

/*===========================================================================================
===========================================================================================*/

controllersModule.controller('ScheduleFrameCtrl', function($scope, $window, $filter, CourseTeacherSrvc, TrainingSrvc, YandexSrvc, UtilsSrvc){
    console.log('ScheduleFrameCtrl loading')
    
    if ($scope.menu) {
	    $scope.menu.hideNavBar = true;
    	$("#divContainer").css("padding", "0");
    	$("body").css("padding", "0");
    } 
    $scope.page = {};
    $scope.page.courses = [];

    $scope.page.loadSchedule = function(){
        CourseTeacherSrvc.getSchedule().then(
            function(data){
                $scope.page.courses = data.courses; 
                
                if (data.courses.length != 0){
					data.courses[0].style = {borderTop: 'none'};
					
					if (data.courses[0].trainings.length != 0){
						data.courses[0].trainings[0].detailsVisible = true;
						data.courses[0].trainings[0].headStyle = {color : 'rgb(175, 5, 5)'}; 
					}
				}

                var host_appName = window.location.host + StcAppSetting.defaultApp;

                for(var i=0; i < $scope.page.courses.length; i++){
                    var course = $scope.page.courses[i];
                    course.programUrl = 'http://' + course.programUrl; 
                    course.urlCreateOrder = 'http://' + host_appName + '/stc/index.csp#/createorder?course=' + course.id;

                    for (var t=0 ; t < course.trainings.length; t++){
                        var training = course.trainings[t];

                        training.yandexMapUrl = YandexSrvc.getMapLink(training.address.lat, training.address.lng);
					
                        training.dates = UtilsSrvc.getTwoDate(training.dateStart, training.dateFinish);

                        training.address = training.street;
                        if (training.room != "" && training.room != "-"){
                            training.address += ', ауд. ' + training.room;
                        }

                        training.curatorInfo = training.curator.fullName;
                        if (training.curator.phone != ""){
                            training.curatorInfo += ', ' + training.curator.phone;
                        }

                        //if (training.curator.email != ""){
                        //    training.curatorInfo += ', ' + training.curator.email;
                        //}
    
                        training.urlJoin = 'http://' + host_appName + '/stc/index.csp#/training/' + training.id + '/order';
                        training.urlAddGoogleCalendarEvent = TrainingSrvc.getUrlForCreateGoogleCalendarEvent(
                                        course.name + '. '+ training.city.name,
                                        training.dateGoogleCalendar,
                                        training.city.name + ', ' + training.street,
                                        {
	                                        trainingId: training.id,
                                            courseProgramUrl: course.programUrl,
                                            city: training.city.name + ', ' + training.city.parentName + ', ' + training.city.greatParentName,
                                            address: training.address,
                                            time: training.timeStartFinish,
                                            teacher: training.teacher.lastName + ' ' + training.teacher.firstName +  ', ' + training.teacher.email,
                                            curator: training.curatorInfo,
                                            otherInfo: training.otherInfo   
                                        });
                    }
                } 
                
            },
            function(response){
                console.log(response);
            });
    };

  	$scope.page.getStyle = function(idx){
		if (idx == 0) return {borderTop: 'none'};
		
		return {};
	};
    
    $scope.page.loadSchedule();

});
    


// ===============================================================================================================================
// File: 3. controllers/TrainingCtrl.js
// ===============================================================================================================================
'use strict';
//

/*===========================================================================================
Обучение
===========================================================================================*/

controllersModule.controller('TrainingCtrl', function($scope, $route, $location, $filter, $routeParams, UtilsSrvc, OrderSrvc, ReportSrvc, TrainingSrvc, CompanySrvc, PersonSrvc, CertificateSrvc){    
    if ($scope.menu.admin){
        $scope.menu.brandCaption = 'Система учёта курсов';
        $scope.menu.appTitle = 'Система учёта курсов';
    }
        
    $scope.training = {};
    $scope.sgroup = {contract:{}, grid: {}};
    $scope.cert = {};
    $scope.feedBack = {};
    $scope.newstud = {};
    $scope.student = {grid:{}};
    $scope.allstud = {};
    $scope.other = {email:{}};

    if (!$scope.pageStore.training || $scope.pageStore.training.id != $routeParams.id)
        $scope.pageStore.training = {id: $routeParams.id, tabSgActive: false, tabSgStActive: false, tabAllStudActive: false, tabCertsActive: false, tabNewStudActive: false};

    $scope.pageStore.trainingCertificates = {grid:{}};
    $scope.pageStore.newstud = {grid:{}};
    $scope.pageStore.feedBack = {grid:{}};
    $scope.pageStore.allstud = {grid:{}};

    $scope.other.init = function(){
        //============================== ПОДГРУППЫ ==========================================================================
            $scope.sgroup.columns = [
                          {name: 'Плательщик', sqlName: 'SubGroups->Payer->ShortName->Value', isSorted: true,  isSortable: true, isDown: true, isSearched: true,  isSearchable: true},
                          {name: 'Слушатели', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '80px'}},
                          {name: 'Сумма к оплате',sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '140px'}},
                          {name: 'Валюта', sqlName: 'SubGroups->Currency->Name->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true, captionStyle: {textAlign: 'center', width: '150px'}}];
                          
        $scope.sgroup.properties = [
                          {name:'payer.shortName'}, 
                          {name:'students.length', cellStyle: {textAlign: 'center'}}, 
                          {name:'amount', cellStyle: {textAlign: 'center'}}, 
                          {name:'currency.name', cellStyle: {textAlign: 'center'}}];
        $scope.sgroup.pageSize = 10;
        $scope.sgroup.pageCurr = 1;
        $scope.sgroup.itemsTotal = 0;
        $scope.sgroup.selectedItems = [];
        $scope.sgroup.multiSelectMode = false;
        $scope.sgroup.forciblyUpdate = 0;

        //$scope.sgroup.loadCurrencies();
        
        //============================== СЕРТИФИКАТЫ ==========================================================================
        $scope.cert.columns = [
                          {name: 'Курс', sqlName: 'Training->Course->Name->Value', isSorted: false, isSortable: true, isDown: true, isSearched: true, isSearchable: true},
                          {name: 'Номер', sqlName: 'Number', isSorted: true, isSortable: true, isDown: true, isSearched: false, isSearchable: true, captionStyle: {textAlign: 'center', width: '80px'}},
                          {name: 'Слушатель', sqlName: 'Student->LastName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Организация', sqlName: '', isSorted: false, isSortable: false,isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Дата создания', sqlName: 'CreatedDate', isSorted: false, isSortable: true, isDown: false, isSearched: false, isSearchable: false, filter: 'date'},
                          {name: 'Статус', sqlName: 'isPrinted', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true, captionStyle: {textAlign: 'center', width: '100px'}}];
        
        $scope.cert.properties = [{name:'training.course.nameString', 
                                  calculate: function(item){
                                                item.training.course.nameString = item.training.course.name;
                                                
                                                if (item.training.course.name.length >= 30){
                                                    item.training.course.nameString = item.training.course.nameString.substring(0,30) + '...';
                                                }
                                             }
                                  }, 
                                  {name:'number', cellStyle: {textAlign: 'center'}},
                                  {name:'student.fullName', 
                                  calculate: function(item){
                                                item.student.fullName = item.student.lastName + ' ' + item.student.firstName + ' ' + item.student.middleName;
                                  }}, 
                                  {name:'student.company.shortNameString', 
                                  calculate: function(item){
                                                item.student.company.shortNameString = item.student.company.shortName;
                                                
                                                if (item.student.company.shortName.length >= 40){
                                                    item.student.company.shortNameString = item.student.company.shortNameString.substring(0,40) + '...';
                                                }
                                             }
                                  },
                                  {name:'date', filter: 'date', filterParam: $filter('localize')('d MMMM y')}, 
                                  {name:'status', cellStyle: {textAlign: 'center'},
                                  getCssClass: function(item){
                                                return 'label ' + (item.isPrinted == 0 ? 'label-important' : 'label-success');
                                              }, 
                                  calculate: function(item){
                                                item.status = item.isPrinted == 1 ? $filter('localize')('Распечатан') : $filter('localize')('Не распечатан');
                                  }}];

        $scope.cert.pageSize = UtilsSrvc.getPropertyValue($scope.pageStore, 'trainingCertificates.grid.pageSize', 15);
        $scope.cert.pageCurr = UtilsSrvc.getPropertyValue($scope.pageStore, 'trainingCertificates.grid.pageCurr', 1);
        $scope.cert.itemsTotal = 0;
        $scope.cert.selectedItems = [];
        $scope.cert.multiSelectMode = false;
        $scope.cert.forciblyUpdate = 0;
        $scope.cert.actionColumnVisible = true;

        //$scope.cert.forciblyUpdate++; 

        //============================== ОТЗЫВЫ =======================================================================================
        $scope.feedBack.columns = [
                          {name: 'Автор', sqlName: 'Author', isSorted: false, isSortable: true, isDown: true, isSearched: true, isSearchable: false, captionStyle: {textAlign: 'center', width: '200px'}},
                          {name: 'Ср. оценка курса', sqlName: 'AvgCourseRating', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center'}},
                          {name: 'Ср. оценка преподавателя', sqlName: 'AvgInstructorRating', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true, captionStyle: {textAlign: 'center'}},
                          {name: 'Дата создания', sqlName: 'CreatedTS', isSorted: true, isSortable: true, isDown: false, isSearched: false, isSearchable: false, filter: 'date', captionStyle: {width: '180px'}}];
 
        $scope.feedBack.properties = [
                                     {name: 'author'},
                                     {name: 'avgCourseRating', cellStyle: {textAlign: 'center'}}, 
                                     {name: 'avgInstructorRating', cellStyle: {textAlign: 'center'}},
                                     {name: 'createdTS', filter: 'date', filterParam: $filter('localize')('d MMMM y, HH:mm:ss')}];

        $scope.feedBack.pageSize = UtilsSrvc.getPropertyValue($scope.pageStore, 'feedBack.grid.pageSize', 10);
        $scope.feedBack.pageCurr = UtilsSrvc.getPropertyValue($scope.pageStore, 'feedBack.grid.pageCurr', 1);
        $scope.feedBack.itemsTotal = 0;
        $scope.feedBack.selectedItems = [];
        $scope.feedBack.multiSelectMode = false;
        $scope.feedBack.forciblyUpdate = 0;

        //============================== НОВЫЕ СЛУШАТЕЛИ ==========================================================================
        $scope.newstud.columns = [
                          {name: 'Фамилия', sqlName: 'LastName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: true, isSearchable: true},
                          {name: 'Имя', sqlName: 'FirstName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Отчество', sqlName: 'MiddleName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Организация', sqlName: 'Company->ShortName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Email', sqlName: 'Email', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Телефон', sqlName: 'Phone', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Skype', sqlName: 'Skype', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Дата создания', sqlName: 'CreatedTS', isSorted: true, isSortable: true, isDown: false, isSearched: false, isSearchable: false, filter: 'date'}];

        $scope.newstud.properties = [{name:'lastName'}, 
                                     {name:'firstName'},
                                     {name:'middleName'}, 
                                     {name:'company.shortName'},
                                     {name:'email'},
                                     {name:'phone'},
                                     {name:'skype'},
                                     {name:'createdTS', filter: 'date', filterParam: $filter('localize')('d MMMM y, HH:mm:ss')}];

        $scope.newstud.pageSize = UtilsSrvc.getPropertyValue($scope.pageStore, 'newstud.grid.pageSize', 10);
        $scope.newstud.pageCurr = UtilsSrvc.getPropertyValue($scope.pageStore, 'newstud.grid.pageCurr', 1);
        $scope.newstud.itemsTotal = 0;
        $scope.newstud.selectedItems = [];
        $scope.newstud.multiSelectMode = false;
        $scope.newstud.forciblyUpdate = 0;
        $scope.newstud.actionColumnVisible = true;

        //$scope.newstud.forciblyUpdate++;
        
        //============================== СТУДЕНТЫ ПОДГРУППЫ ==========================================================================
        $scope.student.columns = [{name: 'Фамилия'}, {name: 'Имя'}, {name: 'Отчество'}, {name: 'Организация'}, {name: 'Email'}, {name: 'Телефон'}, {name: 'Skype'}];
        $scope.student.properties = [{name:'lastName'}, {name:'firstName'}, {name:'middleName'}, {name:'company.shortName'}, {name:'email'}, {name:'phone'}, {name:'skype'}];
        $scope.student.pageSize = 100;
        $scope.student.pageCurr = 1;
        $scope.student.itemsTotal = 0;
        $scope.student.selectedItems = [];
        $scope.student.multiSelectMode = false; 
     

        //============================== ВСЕ СТУДЕНТЫ ==========================================================================
        $scope.allstud.columns = [
                          {name: 'ФИО', sqlName: 'FullName', isSorted: false, isSortable: true, isDown: true, isSearched: true, isSearchable: true},
                          {name: 'Организация', sqlName: 'Student->Company->ShortName->Value', isSorted: true, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Email', sqlName: 'Student->Email', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Телефон', sqlName: 'Student->Phone', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Skype', sqlName: 'Student->Skype', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Посещал курсы', sqlName: '', isSorted: false, isSortable: false, isDown: true,  isSearched: false,  isSearchable: false, captionStyle: {textAlign: 'center', width: '150px'}}];

        $scope.allstud.properties = [
            {name:'lastName',
                calculate: function(item){
                    item.fullName = $scope.getFullNameForCurLang(item.lastName, item.firstName, item.middleName);
                },}, 
            {name:'company.shortName'}, 
            {name:'email'}, 
            {name:'phone'}, 
            {name:'skype'},
            {name:'attendedStatus',
               cellSelectable: true,
               cellStyle: {textAlign: 'center'},
               getCssClass: function(item){
                    if (item.attendedStatusCode == 'Visited'){
                         return 'icon icon-check';
                    }
                    else if (item.attendedStatusCode == 'NotVisited'){
                         return 'icon icon-check-empty';
                    } 
                    
                    return 'icon icon-question';
               },
               onClickCell: function(item){
                   var newCode = 'Visited';
                   if (item.attendedStatusCode == 'Visited')
                        newCode = 'NotVisited'
                   
                   TrainingSrvc.updateStudentAttendedStatus($scope.training.data.accessCode, item.id, newCode).then(
                        function(data){
                            $scope.allstud.forciblyUpdate++;
                        },
                        function(response){
                            $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                        });
               }}
        ];
            
        $scope.allstud.pageSize = 15;
        $scope.allstud.pageCurr = 1;
        $scope.allstud.itemsTotal = 0;
        $scope.allstud.selectedItems = [];
        $scope.allstud.multiSelectMode = false;
        $scope.allstud.forciblyUpdate = 0;
    };



    // Загрузить обучение по ИД
    $scope.training.loadData = function(id){
        TrainingSrvc.get(id).then(
            function(data){
                $scope.training.data = data;

                $scope.training.dateStart = data.dateStart;
                $scope.training.dateFinish = data.dateFinish;
                $scope.training.data.isCertificatesDone = data.isCertificatesDone == 1;
                $scope.training.data.isPublic = data.isPublic == 1;
                
                if (data.isCompleted == 0){
                    $scope.training.btnAdditionName = 'Завершить';
                      $scope.training.btnAdditionVisible = true;
                }
                else{
                    $scope.training.btnAdditionVisible = false;
                }
                
                $scope.training.btnAdditionAction = $scope.training.complete;  
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Обновить данные обучения
    $scope.training.save = function(){
        TrainingSrvc.save($scope.training.data).then(
            function(data){
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Изменения сохранены.', 'success', true);
                $scope.trainingForm.$setPristine();
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Завершить обучение и создать сертификаты
    $scope.training.complete = function(){
        function complete (){
          TrainingSrvc.complete($scope.training.data.id).then(
              function(data){
                  $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Обучение завершено.', 'success', true);
                  $route.reload();
              },
              function(response){
                  $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
              });
        }

         UtilsSrvc.openMessageBox('Завершение обучения', $filter('localize')("Завершить обучение и создать сертификаты для слушателей?"), complete);  
    };

    //===============================================================================================================================================================================
    // GROUP                                                                                                                                                                    GROUP
    //===============================================================================================================================================================================
    // Загрузить подгруппы
    $scope.sgroup.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        //console.log('msg: sgroup.loadItems');
        TrainingSrvc.getSubGroupsForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $routeParams.id).then(
            function(data){
                $scope.sgroup.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.sgroup.itemsTotal = data.itemsTotal;
                $scope.sgroup.items = data.items;
                $scope.training.data.sgroups = data.itemsTotal;

                if ($scope.sgroup.selectedItems && $scope.sgroup.items && $scope.sgroup.selectedItems.length == 0 && $scope.sgroup.items.length != 0){
                    $scope.sgroup.selectedItems[0] = $scope.sgroup.items[0];
                    $scope.sgroup.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Загрузить валюты
    $scope.sgroup.loadCurrencies = function(){
        //console.log('msg: sgroup.loadCurrencies');
        TrainingSrvc.getCurrencies().then(
            function(data){
                $scope.sgroup.currencies = data;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Сохранить платеж
    $scope.sgroup.savePayment = function(){
        TrainingSrvc.saveSubGroupPayment({id: $scope.sgroup.selectedItems[0].id, 
                                          currencyId: $scope.sgroup.selectedItems[0].currency.id, 
                                          amount: $scope.sgroup.selectedItems[0].amount,
                                          discount: $scope.sgroup.selectedItems[0].discount=='' ? 0: $scope.sgroup.selectedItems[0].discount}).then(
            function(data){
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Платеж для подгруппы сохранен.', 'success', true);
                $scope.sgPaymentForm.$setPristine();
                $scope.sgroup.modalPaymentVisible = false;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });  
    };
    
    // Изменение величины скидки на обучение
    $scope.sgroup.changeDiscount = function(){
        if ($scope.sgroup.selectedItems[0].discount <= 100 && $scope.sgroup.selectedItems[0].discount >= 0){
            $scope.sgroup.selectedItems[0].amount = ($scope.training.data.cost.price - $scope.training.data.cost.price * ($scope.sgroup.selectedItems[0].discount / 100)).toFixed(2) * 1;    
        }
        else{
            $scope.sgroup.selectedItems[0].amount = $scope.sgroup.selectedItems[0].amountReal; 
        }
    };

    // Сохранить данные договора
    $scope.sgroup.saveContract = function(){
        TrainingSrvc.saveSubGroupContract($scope.sgroup.contract).then(
            function(data){
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Данные договора сохранены.', 'success', true);
                $scope.sgContractForm.$setPristine();
                $scope.sgroup.forciblyUpdate++;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });  
    };


    // Открыть модальное окно для платежа
    $scope.sgroup.openPaymentModal = function(){
        $('#PaymentModal').modal('show');
        $scope.sgroup.modalPaymentVisible = true;
    };
    
    // Отмена изменений платежа
    $scope.sgroup.cancelPayment = function(){
        if ($scope.sgPaymentForm.$pristine){
            $scope.sgroup.modalPaymentVisible = false;    
        }
        $scope.sgroup.forciblyUpdate++;
        $scope.sgPaymentForm.$setPristine();
    };

    // Отслеживание выбранной подгруппы
    $scope.$watch('sgroup.selectedItems[0].id', function(){
        if ($scope.sgroup.selectedItems.length != 0){
            $scope.sgroup.contract = $scope.sgroup.selectedItems[0].contract;
            $scope.sgroup.dateSt = $scope.sgroup.contract.dateStart;
            $scope.sgroup.dateFn = $scope.sgroup.contract.dateFinish;

            if ($scope.sgroup.selectedItems[0].amount == $scope.training.data.cost.price && $scope.sgroup.selectedItems[0].currency.id == $scope.training.data.cost.currency.id){
                $scope.sgroup.selectedItems[0].discount = 0;
            }
        }
        
        if (!$scope.sgPaymentForm.$dirty)
            return;

        $scope.sgroup.forciblyUpdate++;
        $scope.sgPaymentForm.$setPristine();
    },true);

    // При изменении валюты в выбранной подгруппе
    $scope.$watch('sgroup.selectedItems[0].currency.id', function(){ 
        if (!$scope.sgroup.selectedItems[0])
            return;
            
        var idx = UtilsSrvc.getIndexes($scope.sgroup.currencies, 'id', $scope.sgroup.selectedItems[0].currency.id)
        
        if (idx.length == 0)
            return;
        
        $scope.sgroup.selectedItems[0].currency.name = $scope.sgroup.currencies[idx[0]].name;
    },true);

  

    // Удалить подгруппу из обучения
    $scope.sgroup.remove = function(item){
        function deleteSGroup(){
            TrainingSrvc.deleteSubGroup($scope.training.data.id, item.id).then(
                function(data){
                    $scope.sgroup.selectedItems = [];
                    $scope.sgroup.forciblyUpdate++;
                    $scope.allstud.forciblyUpdate++;
                    $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Подгруппа удалена.', 'success', true);
                },
                function(response){
                    $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });  
        };

        UtilsSrvc.openMessageBox('Удалить подгруппу', $filter('localize')("Удалить подгруппу плательщика") + ' ' + item.payer.shortName + "?", deleteSGroup);  
    };

    // Открыть модальное окно для создания новой подгруппы
    $scope.sgroup.add = function(){
        $('#AddSubGroupModal').modal('show');
        $scope.sgroup.modalAddSubGroupVisible = true;

        if (!$scope.sgroup.companies || $scope.sgroup.companies.length == 0)
            $scope.sgroup.loadCompanies();
    };
    
    // Добавить подгруппу в обучение
    $scope.sgroup.addSubGroup = function(){
        $scope.sgroup.modalAddSubGroupVisible = false;
        
        TrainingSrvc.createSubGroup($scope.training.data.id, {payerId: $scope.sgroup.newSubGroupPayer ? $scope.sgroup.newSubGroupPayer.id : ''}).then(
            function(data){
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Подгруппа добавлена.', 'success', true);
                $scope.sgroup.forciblyUpdate++;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });  
    };

    /* Подгрузить имена компаний */
    $scope.sgroup.loadCompanies = function(){
        //console.log('msg: sgroup.loadCompanies');
        CompanySrvc.getAll().then(
            function(data){
                $scope.sgroup.companies = data;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };


    // Перейти на страницу для добавления слушателя в подгруппу
    $scope.student.add = function(){
        $location.path('/training/' + $scope.training.data.id + '/subgroup/' + $scope.sgroup.selectedItems[0].id + '/student');
    };
    
    // Перейти на страницу для редактирования слушателя в подгруппу
    $scope.student.edit = function(item){
        $location.path('/training/' + $scope.training.data.id + '/student/' + item.id);
    };

    // Удалить слушателя из подгруппы
    $scope.student.remove = function(item){
        function deleteSGroupStudent(){
            TrainingSrvc.deleteStudent($scope.training.data.id, item.id).then(
                function(data){
                    $scope.sgroup.forciblyUpdate++;
                    $scope.allstud.forciblyUpdate++;
                    $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Слушатель удален из обучения.', 'success', true);
                },
                function(response){
                    $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });  
        };

        UtilsSrvc.openMessageBox('Удалить слушателя', $filter('localize')("Удалить слушателя") + ' ' + item.lastName + "?", deleteSGroupStudent);   
    };

    // Отформатировать данные перед отправкой формы
    $scope.sgroup.formatData = function(){
        $scope.sgroup.contract.dateStart = UtilsSrvc.getValidDate($scope.sgroup.dateSt);
        if ($scope.sgroup.contract.dateStart == "")
            $scope.sgroup.dateSt = "";

        $scope.sgroup.contract.dateFinish = UtilsSrvc.getValidDate($scope.sgroup.dateFn);
        if ($scope.sgroup.contract.dateFinish == "")
            $scope.sgroup.dateFn = "";

        $scope.sgroup.contract.city = $scope.training.data.city;
        $scope.sgroup.contract.id = $scope.sgroup.selectedItems[0].id;
    };

    $scope.sgroup.selectTab = function(){
        if (!$scope.sgroup.items || $scope.sgroup.items.length==0)
            $scope.sgroup.forciblyUpdate++;

        if (!$scope.sgroup.currencies || $scope.sgroup.currencies.length==0)
            $scope.sgroup.loadCurrencies();
    };



    //===============================================================================================================================================================================
    // CERTIFICATES                                                                                                                                                      CERTIFICATES
    //===============================================================================================================================================================================
    // Загрузка сертификатов
    $scope.cert.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        //console.log('msg: cert.loadItems');
        TrainingSrvc.getCertificates(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $routeParams.id).then(
            function(data){
                $scope.cert.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.cert.itemsTotal = data.itemsTotal;
                $scope.cert.items = data.items;
                $scope.training.data.certificates = $scope.cert.itemsTotal;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Сменить статус печати
    $scope.cert.print = function(item){
         CertificateSrvc.print(item.number).then(
            function(data){
                //$scope.cert.alert = UtilsSrvc.getAlert('Готово!', 'Статус сертификата изменен.', 'success', true);
                $scope.cert.forciblyUpdate++;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Удалить сертификат
    $scope.cert.remove = function(item){
        function removeCert(){
           CertificateSrvc.remove(item.number).then(
              function(data){
                  $scope.cert.forciblyUpdate++;
                  $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Сертификат удалён.', 'success', true);
              },
              function(response){
                  $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
              });
        };

        UtilsSrvc.openMessageBox('Удалить сертификат', $filter('localize')("Удалить сертификат слушателя") + " '" + item.student.lastName + "'?", removeCert); 
    };


    // Экспорт сертификатов
    $scope.cert.exportToCSV = function(){
        ReportSrvc.certificates($scope.training.data.id);
    };
    
    // Отправка в офис
    $scope.cert.sendToOffice = function(){
        function send(){
            CertificateSrvc.sendToOffice($scope.training.data.id).then(
            function(data){
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Письма добавлены в очередь, проверьте журнал рассылок', 'success', true);
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
        };

        UtilsSrvc.openMessageBox('Рассылка писем', $filter('localize')("Выполнить рассылку списка сертификатов участникам группы \"Офис\" ?"), send);  
    };

    // Создать все сертификаты
    $scope.cert.createAll = function(){
         TrainingSrvc.createCertificates($routeParams.id).then(
            function(data){
                $scope.cert.forciblyUpdate++;
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Сертификаты обновлены.', 'success', true);
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    $scope.cert.selectTab = function(){
        if (!$scope.cert.items || $scope.cert.items.length==0)
            $scope.cert.forciblyUpdate++;
    };    



    //===============================================================================================================================================================================
    // NEW ORDERS                                                                                                                                                          NEW ORDERS     
    //===============================================================================================================================================================================
    // Загрузка новых слушателей
    $scope.newstud.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        //console.log('msg: newstud.loadItems');
        OrderSrvc.getAllOrdersNewStudentForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $routeParams.id).then(
            function(data){
                $scope.newstud.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.newstud.itemsTotal = data.itemsTotal;
                $scope.newstud.items = data.items;
                $scope.training.data.newStudents = data.itemsTotal;

                if ($scope.newstud.selectedItems && $scope.newstud.items && $scope.newstud.selectedItems.length == 0 && $scope.newstud.items.length != 0){
                    $scope.newstud.selectedItems[0] = $scope.newstud.items[0];
                    $scope.newstud.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Удалить заявку
    $scope.newstud.remove = function(item){
        function removeOrd(){
           OrderSrvc.deleteOrderNewStudent(item.id).then(
              function(data){
                  $scope.newstud.forciblyUpdate++;
                  $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Заявка от слушателя удалена.', 'success', true);
              },
              function(response){
                  $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
              });
        };

        UtilsSrvc.openMessageBox('Удалить заявку', $filter('localize')("Удалить заявку от слушателя") + " '" + item.lastName + "'?", removeOrd); 
    };

    // Вызов при каждом выборе студента
    $scope.$watch('newstud.selectedItems[0].id', function(){
        if ($scope.newstud.selectedItems.length == 0)
            return;

        PersonSrvc.getByEmail($scope.newstud.selectedItems[0].email).then(
            function(data){
                $scope.newstud.conflict = data;
            },
            function(response){
                $scope.newstud.conflict = {};
            });
    },true);

    // Добавление слушателя из заявки в обучение
    $scope.newstud.addIntoTraining = function(type){
        TrainingSrvc.addNewStudentIntoTraining({orderId: $scope.newstud.selectedItems[0].id, trainingId: $scope.training.data.id, type: type}).then(
                function(data){
                    $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Слушатель из заявки добавлен в обучение.', 'success', true);
                    $scope.newstud.forciblyUpdate++;
                    $scope.sgroup.forciblyUpdate++;
                    $scope.allstud.forciblyUpdate++;
          
                    $scope.newstud.selectedItems = [];
                },
                function(response){
                    $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                    $scope.newstud.forciblyUpdate++;
                    $scope.sgroup.forciblyUpdate++;
                    $scope.allstud.forciblyUpdate++;
          
                    $scope.newstud.selectedItems = [];
                });
    };

    // Открыть диалог смены компании в заявке
    $scope.other.openChangeCompanyDialog = function(){
        if (!$scope.sgroup.companies || $scope.sgroup.companies.length == 0)
            $scope.sgroup.loadCompanies();
        
        $('#ChangeCompanyModal').modal('show');
        $scope.other.modalChangeCompanyVisible = true;
    };

    // Изменение компании в заявке
    $scope.other.changeCompany = function(){
        $scope.other.modalChangeCompanyVisible = false;
        if (!$scope.other.newOrderCompany || !$scope.other.newOrderCompany.id)
            return;
        
        OrderSrvc.changeOrderNewStudentCompany($scope.newstud.selectedItems[0].id, $scope.other.newOrderCompany.id).then(
                function(data){
                    $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Произошла смена организации в заявке.', 'success', true);
                    $scope.newstud.forciblyUpdate++;
                },
                function(response){
                    $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
    };

    // Переход на страницу создания компании
    $scope.other.createCompany = function(){
        $location.path('/company').search({ordernewstudent: $scope.newstud.selectedItems[0].id});
    };


    $scope.newstud.selectTab = function(){
        if (!$scope.newstud.items || $scope.newstud.items.length==0)
            $scope.newstud.forciblyUpdate++;
    };    



    //============================================================================================================================================================================
    // ALL STUDENTS                                                                                                                                                   ALL STUDENTS  
    //============================================================================================================================================================================
    // Загрузить всех слушателей
    $scope.allstud.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        //console.log('msg: allstud.loadItems');
        TrainingSrvc.getStudentsForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $routeParams.id).then(
            function(data){
                $scope.allstud.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.allstud.itemsTotal = data.itemsTotal;
                $scope.allstud.items = data.items;
                $scope.training.data.students = data.itemsTotal;

                if ($scope.allstud.selectedItems && $scope.allstud.items && $scope.allstud.selectedItems.length == 0 && $scope.allstud.items.length != 0){
                    $scope.allstud.selectedItems[0] = $scope.allstud.items[0];
                    $scope.allstud.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Перейти на страницу для добавления слушателя в подгруппу
    $scope.allstud.add = function(){
        $location.path('/training/' + $scope.training.data.id + '/student');
    };
    
    // Перейти на страницу для редактирования слушателя в подгруппу
    $scope.allstud.edit = function(item){
        $location.path('/training/' + $scope.training.data.id + '/student/' + item.id);
    };

    // Удалить слушателя из подгруппы
    $scope.allstud.remove = function(item){
        function deleteTrainingStudent(){
            TrainingSrvc.deleteStudent($scope.training.data.id, item.id).then(
                function(data){
                    $scope.sgroup.forciblyUpdate++;
                    $scope.allstud.forciblyUpdate++;
                    $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Слушатель удален из подгруппы.', 'success', true);
                },
                function(response){
                    $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });  
        };

        UtilsSrvc.openMessageBox('Удалить слушателя', $filter('localize')("Удалить слушателя") + ' ' + item.lastName + "?", deleteTrainingStudent);   
    };

    $scope.allstud.onSelect = function(item){     
        
    };

    $scope.allstud.onSelectCell = function(item, property){
        if (!item) return;

        property.onClickCell(item);
    };
    
    $scope.allstud.selectTab = function(){
        if (!$scope.allstud.items || $scope.allstud.items.length==0)
            $scope.allstud.forciblyUpdate++;
    };    

    //===========================================================================================================================================================================
    // Google Calendar                                                                                                                                            Google Calendar
    //===========================================================================================================================================================================
    // Load event by id or if id==null -> generate
    $scope.training.loadEvent = function(){
       TrainingSrvc.doEvent({method: "get", id: $routeParams.id}).then(
            function(data){
                data.event.description = data.event.description.replace(/<br>/g, "\n");
                $scope.training.eventData = data;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Create event
    $scope.training.createEvent = function(){
       TrainingSrvc.doEvent({method: "create", id: $routeParams.id, event:  $scope.training.eventData.event}).then(
            function(data){
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Событие создано.', 'success', true);
                $scope.training.eventData.event.exists = 1;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Update event
    $scope.training.updateEvent = function(){
       TrainingSrvc.doEvent({method: "update", id: $routeParams.id, event:  $scope.training.eventData.event}).then(
            function(data){
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Событие обновлено.', 'success', true);
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Delete event
    $scope.training.deleteEvent = function(){
        function deleteEvent(){
           TrainingSrvc.doEvent({method: "delete", id: $routeParams.id}).then(
                function(data){
                    $scope.training.loadEvent();      
                    $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Событие удалено.', 'success', true);
                },
                function(response){
                    $scope.training.loadEvent();      
                    $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Событие удалено.', 'success', true);
                });
        };

        UtilsSrvc.openMessageBox('Удалить событие', "Удалить событие из календаря?", deleteEvent);   
    };


    //==============================================================================================================================================================================
    // Automailing                                                                                                                                                       Automailing
    //==============================================================================================================================================================================
    // Load all students emails
    $scope.mailing = {};

    // Delete email from recipient field
    $scope.mailing.deleteEmailContact = function(contact){
        var idx = UtilsSrvc.getIndexes($scope.mailing.selectedGroup.contacts, 'id', contact.id);
                
        if (idx.length != 0)
            $scope.mailing.selectedGroup.contacts.splice(idx[0], 1);
    };

     // Send email to training students or custom student (single email)
    $scope.mailing.sendEmail = function(isSingleEmail){
        var contacts = [];

        if (isSingleEmail){
            contacts = [{name: '', email: $scope.mailing.single}];
        }
        else{
            contacts = $scope.mailing.selectedGroup.contacts;
        }

        if (contacts.length == 0){
            $scope.other.alert = UtilsSrvc.getAlert('Внимание!', 'Выберите получателей письма.', 'error', true);
            return;
        }

        var promise = TrainingSrvc.sendEmail({
            isSubscribers: $scope.mailing.selectedGroup.isSubscribers,
            contacts: contacts,
            subject: $scope.mailing.selectedGroup.mail.subject,
            message: $scope.mailing.selectedGroup.mail.message.replace(/\n/g, "<br>")
        });
    
        promise.then(
            function(data){
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Письма добавлены в очередь, проверьте журнал рассылок', 'success', true);
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

 
    // Off\On Automailing for training 
    $scope.mailing.changeStatus = function(){
        //console.log('msg: mailing.changeStatus');
      
        TrainingSrvc.changeStatusAutoMailing({id: $scope.training.data.id, isAutoMailing: $scope.mailing.selectedGroup.isAutoMailing, groupId: $scope.mailing.selectedGroup.id}).then(
            function(data){
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Изменения сохранены.', 'success', true);
              
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };


    // Select tab "Mailing"
    $scope.mailing.selectTab = function(){
        TrainingSrvc.getMailingGroups($scope.training.data.id).then(
            function(data){
                $scope.mailing.groups = data.mGroups;

                if (data.mGroups.length != 0){
                    if ($scope.mailing.selectedGroup){
                        var idx = UtilsSrvc.getIndexes($scope.mailing.groups, 'id', $scope.mailing.selectedGroup.id);         
                        if (idx.length != 0){
                            $scope.mailing.selectedGroup = data.mGroups[idx[0]];
                        }
                        else{
                            $scope.mailing.selectedGroup = data.mGroups[0];  
                        }
                    }
                    else{
                        $scope.mailing.selectedGroup = data.mGroups[0];
                    }
                }

                for (var i=0; i < $scope.mailing.groups.length; i++){
                    $scope.mailing.groups[i].isAutoMailing = $scope.mailing.groups[i].isAutoMailing == 1;
                    $scope.mailing.groups[i].mail.message = $scope.mailing.groups[i].mail.message.replace(/<br>/g, "\n");
                    
                    var contacts = $scope.mailing.groups[i].contacts;
                    
                    if (contacts.length > 30){
                        $scope.mailing.groups[i].contactsStyle = {
                            height: '130px', 
                            overflowX: 'auto',
                            border: '1px dashed rgb(158, 158, 158)',
                            padding: '4px'
                        };
                    }
                    
                    for (var c=0; c < contacts.length; c++){
                        if (contacts[c].name.length > 20){
                            contacts[c].nameShort = contacts[c].name.substring(0, 17) + '...'
                        }
                        else{
                            contacts[c].nameShort = contacts[c].name;
                        }
                    }
                }
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    //=============================================================================================================================================================================
    // FeedBacks                                                                                                                                                          FeedBacks
    //=============================================================================================================================================================================
    // Load feedbacks
    $scope.feedBack.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        //console.log('msg: feedBack.loadItems');
        TrainingSrvc.getFeedBacksForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $routeParams.id).then(
            function(data){
                $scope.feedBack.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.feedBack.itemsTotal = data.itemsTotal;
                $scope.feedBack.items = data.items;
                $scope.training.data.feedBacks.count = $scope.feedBack.itemsTotal;
        
                if ($scope.feedBack.selectedItems && $scope.feedBack.items && $scope.feedBack.selectedItems.length == 0 && $scope.feedBack.items.length != 0){
                    $scope.feedBack.selectedItems[0] = $scope.feedBack.items[0];
                    $scope.feedBack.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Select tab "FeedBacks"
    $scope.feedBack.selectTab = function(){
        $scope.feedBack.forciblyUpdate++;
    };

    // Remove feedback from student
    $scope.feedBack.remove = function(item){
        function deleteFeedBack(){
           TrainingSrvc.deleteFeedBack(item.id).then(
                function(data){
                    $scope.feedBack.selectedItems = [];
                    $scope.feedBack.forciblyUpdate++;    
                    $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Отзыв удален.', 'success', true);
                },
                function(response){      
                    $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        };

        UtilsSrvc.openMessageBox('Удалить отзыв', "Вы уверены?", deleteFeedBack);   
    };    

    $scope.other.init();
    $scope.training.loadData($routeParams.id);
    
    if (!$scope.menu.admin){
        $scope.menu.brandCaption = 'Система учёта курсов';
        $scope.menu.appTitle = 'Система учёта курсов';
        console.log('training $scope.menu.login();')
        $scope.menu.login(); 
    };
});


// ===============================================================================================================================
// File: 4. controllers/AllTrainingsCtrl.js
// ===============================================================================================================================
'use strict';
//ddвdаd

/*===========================================================================================
Все обучения
===========================================================================================*/

controllersModule.controller('AllTrainingsCtrl', function($scope, $filter, $location, $routeParams, UtilsSrvc, TrainingSrvc){
    $scope.menu.selectMenu('trainings');

    if (!$scope.pageStore.trainings)
        $scope.pageStore.trainings = {grid:{}};

    $scope.training = {};
    if ($scope.menu.readOnlyMode){
        $scope.training.secondRowActionIcon = '';
        $scope.training.actionColumnIcon = 'icon-ellipsis-horizontal';
    }
    else{
        $scope.training.secondRowActionIcon = 'icon-remove';
        $scope.training.actionColumnIcon = 'icon-plus-sign';
    }
    
    $scope.cert = {};

    $scope.training.init = function(){
        $scope.training.columns = [
                          {name: 'Курс', sqlName: 'Course->Name->Value', isSorted: false, isSortable: true, isDown: false, isSearched: true, isSearchable: true},
                          {name: 'Город', sqlName: 'City->Name->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Дата начала / окончания', sqlName: 'DateStart', isSorted: true, isSortable: true, isDown: false,  isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '225px'}},
                          {name: 'Подгруппы', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '85px'}},
                          {name: 'Слушатели', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '85px'}},
                          {name: 'Отзывы', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '60px'}},
                          {name: 'Заявки', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '60px'}},
                          {name: 'Статус', sqlName: 'IsCompleted', isSorted: false, isSortable: true,  isDown: true,  isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '90px'}}];
                            
        $scope.training.properties = [{name: 'course.nameShort',
                                        calculate: function(item){
                                            if (item.course.name.length > 60){
                                                item.course.nameShort = item.course.name.substring(0, 60) + '...'; 
                                            }
                                            else{
                                                item.course.nameShort = item.course.name;
                                            }
                                        }}, 
                                      {name: 'city.name'}, 
                                      {name: 'dates', cellStyle: {textAlign: 'center'},
                                        calculate:function(item){
                                            item.dates = UtilsSrvc.getTwoDate(item.dateStart, item.dateFinish);
                                        }},
                                      {name: 'sgroups', cellStyle: {textAlign: 'center'}},
                                      {name: 'students', cellStyle: {textAlign: 'center'}},
                                      {name: 'feedBacks.count', cellStyle: {textAlign: 'center'}},
                                      {name: 'newStudents', cellStyle: {textAlign: 'center'},
                                        getCssClass: function(item){
                                            return '' + (item.newStudents > 0 ? 'label label-important' : '');
                                        }},
                                      {name: 'status', cellStyle: {textAlign: 'center'},
                                        getCssClass: function(item){
                                            return 'label ' + (item.isCompleted == 0 ? 'label-info' : 'label-success');
                                        },
                                        calculate: function(item){
                                            item.isCertificatesDone = item.isCertificatesDone==0 ? false : true;
                                            item.isStudentsAutoMailing = item.isStudentsAutoMailing==0 ? false : true;
                                            item.isTeacherAutoMailing = item.isTeacherAutoMailing==0 ? false : true;
                                            item.isCuratorAutoMailing = item.isCuratorAutoMailing==0 ? false : true;
                                            item.isFeedBackAutoMailing = item.isFeedBackAutoMailing==0 ? false : true;
                                            item.status = item.isCompleted == 1 ? $filter('localize')('Завершено') : $filter('localize')('Не завершено');
                                            if (!item.isCertificatesDone){
                                                item.status += '*';
                                            }
                                        }}];

        $scope.training.status = UtilsSrvc.getPropertyValue($scope.pageStore, 'trainings.status', 'All');
        $scope.training.pageSize = UtilsSrvc.getPropertyValue($scope.pageStore, 'trainings.grid.pageSize', 10);;
        $scope.training.pageCurr = UtilsSrvc.getPropertyValue($scope.pageStore, 'trainings.grid.pageCurr', 1);;
        $scope.training.itemsTotal = 0;
        $scope.training.selectedItems = [];
        $scope.training.multiSelectMode = false;
        $scope.training.forciblyUpdate = 0;
        
        $scope.statuses = [{id: 'completed', name: $filter('localize')('Завершённые обучения')}, {id: 'not-completed', name: $filter('localize')('Незавершённые обучения')}];
        $scope.certStatuses = [{id: 'done', name: $filter('localize')('Сертификаты выданы')}, {id: 'not-done', name: $filter('localize')('Сертификаты не выданы')}];
        $scope.training.refresh();
    };
 
    // Загрузка
    $scope.training.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        TrainingSrvc.getAllForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, {status: $scope.training.selectedStatus, certStatus: $scope.training.selectedCertStatus}).then(
            function(data){
                $scope.training.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.training.itemsTotal = data.itemsTotal;
                $scope.training.items = data.items;
                
                if ($scope.training.selectedItems && $scope.training.items && $scope.training.selectedItems.length == 0 && $scope.training.items.length != 0){
                    $scope.training.selectedItems[0] = $scope.training.items[0];
                    $scope.training.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.training.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
    
    $scope.training.refresh = function(){
        $scope.training.forciblyUpdate++;
    }
    
    // Открыть обучение для просмотра на другой странице
    $scope.training.open = function(item){
        $location.path('/training/' + item.id);
    };

    // Создать пустое обучение
    $scope.training.add = function(){
        $location.path('/training');
    };
    
    // Копировать обучение
    $scope.training.clone = function(){
        $location.path('/training/' + $scope.training.selectedItems[0].id + '/clone');
    };

    // Удалить пустое обучение
    $scope.training.remove = function(item){
        function deleteTraining(){
            TrainingSrvc.remove(item.id).then(
                function(data){
                    $scope.training.alert = UtilsSrvc.getAlert('Готово!', 'Обучение удалено.', 'success', true);
                    $scope.training.selectedItems = [];
                    $scope.training.forciblyUpdate++;
                },
                function(response){
                    $scope.training.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });  
        };

        UtilsSrvc.openMessageBox('Удалить обучение', $filter('localize')("Удалить обучение по курсу ") + " '" + item.course.name + "'?", deleteTraining);    
    };

    
    $scope.training.changeStatusAutoMailing = function(type){
        var isAutoMailing = 0;
        switch(type){
            case 'teacher':{
                isAutoMailing = $scope.training.selectedItems[0].isTeacherAutoMailing;
                break;
            }
            case 'students':{
                isAutoMailing = $scope.training.selectedItems[0].isStudentsAutoMailing;
                break;
            }
            case 'feedback':{
                isAutoMailing = $scope.training.selectedItems[0].isFeedBackAutoMailing;
                break;
            }
            case 'curator':{
                isAutoMailing = $scope.training.selectedItems[0].isCuratorAutoMailing;
                break;
            }
        }

        TrainingSrvc.changeStatusAutoMailing({id: $scope.training.selectedItems[0].id, isAutoMailing: isAutoMailing, type: type}).then(
            function(data){
                $scope.training.alert = UtilsSrvc.getAlert('Готово!', 'Изменения сохранены.', 'success', true);
            },
            function(response){
                $scope.training.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
    $scope.training.init();
});


// ===============================================================================================================================
// File: 5. controllers/AllTrainingFeedBacksCtrl.js
// ===============================================================================================================================
'use strict';
// 

/*===========================================================================================
All feedbacks of training
===========================================================================================*/

controllersModule.controller('AllTrainingFeedBacksCtrl', function($scope, $filter, $routeParams, UtilsSrvc, TrainingSrvc){    
    $scope.menu.hide=true;
    $scope.menu.brandCaption = $filter('localize')('Система учёта курсов');
    $scope.menu.appTitle = $scope.menu.brandCaption;
    
    $scope.training = {};

    $scope.fbTable = {};
    $scope.grid = {};
    
    $scope.init = function(){
        $scope.fbTable.columns = [
						  {name: 'Автор', sqlName: 'Author', isSorted: false, isSortable: true, isDown: true, isSearched: true, isSearchable: false, captionStyle: {textAlign: 'center', width: '200px'}},
                          {name: 'Ср. оценка курса', sqlName: 'AvgCourseRating', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center'}},
                          {name: 'Ср. оценка преподавателя', sqlName: 'AvgInstructorRating', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true, captionStyle: {textAlign: 'center'}},
                          {name: 'Дата создания', sqlName: 'CreatedTS', isSorted: true, isSortable: true, isDown: false, isSearched: false, isSearchable: false, filter: 'date', captionStyle: {width: '180px'}}];
  
        $scope.fbTable.properties = [{name: 'author'},
                                     {name: 'avgCourseRating', cellStyle: {textAlign: 'center'}}, 
                                     {name: 'avgInstructorRating', cellStyle: {textAlign: 'center'}},
                                     {name: 'createdTS', filter: 'date', filterParam: $filter('localize')('d MMMM y, HH:mm:ss')}];

		$scope.fbTable.pageSize = 10;
		$scope.fbTable.pageCurr = 1;
        $scope.fbTable.itemsTotal = 0;
        $scope.fbTable.selectedItems = [];
        $scope.fbTable.multiSelectMode = false;
        $scope.fbTable.forciblyUpdate = 0;
    };


    // Загрузить обучение по ИД
    $scope.loadTrainingById = function(id){
        TrainingSrvc.getForUser(id).then(
            function(data){
                $scope.training = data;
            },
            function(response){
                $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Load feedbacks
    $scope.fbTable.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        TrainingSrvc.getFeedBacksForGridByAccessCode(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $routeParams.id, $routeParams.code).then(
            function(data){
                $scope.fbTable.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.fbTable.itemsTotal = data.itemsTotal;
                $scope.fbTable.items = data.items;
               
                if ($scope.fbTable.selectedItems && $scope.fbTable.items && $scope.fbTable.selectedItems.length == 0 && $scope.fbTable.items.length != 0){
                    $scope.fbTable.selectedItems[0] = $scope.fbTable.items[0];
                    $scope.fbTable.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    $scope.fbTable.refresh = function(){
        $scope.fbTable.forciblyUpdate++;
    };

    $scope.init();
    $scope.loadTrainingById($routeParams.id);
     $scope.fbTable.refresh();
});


// ===============================================================================================================================
// File: 6. controllers/CreateTrainingCtrl.js
// ===============================================================================================================================
'use strict';
//ddd

/*===========================================================================================
Создание обучения без подгрупп
===========================================================================================*/

controllersModule.controller('CreateTrainingCtrl', function($scope, $routeParams, $location, UtilsSrvc, TrainingSrvc){
    $scope.training = {data:{timeStart:'9:00', timeFinish: '12:00', orders: []}};
    if ($scope.menu.lang.id == 'ru-RU'){
        $scope.training.data.timeStartType = '24';
        $scope.training.data.timeFinishType = '24';
        $scope.training.data.timePattern = '([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]';
    }
    else{
        $scope.training.data.timeStartType = 'a.m.';
        $scope.training.data.timeFinishType = 'p.m.';
        $scope.training.data.timePattern = '([0-9]|0[0-9]|1[0-2]|2[0-2]):[0-5][0-9]';
    }
    
    // Загрузить обучение по ИД и обновить/склонировать поля
    $scope.training.loadData = function(id){
        TrainingSrvc.get(id).then(
            function(data){
                $scope.training.data.isLoaded = true;
                $scope.training.data.teacher = data.teacher;
                $scope.training.data.course = data.course;
                $scope.training.data.city = data.city;
                $scope.training.data.room = data.room;
                $scope.training.data.address = data.address;
                $scope.training.data.street = data.street;
                $scope.training.data.curator = data.curator;
                $scope.training.data.timeStart = data.timeStart;
                $scope.training.data.timeFinish = data.timeFinish;
                $scope.training.data.timeStartType = data.timeStartType;
                $scope.training.data.timeFinishType = data.timeFinishType;
                $scope.training.data.isPublic = data.isPublic == 1;
            },
            function(response){
                $scope.training.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
    
    $scope.training.submit = function(){
        TrainingSrvc.save($scope.training.data).then(
            function(data){
                 $location.path('/training/' + data.id);
            },
            function(response){
                $scope.training.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
    
    
    if ($routeParams.id){
        $scope.training.loadData($routeParams.id);
    }
});


// ===============================================================================================================================
// File: 7. controllers/CreateOrderCtrl.js
// ===============================================================================================================================
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


// ===============================================================================================================================
// File: 8. controllers/OrderNewStudentCtrl.js
// ===============================================================================================================================
'use strict';
//dedddd

/*===========================================================================================
Создание заявки для одного слушателя
===========================================================================================*/

controllersModule.controller('OrderNewStudentCtrl', function($scope, $timeout, $filter, $routeParams, OrderSrvc, TrainingSrvc, RegionSrvc, CompanySrvc, UtilsSrvc){
    $scope.menu.hide = true;
    $scope.ordForm = {order:{mailingOn: true}};
    $scope.questionData = {};
    $scope.cities = [];
 
    /* Инициализация */
    $scope.ordForm.init = function(){
        $scope.ordForm.btnDisabled = false;
        $scope.ordForm.companies = [];
        $scope.ordForm.orderCaption = $filter('localize')("Форма регистрации слушателя");
        $scope.ordForm.trainingCaption = $filter('localize')("Подробнее о курсе");;
        $scope.ordForm.btnClearShow = true;
        $scope.ordForm.order.trainingId = $routeParams.training;
    };

    /* Подгрузить обучение */
    $scope.ordForm.loadTraining = function(){
        TrainingSrvc.getForUser($scope.ordForm.order.trainingId).then(
            function(data){
                $scope.ordForm.order.city = data.city;
                $scope.ordForm.training = data;    
                $scope.ordForm.training.dates = UtilsSrvc.getTwoDate(data.dateStart, data.dateFinish);
                $scope.ordForm.training.urlAddGoogleCalendarEvent = TrainingSrvc.getUrlForCreateGoogleCalendarEvent(
                                        data.course.name + '. '+ data.city.name,
                                        data.dateGoogleCalendar,
                                        data.city.name + ', ' + data.address.title,
                                        {
                                            trainingId: data.id,
                                            courseProgramUrl: 'http://' + data.course.programUrl,
                                            city: data.city.name + ', ' + data.city.parentName + ', ' + data.city.greatParentName,
                                            address: data.address.title + ', '+ data.room,
                                            time: data.timeStart + ' - ' + data.timeFinish,
                                            teacher: data.teacher.lastName + ' ' + data.teacher.firstName + ', ' + data.teacher.email,
                                            curator: data.curator.fullName + ', ' + data.curator.phone + ', ' + data.curator.email,
                                            otherInfo: data.otherInfo   
                                        });

                $scope.menu.brandCaption = $filter('localize')('Форма регистрации на обучение компании InterSystems по курсу "') + data.course.name + '" ';
                $scope.menu.appTitle = $scope.menu.brandCaption;
                 
                callbackYmap = function() {
                    var myMap = new ymaps.Map("map", {
                            center: [data.address.lat, data.address.lng],
                            zoom: 15,
                            controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
                        });

                    var placemark = new ymaps.Placemark([data.address.lat, data.address.lng], {
                            balloonContent: data.city.name + '. ' + data.street + ', '+ data.room
                        }, {
                            preset: 'islands#nightDotIcon',
                            iconColor: '#0095b6'
                        });   
                        
                    myMap.geoObjects.add(placemark);
                };
                
                
                function loadScript(url){
                    var div = document.getElementById('divYmapScript');
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = url;
                    
                    // Fire the loading
                    div.appendChild(script);
                };
                
                loadScript("http://api-maps.yandex.ru/2.1/?lang=" + StcAppSetting.lang + "&onload=callbackYmap");
            },
            function(response){
                $scope.ordForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    
    /* Стереть все */
    $scope.ordForm.clear = function(){
        $scope.ordForm.order = {
            mailingOn: true,
            trainingId: $scope.ordForm.order.trainingId,
            city: $scope.ordForm.training.city
        };
        $scope.ordForm.btnDisabled = false;
    };

    $scope.ordForm.formatCity = function(){
        if ($scope.ordForm.order.mailingOn && !$scope.ordForm.order.city.id){
            $scope.ordForm.order.city = '';
        }
    };

    /* Создать заявку */
    $scope.ordForm.submit = function(){
        OrderSrvc.createOrderNewStudent($scope.ordForm.order).then(
            function(data){
                $scope.ordForm.alert = UtilsSrvc.getAlert('Готово!', 'Ваша заявка принята к рассмотрению. На указанный Вами адрес электронной почты придет письмо-подтверждение.', 'info', true);
                $scope.ordForm.btnDisabled = true;
                $scope.ordForm.btnClearShow = true;
            },
            function(response){
                $scope.ordForm.alert = UtilsSrvc.getAlert('Внимание!', response.data.replace(/ОШИБКА #5001: /g, "").replace(/Error #5001: /g, ""), 'error', true);
            });
    };
    
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
                $scope.alert = UtilsSrvc.getAlert('Ошибка !', response.data, 'error', true);
            }); 
    };

    //================================================================================
    // FEEDBACK
    //================================================================================  
    $scope.openQuestionDialog = function(){
        $scope.questionData = {};
        $('#MSGModal').modal('show');
        $scope.msgModalVisible = true;
    };
    
    $scope.closeQuestionDialog = function(){
        $scope.clearQuestionForm();
        $('#MSGModal').modal('hide');
        $scope.msgModalVisible = false;
    };
    
    $scope.createQuestion = function(){
        TrainingSrvc.createQuestion($scope.ordForm.training.id, $scope.questionData).then(
            function(data){
                $scope.clearQuestionForm();         
                $scope.questionAlertLabel = UtilsSrvc.getAlertLabel('Ваше сообщение принято.', 'success');
            },
            function(response){
                $scope.questionAlertLabel = UtilsSrvc.getAlertLabel('Ошибка - ' + response.data, 'warning');
            });
    };

    $scope.clearQuestionForm = function(){
        $scope.questionData = {};        
        $scope.form_feedback.$setPristine();
    };

    
    
    
    
    $scope.ordForm.init();
    $scope.ordForm.loadTraining();
  });


// ===============================================================================================================================
// File: 9. controllers/AllOrdersCtrl.js
// ===============================================================================================================================
'use strict';
//dddddddcdd
 
/*===========================================================================================
Все заявки
===========================================================================================*/

controllersModule.controller('AllOrdersCtrl', function($scope, $cookieStore, $location, $routeParams, $filter, OrderSrvc, UtilsSrvc, RegionSrvc, CourseTeacherSrvc, TrainingSrvc, CompanySrvc, PersonSrvc){
    $scope.menu.selectMenu('orders');
    if (!$scope.pageStore.orders)
        $scope.pageStore.orders = {grid:{}};

    $scope.order = {};
	if ($scope.menu.readOnlyMode){
		$scope.order.secondRowActionIcon = '';
	}
	else{
		$scope.order.secondRowActionIcon = 'icon-remove';
	}
	
   
    $scope.order.init = function(){
        $scope.order.columns = [
                          {name: 'Курс', sqlName: 'Course->Name->Value', isSorted: false, isSortable: true, isDown: true, isSearched: true,  isSearchable: true},
                          {name: 'Организация', sqlName: 'Company->ShortName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Слушатели', sqlName: 'StudentsNumber', isSorted: false, isSortable: false,isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '60px'}},
                          {name: 'Дата создания', sqlName: 'CreatedTS', isSorted: true, isSortable: true, isDown: false, isSearched: false, isSearchable: false, filter: 'date', captionStyle: {width: '190px'}},
                          {name: 'Статус', sqlName: 'OrderStatus', isSorted: false, isSortable: true, isDown: true,  isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '70px'}}];
        
        $scope.order.properties = [{name:'course.name'}, 
                                   {name:'contact.company.shortName'},
                                   {name:'studentsNumberString', cellStyle: {textAlign: 'center'}, 
                                   	    calculate: function(item){
	                                   	   if (item.status.code == 'Closed'){
	                                   	    	item.studentsNumberString = '---';
	                                   	   }
	                                   	   else{
		                                   	   item.studentsNumberString = item.studentsNumber;
	                                   	   }
	                                    }}, 
                                   {name:'createdTS', filter: 'date', filterParam: $filter('localize')('d MMMM y, HH:mm:ss')}, 
                                   {name:'status.name', cellStyle: {textAlign: 'center'}, 
                                        getCssClass: function(item){
                                            var code = UtilsSrvc.getPropertyValue(item, 'status.code');
                                            
                                            var css = 'label';

                                            if (code == 'New')
                                                css += ' label-important';
                                            if (code == 'Approved')
                                                css += ' label-success';
                                            if (code == 'Closed')
                                                css += ' label-inverse';

                                            return css;
                                        }}];
        $scope.order.status = UtilsSrvc.getPropertyValue($scope.pageStore, 'orders.status', 'All');
        $scope.order.pageSize = UtilsSrvc.getPropertyValue($scope.pageStore, 'orders.grid.pageSize', 10);
        $scope.order.pageCurr = UtilsSrvc.getPropertyValue($scope.pageStore, 'orders.grid.pageCurr', 1);
        $scope.order.itemsTotal = 0;
        $scope.order.selectedItems = [];
        $scope.order.multiSelectMode = false;
        $scope.order.forciblyUpdate = 0;
        $scope.order.actionColumnVisible = true;
    };

    // order
    // Загрузка заявок
    $scope.order.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        OrderSrvc.getAllOrdersForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $scope.order.status).then(
            function(data){
                $scope.order.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.order.itemsTotal = data.itemsTotal;
                $scope.order.items = data.items;

                if ($scope.order.selectedItems && $scope.order.items && $scope.order.selectedItems.length == 0 && $scope.order.items.length != 0){
                    $scope.order.selectedItems[0] = $scope.order.items[0];
                    $scope.order.selectedItems[0].rowClass = 'info';
                }

                $scope.order.contactType='order';
            },
            function(response){
                $scope.order.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    $scope.$watch('order.status', function(){
	    $scope.order.forciblyUpdate++;
        $scope.pageStore.orders.status = $scope.order.status;
    });
 
    $scope.$watch('order.selectedItems[0]', function(){
	    $scope.order.contactType = 'order';
    }, true);

	// Принять заявку
    $scope.order.accept = function(){
        function createCompany(){
            $location.path('/company/order/' + $scope.order.selectedItems[0].id);
        };

        if ($scope.order.selectedItems[0].contact.company.id){
            $scope.order.changeStatus($scope.order.selectedItems[0].id, 'approved');
        }
        else {
            UtilsSrvc.openMessageBox('Принять заявку', 'Организация, указанная в заявке, не существует. Создать ее?', createCompany);
        }
    };
	
	
	// Закрыть заявку
    $scope.order.close = function(){
        function closeOrder(){
            $scope.order.changeStatus($scope.order.selectedItems[0].id, 'closed');
        };

        UtilsSrvc.openMessageBox('Изменение статуса заявки', 'Закрыть заявку?', closeOrder);
    };
	
	// Изменить статус заявки
    $scope.order.changeStatus = function(id, status){
        OrderSrvc.changeOrderStatus(id, status).then(
                function(data){
                    $scope.order.alert = UtilsSrvc.getAlert('Готово!', 'Статус заявки изменен.', 'success', true);
                    $scope.order.forciblyUpdate++;
                },
                function(response){
                    $scope.order.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });  
    };
	
  
    // Удалить заявку
    $scope.order.deleteOrder = function(item){
        function deleteOrder(){
            OrderSrvc.deleteOrder(item.id).then(
                function(data){
                    $scope.order.alert = UtilsSrvc.getAlert('Готово!', 'Заявка удалена.', 'success', true);
                    $scope.order.selectedItems = [];
                    $scope.order.forciblyUpdate++;
                },
                function(response){
                    $scope.order.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });  
        };

        UtilsSrvc.openMessageBox('Удалить заявку', $filter('localize')("Удалить заявку от организации") + " '" + item.contact.company.shortName + "'?", deleteOrder);    
    };

    // Обновить или заменить контакт компании  
    $scope.order.changeCompanyContact = function(isReplace){
        var msgSuccess = 'Контакт заменен.';
        var msgWindow = ['Заменить контакт', 'Заменить контакт организации контактом из заявки? Старый контакт организации не будет удален.'];

        if (!isReplace){
            msgSuccess = 'Контакт обновлен.';
            msgWindow = ['Обновить контакт', 'Заменить данные контакта организации данными контакта из заявки?'];
        }
        
        function resolve(){
            CompanySrvc.changeContact({contact: $scope.order.selectedItems[0].contact, 
            								 companyId: $scope.order.selectedItems[0].contact.company.id, 
            								 isReplace: isReplace, 
            								 orderId: $scope.order.selectedItems[0].id}).then(
                function(data){
                    $scope.order.alert = UtilsSrvc.getAlert('Готово!', msgSuccess, 'success', true);
                    $scope.order.forciblyUpdate++;
                },
                function(response){
                    $scope.order.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        };

        UtilsSrvc.openMessageBox(msgWindow[0], msgWindow[1], resolve);
    };

    $scope.order.openChangeCompanyDialog = function(){
        if (!$scope.order.companies || $scope.order.companies.length==0){
            CompanySrvc.getAll().then(
                function(data){
                    $scope.order.companies = data;
                },
                function(response){
                    $scope.order.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        }
		
        $('#ChangeCompanyModal').modal('show');
        $scope.order.modalChangeCompanyVisible = true;
    };
    
   

    $scope.order.changeCompany = function(){
        $scope.order.modalChangeCompanyVisible = false;
        if (!$scope.order.newOrderCompany || !$scope.order.newOrderCompany.id){
            console.log($scope.order.newOrderCompany);
            return;
        }
        
        OrderSrvc.changeOrderCompany($scope.order.selectedItems[0].id, $scope.order.newOrderCompany.id).then(
                function(data){
                    $scope.order.alert = UtilsSrvc.getAlert('Готово!', 'Произошла смена организации в заявке.', 'success', true);
                    //$scope.order.selectedItems = [];
                    $scope.order.forciblyUpdate++;
                },
                function(response){
                    $scope.order.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
    };

    $scope.order.init();
    
    if (!$scope.menu.admin){
	    $scope.menu.brandCaption = 'Система учёта курсов';
    	$scope.menu.appTitle = 'Система учёта курсов';
	    console.log('training $scope.menu.login();')
    	$scope.menu.login(); 
    };
  });


// ===============================================================================================================================
// File: 10. controllers/AllCompaniesCtrl.js
// ===============================================================================================================================
'use strict';
//dd

/*===========================================================================================
Все компании
===========================================================================================*/
controllersModule.controller('AllCompaniesCtrl', function($scope, $filter, $location, $routeParams, UtilsSrvc, CompanySrvc){
    $scope.menu.selectMenu('companies');
    
    if (!$scope.pageStore.companies)
        $scope.pageStore.companies = {grid:{}};

    $scope.company = {};

    $scope.company.init = function(){
        $scope.company.columns = [
                          {name: 'Название', sqlName: 'ShortName->Value', isSorted: true,  isSortable: true,  isDown: true, isSearched: true, isSearchable: true},
                          {name: 'Сотрудники', captionStyle: {textAlign: 'center', width: '80px'}},
                          {name: 'Юридический адрес', sqlName: 'LegalAddress->Value', isSorted: false, isSortable: true,  isDown: true,  isSearched: false, isSearchable: true},
                          {name: 'Статус', sqlName: 'Type->Name->Value', isSorted: false, isSortable: true,  isDown: true,  isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '80px'}}];
        
        $scope.company.properties = [{name: 'shortName'}, 
                                     {name: 'employeesNumber', cellStyle: {textAlign: 'center'}}, 
                                     {name: 'legalAddress'}, 
                                     {name: 'statusName', cellStyle: {textAlign: 'center'},
                                        getCssClass: function(item){
                                                    return 'label ' + (item.status == 0 ? '' : 'label-info');
                                        },
                                        calculate: function(item){
                                                    item.statusName = item.status == 0 ? $filter('localize')('Партнёр') : $filter('localize')('Университет');
                                        }}];
        $scope.company.status = UtilsSrvc.getPropertyValue($scope.pageStore, 'company.status', 'All');
        $scope.company.pageSize = UtilsSrvc.getPropertyValue($scope.pageStore, 'companies.grid.pageSize', 10);
        $scope.company.pageCurr = UtilsSrvc.getPropertyValue($scope.pageStore, 'companies.grid.pageCurr', 1);
        $scope.company.itemsTotal = 0;
        $scope.company.selectedItems = [];
        $scope.company.multiSelectMode = false;
        $scope.company.forciblyUpdate = 0;
    };

    // company
    // Загрузка
    $scope.company.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        CompanySrvc.getAllForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $scope.company.status).then(
            function(data){
                $scope.company.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.company.itemsTotal = data.itemsTotal;
                $scope.company.items = data.items;
                
                if ($scope.company.selectedItems && $scope.company.items && $scope.company.selectedItems.length == 0 && $scope.company.items.length != 0){
                    $scope.company.selectedItems[0] = $scope.company.items[0];
                    $scope.company.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.company.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
       
    // Переход на страницу редактирования компании
    $scope.company.edit = function(item){
         $location.path('/company').search({id: item.id});
    };
    
    $scope.company.add = function(){
         $location.path('/company');
    };

    // Удалить компанию
    $scope.company.remove = function(item){
        function deleteComp(){
            CompanySrvc.remove(item.id).then(
                function(data){
                    $scope.company.alert = UtilsSrvc.getAlert('Готово!', 'Организация удалена.', 'success', true);
                    $scope.company.selectedItems = [];
                    $scope.company.forciblyUpdate++;
                },
                function(response){
                    $scope.company.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });  
        };

        UtilsSrvc.openMessageBox('Удалить организацию', $filter('localize')("Если ссылочная целостность не нарушается, то произвести удаление организации") + " '" + item.shortName + "'?", deleteComp);    
    };

    // При смене статуса подгружать соответствующие записи
    $scope.$watch('company.status', function(){
        $scope.company.forciblyUpdate++;
        $scope.pageStore.companies.status = $scope.company.status;
    });

    $scope.company.init();
});


// ===============================================================================================================================
// File: 11. controllers/CompanyCtrl.js
// ===============================================================================================================================
'use strict';
//dddddddfd

/*===========================================================================================
Компания
===========================================================================================*/

controllersModule.controller('CompanyCtrl', function($scope, $routeParams, $window, $route, $timeout, $location, OrderSrvc, PersonSrvc, CompanySrvc, UtilsSrvc){
    if ($scope.menu.active) $scope.menu.active.css = "menuAfterActive";

    $scope.searchForm = {visible: true, persons: [], person:''};
    $scope.compForm = {form: {}, company: {}, contact: {}, visible: true};
    $scope.compForm.caption = "Создание организации";
   
    $scope.compForm.init = function(){
        if ($routeParams.id){
            $scope.compForm.caption = "Редактирование организации";
            $scope.compForm.loadCompany($routeParams.id);
        }
        else if ($routeParams.order){
            $scope.compForm.caption = "Создание организации из заявки";
            $scope.compForm.loadOrder($routeParams.order);
        }
        else if ($routeParams.ordernewstudent){
            $scope.compForm.caption = "Создание организации из заявки от слушателя";
            $scope.compForm.loadOrderNewStudent($routeParams.ordernewstudent);
        }
    };

    // Поиск персоны
    $scope.searchForm.search = function(startsWith){
        if(!startsWith || startsWith.length == 0){
            $scope.searchForm.persons = [];
            startsWith = '';
        }
        
        if (startsWith.length != 2)
            return;  
        
        PersonSrvc.getBySearchParameters(startsWith).then(
            function(data){
                $scope.searchForm.persons = data;
            },
            function(response){
                $scope.searchForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };
    
    
    // Загрузить новую заявку
    $scope.compForm.loadOrder = function(code){
        OrderSrvc.getOrder(code).then(
            function(data){
                $scope.compForm.company = {contact: {}};
                $scope.compForm.company.shortName = data.contact.company.shortName;
                $scope.compForm.company.site = data.contact.company.site;
           
                $scope.compForm.company.contact = data.contact;
            },
            function(response){
                $scope.compForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Загрузить заявку от слушателя
    $scope.compForm.loadOrderNewStudent = function(id){
        OrderSrvc.getOrderNewStudent(id).then(
            function(data){
                $scope.compForm.company = {contact: {}};
                $scope.compForm.company.shortName = data.company.shortName;
               
                $scope.compForm.company.contact = data;
            },
            function(response){
                $scope.compForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Сохранить
    $scope.compForm.save = function(){
        // Создать компанию из заявки вместе с контактом
        if ($routeParams.order){
            CompanySrvc.saveFromOrder($scope.compForm.company, $routeParams.order).then(
                function(data){
                    $window.history.back();
                },
                function(response){
                    $scope.compForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        }
        else if ($routeParams.ordernewstudent){
            CompanySrvc.saveFromOrderNewStudent($scope.compForm.company, $routeParams.ordernewstudent).then(
                function(data){
                    $window.history.back();
                },
                function(response){
                    $scope.compForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                    
                });
        }
        else if ($routeParams.id){
            CompanySrvc.save($scope.compForm.company).then(
                function(data){
                    $scope.compForm.alert = UtilsSrvc.getAlert('Готово!', 'Изменения сохранены.', 'success', true);
                    $scope.compForm_form.$setPristine();
                },
                function(response){
                    $scope.compForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                    
                });
        }
        else {
            console.log($scope.compForm.company);
            CompanySrvc.save($scope.compForm.company).then(
                function(data){
                    $scope.compForm.alert = UtilsSrvc.getAlert('Готово!', 'Создание завершено.', 'success', true);
                    $location.path('/company/' + data.id);
                },
                function(response){
                    $scope.compForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                    
                });
        }       
    };
    
    // Загрузить компанию
    $scope.compForm.loadCompany = function(id){
        CompanySrvc.get(id).then(
                function(data){
                    data.status = data.status == 1; 
                    data.isUnknownCity = data.isUnknownCity == 1; 
                    $scope.compForm.company = data;
                },
                function(response){
                    $scope.compForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                    
                });
    };


    $scope.compForm.addContact = function(){
        if (!$scope.compForm.company.id){
            UtilsSrvc.openMessageBox("Внимание!", "Сначала создайте организацию.");
            return;
        }
        
        $location.path('/company/' + $scope.compForm.company.id + '/person');
    };
    
    // Редактировать контакт - переход
    $scope.compForm.editContact = function(){
        $location.path('/person/' + $scope.compForm.company.contact.id);
    };

    // Сменить контакт - переход
    $scope.compForm.changeContact = function(){
        CompanySrvc.changeContact({contact: $scope.searchForm.person, companyId: $routeParams.id, isReplace: 1}).then(
            function(data){
                $route.reload();
            },
            function(response){
                $scope.compForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };
    
    $scope.compForm.init();
});


// ===============================================================================================================================
// File: 12. controllers/AllCertificatesCtrl.js
// ===============================================================================================================================
'use strict';
//ddd

/*===========================================================================================
Все сертификаты
===========================================================================================*/

controllersModule.controller('AllCertificatesCtrl', function($scope, $filter, $location, UtilsSrvc, CertificateSrvc){
    $scope.menu.selectMenu('certificates');;

    if (!$scope.pageStore.certificates)
        $scope.pageStore.certificates = {grid:{}};

    $scope.cert = {};

    $scope.cert.init = function(){
        $scope.cert.columns = [
                          {name: 'Курс', sqlName: 'Training->Course->Name->Value', isSorted: false, isSortable: true, isDown: true,  isSearched: true, isSearchable: true},
                          {name: 'Номер', sqlName: 'Number', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true, captionStyle: {textAlign: 'center', width: '80px'}},
                          {name: 'Слушатель', sqlName: 'Student->LastName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Дата создания', sqlName: 'CreatedDate', isSorted: true,  isSortable: true, isDown: false, isSearched: false, isSearchable: false, filter: 'date', captionStyle: {width: '150px'}},
                          {name: 'Статус', sqlName: 'isPrinted', isSorted: false, isSortable: true, isDown: true,  isSearched: false, isSearchable: true, captionStyle: {textAlign: 'center', width: '80px'}}];
        
        $scope.cert.properties = [{name:'training.course.name'}, 
                                  {name:'number', cellStyle: {textAlign: 'center'}},
                                  {name:'student.fullName', 
                                  calculate: function(item){
                                      item.student.fullName = $scope.getFullNameForCurLang(item.student.lastName, item.student.firstName, item.student.middleName);
                                  }}, 
                                  {name:'date', filter: 'date', filterParam: $filter('localize')('d MMMM y')}, 
                                  {name:'status', cellStyle: {textAlign: 'center'},
                                  getCssClass: function(item){
                                                return 'label ' + (item.isPrinted == 0 ? 'label-important' : 'label-success');
                                              }, 
                                  calculate: function(item){
                                                item.status = item.isPrinted == 1 ? $filter('localize')('Распечатан') : $filter('localize')('Не распечатан');
                                  }}];

        $scope.cert.status = UtilsSrvc.getPropertyValue($scope.pageStore, 'certificates.status', 'All');
        $scope.cert.pageSize = UtilsSrvc.getPropertyValue($scope.pageStore, 'certificates.grid.pageSize', 10);
        $scope.cert.pageCurr = UtilsSrvc.getPropertyValue($scope.pageStore, 'certificates.grid.pageCurr', 1);
        $scope.cert.itemsTotal = 0;
        $scope.cert.selectedItems = [];
        $scope.cert.multiSelectMode = false;
        $scope.cert.forciblyUpdate = 0;
        $scope.cert.actionColumnVisible = true;
    };

    // Загрузка сертификатов
    $scope.cert.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        CertificateSrvc.getAllForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $scope.cert.status).then(
            function(data){
                $scope.cert.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.cert.itemsTotal = data.itemsTotal;
                $scope.cert.items = data.items;

                if ($scope.cert.selectedItems && $scope.cert.items && $scope.cert.selectedItems.length == 0 && $scope.cert.items.length != 0){
                    $scope.cert.selectedItems[0] = $scope.cert.items[0];
                    $scope.cert.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.cert.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Сменить статус печати
    $scope.cert.print = function(item){
         CertificateSrvc.print(item.number).then(
            function(data){
                $scope.cert.alert = UtilsSrvc.getAlert('Готово!', 'Статус сертификата изменен.', 'success', true);
                $scope.cert.forciblyUpdate++;
            },
            function(response){
                $scope.cert.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Удалить сертификат
    $scope.cert.remove = function(item){
        function removeCert(){
           CertificateSrvc.remove(item.number).then(
              function(data){
                  $scope.cert.forciblyUpdate++;
                  $scope.cert.alert = UtilsSrvc.getAlert('Готово!', 'Сертификат удалён.', 'success', true);
              },
              function(response){
                  $scope.cert.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
              });
        };

        UtilsSrvc.openMessageBox('Удалить сертификат', $filter('localize')("Удалить сертификат слушателя") + " '" + item.student.lastName + "'?", removeCert); 
    };

    $scope.$watch('cert.status', function(){
        $scope.cert.forciblyUpdate++;
        $scope.pageStore.certificates.status = $scope.cert.status;
    });

	  $scope.cert.init();
});


// ===============================================================================================================================
// File: 13. controllers/PersonCtrl.js
// ===============================================================================================================================
'use strict';
//dddddddddddвddd

/*===========================================================================================
Персона: сотрудник
===========================================================================================*/

controllersModule.controller('PersonCtrl', function($scope, $window, $filter, $routeParams, PersonSrvc, CompanySrvc, UtilsSrvc){
    $scope.personForm = {};
    $scope.personForm.person = {company:{exist:{}}};
                
    $scope.searchForm = {};
    $scope.searchForm.visible = false;
 
    $scope.personForm.init = function(){
        if ($routeParams.id){
            $scope.personForm.caption = "Редактирование сотрудника";
            $scope.personForm.actionName = "Сохранить";
            $scope.personForm.loadData($routeParams.id);
        }
        else{
            $scope.personForm.caption = "Добавление сотрудника";
            $scope.personForm.actionName = "Добавить";
        }

        $scope.personForm.submit = $scope.personForm.save;
    };


     // Обновить данные персоны
    $scope.personForm.save = function(){
        PersonSrvc.save($scope.personForm.person).then(
            function(data){
                if (data.id){
                    $scope.personForm.alert = UtilsSrvc.getAlert('Готово!', 'Изменения сохранены.', 'success', true);
                }
                else{
                    $scope.personForm.alert = UtilsSrvc.getAlert('Готово!', 'Сотрудник добавлен.', 'success', true);   
                }
            },
            function(response){
                $scope.personForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Загрузить персону
    $scope.personForm.loadData = function(id){
        PersonSrvc.getById(id).then(
            function(data){
                $scope.personForm.person = data;
                $scope.personForm.person.company = {exist: {id: data.company.id}};
            },
            function(response){
                $scope.personForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Компании для комбобокаса
    $scope.personForm.loadCompanies = function(){
        CompanySrvc.getAll().then(
            function(data){
                $scope.personForm.companies = data;
            },
            function(response){
                $scope.personForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Вурнуться назад
    $scope.personForm.back = function(){
        $window.history.back(); 
    };

    $scope.personForm.loadCompanies();    
    $scope.personForm.init();     
});


// ===============================================================================================================================
// File: 14. controllers/PersonTeacherCtrl.js
// ===============================================================================================================================
'use strict';
//dddddddddddвddddввdв

/*===========================================================================================
Персона: преподаватель
===========================================================================================*/

controllersModule.controller('PersonTeacherCtrl', function($scope, $window, $filter, $routeParams, PersonSrvc, CompanySrvc, CourseTeacherSrvc, UtilsSrvc){
    $scope.personForm = {};
    $scope.personForm.person = {company:{exist:{}}};
                
    $scope.searchForm = {persons: []};
 
    $scope.personForm.init = function(){
        if ($routeParams.teacherId){
            $scope.personForm.caption = "Редактирование преподавателя";
            $scope.personForm.actionName = "Сохранить";
            $scope.personForm.loadData($routeParams.teacherId);
            $scope.personForm.submit = $scope.personForm.save;
            $scope.searchForm.visible = false;
        }
        else{
            $scope.personForm.caption = "Добавление преподавателя";
            $scope.personForm.actionName = "Добавить";
            $scope.personForm.submit = $scope.personForm.addTeacher;
            $scope.searchForm.visible = true;
        }
    };


    // Поиск персоны
    $scope.searchForm.search = function(startsWith){
        if (!startsWith) 
        	startsWith = '';
        
        if(startsWith.length == 0){
            $scope.searchForm.persons = [];
        }
        
        if (startsWith.length != 2)
            return;  
            
        PersonSrvc.getFreeCourseTeachers($routeParams.courseId, startsWith).then(
            function(data){
                $scope.searchForm.persons = data;
            },
            function(response){
                $scope.searchForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };


    // При выборе из найденного подгрузить 
    $scope.$watch('searchForm.person', function(){
        if ($scope.searchForm.person && $scope.searchForm.person.id){
            $scope.personForm.loadData($scope.searchForm.person.id);
            $scope.personForm.disabled = true;
            $scope.personForm.showClear = true;
        }
    }, true);


     // Обновить данные персоны
    $scope.personForm.save = function(){
        PersonSrvc.save($scope.personForm.person).then(
            function(data){
                $scope.personForm.alert = UtilsSrvc.getAlert('Готово!', 'Изменения сохранены.', 'success', true);
            },
            function(response){
                $scope.personForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Добавить человека в курс
    $scope.personForm.addTeacher = function(){
        CourseTeacherSrvc.addTeacher($routeParams.courseId, $scope.personForm.person).then(
            function(data){
                $scope.personForm.alert = UtilsSrvc.getAlert('Готово!', 'Преподаватель добавлен в курс.', 'success', true);
            },
            function(response){
                $scope.personForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Очистить найденную персону, чтобы можно было добавить
    $scope.personForm.clear = function(){
        $scope.personForm.disabled = false;
        $scope.searchForm.person = '';
        $scope.personForm.showClear = false;
    };

    // Загрузить персону
    $scope.personForm.loadData = function(id){
        PersonSrvc.getById(id).then(
            function(data){
                $scope.personForm.person = data;
                $scope.personForm.person.company = {exist: {id: data.company.id}};
            },
            function(response){
                $scope.personForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Компании для комбобокаса
    $scope.personForm.loadCompanies = function(){
        CompanySrvc.getAll().then(
            function(data){
                $scope.personForm.companies = data;
            },
            function(response){
                $scope.personForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };
    
    // Вурнуться назад
    $scope.personForm.back = function(){
        $window.history.back(); 
    };

    $scope.personForm.loadCompanies();    
    $scope.personForm.init();   
});


// ===============================================================================================================================
// File: 15. controllers/PersonStudentCtrl.js
// ===============================================================================================================================
'use strict';
//dddddddddddвddddввdвd

/*===========================================================================================
Персона: слушатель
===========================================================================================*/

controllersModule.controller('PersonStudentCtrl', function($scope, $window, $filter, $routeParams, PersonSrvc, CompanySrvc, TrainingSrvc, UtilsSrvc){
    $scope.personForm = {};
    $scope.personForm.person = {company:{exist:{}}};              
    $scope.searchForm = {};
    $scope.searchForm.persons = [];
 
    $scope.personForm.init = function(){
        if ($routeParams.studentId){
            $scope.personForm.caption = "Редактирование слушателя";
            $scope.personForm.actionName = "Сохранить";
            $scope.personForm.loadData($routeParams.studentId);
            $scope.personForm.submit = $scope.personForm.save;
            $scope.searchForm.visible = false;
        }
        else{
            $scope.personForm.caption = "Добавление слушателя";
            $scope.personForm.actionName = "Добавить";
            $scope.personForm.submit = $scope.personForm.addStudent;
            $scope.personForm.loadSubGroup($routeParams.subgroupId);
            $scope.searchForm.visible = true;
        }
    };

    // Поиск персоны
    $scope.searchForm.search = function(startsWith){
        if(!startsWith || startsWith.length == 0){
            $scope.searchForm.persons = [];
            startsWith = '';
        }
        
        if (startsWith.length != 2)
            return;  
        
        PersonSrvc.getFreeTrainingStudents($routeParams.trainingId, startsWith).then(
            function(data){
                $scope.searchForm.persons = data;
            },
            function(response){
                $scope.searchForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };


    // При выборе из найденного подгрузить 
    $scope.$watch('searchForm.person', function(){
        if ($scope.searchForm.person && $scope.searchForm.person.id){
            $scope.personForm.loadData($scope.searchForm.person.id);
            $scope.personForm.disabled = true;
            $scope.personForm.showClear = true;
        }
    }, true);


     // Обновить данные персоны
    $scope.personForm.save = function(){
        PersonSrvc.save($scope.personForm.person).then(
            function(data){
                $scope.personForm.alert = UtilsSrvc.getAlert('Готово!', 'Изменения сохранены.', 'success', true);
            },
            function(response){
                $scope.personForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Добавить человека в курс
    $scope.personForm.addStudent = function(){
        TrainingSrvc.addStudent($routeParams.trainingId, $routeParams.subgroupId, $scope.personForm.person).then(
            function(data){
                $scope.personForm.alert = UtilsSrvc.getAlert('Готово!', 'Слушатель добавлен в подгруппу.', 'success', true);
                if (!$scope.personForm.person.id){
               		$scope.personForm.person = {company: {exist:{id: $routeParams.subgroupId}}};
                }
            },
            function(response){
                $scope.personForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Очистить найденную персону, чтобы можно было добавить
    $scope.personForm.clear = function(){
        $scope.personForm.person = {company: {exist:{}}};
        $scope.personForm.disabled = false;
        $scope.searchForm.person = '';
        $scope.personForm.showClear = false;
    };

    // Загрузить персону
    $scope.personForm.loadData = function(id){
        PersonSrvc.getById(id).then(
            function(data){
                $scope.personForm.person = data;
                $scope.personForm.person.company = {exist: {id: data.company.id}};
            },
            function(response){
                $scope.personForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Загрузить подгруппу
    $scope.personForm.loadSubGroup = function(id){
        if (!id)
            return;

        TrainingSrvc.getSubGroupById(id).then(
            function(data){
                $scope.personForm.subGroup = data;
                $scope.personForm.person.company = {exist: {id: data.payer.id}};
            },
            function(response){
                $scope.personForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Компании для комбобокаса
    $scope.personForm.loadCompanies = function(){
        CompanySrvc.getAll().then(
            function(data){
                $scope.personForm.companies = data;
            },
            function(response){
                $scope.personForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Вурнуться назад
    $scope.personForm.back = function(){
        $window.history.back(); 
    };
    
    $scope.personForm.loadCompanies();    
    $scope.personForm.init();   
});


// ===============================================================================================================================
// File: 16. controllers/PersonCompanyContactCtrl.js
// ===============================================================================================================================
'use strict';
//dddddddddddвddd

/*===========================================================================================
Персона: Контакт организации
===========================================================================================*/

controllersModule.controller('PersonCompanyContactCtrl', function($scope, $window, $filter, $routeParams, PersonSrvc, CompanySrvc, UtilsSrvc){
    $scope.personForm = {};
    $scope.personForm.person = {company:{exist:{id: parseInt($routeParams.cmpId)}}};
                
    $scope.searchForm = {persons: []};
    $scope.searchForm.visible = true;
 
    $scope.personForm.init = function(){
        if ($routeParams.id){
            $scope.personForm.caption = "Редактирование контакта организации";
            $scope.personForm.actionName = "Сохранить";
            $scope.personForm.loadData($routeParams.id);
        }
        else{
            $scope.personForm.caption = "Добавление контакта организации";
            $scope.personForm.companyDisabled = true;
            $scope.personForm.actionName = "Добавить";
        }

        $scope.personForm.submit = $scope.personForm.save;
    };


    // Поиск персоны
    $scope.searchForm.search = function(startsWith){
        if(!startsWith || startsWith.length == 0){
            $scope.searchForm.persons = [];
            startsWith = '';
        }
        
        if (startsWith.length != 2)
            return;  
        
        PersonSrvc.getFreeTrainingStudents($routeParams.trainingId, startsWith).then(
            function(data){
                $scope.searchForm.persons = data;
            },
            function(response){
                $scope.searchForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };
    
    // При выборе из найденного подгрузить 
    $scope.$watch('searchForm.person', function(){
        if ($scope.searchForm.person && $scope.searchForm.person.id){
            $scope.personForm.loadData($scope.searchForm.person.id);
            $scope.personForm.disabled = true;
            $scope.personForm.showClear = true;
        }
    }, true);
    
    
     // Обновить данные персоны
    $scope.personForm.save = function(){
        if (!$routeParams.id){
            $scope.personForm.person.companyId = $routeParams.cmpId;
            CompanySrvc.createContact($scope.personForm.person).then(
                function(data){
                    $scope.personForm.alert = UtilsSrvc.getAlert('Готово!', 'Изменения сохранены.', 'success', true);
                    $scope.personForm.back();
                },
                function(response){
                    $scope.personForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        }
        else{
            PersonSrvc.save($scope.personForm.person).then(
                function(data){
                    $scope.personForm.alert = UtilsSrvc.getAlert('Готово!', 'Изменения сохранены.', 'success', true);
                },
                function(response){
                    $scope.personForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });            
        }
    };

    // Загрузить персону
    $scope.personForm.loadData = function(id){
        PersonSrvc.getById(id).then(
            function(data){
                $scope.personForm.person = data;
                $scope.personForm.person.company = {exist: {id: data.company.id}};
            },
            function(response){
                $scope.personForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Компании для комбобокаса
    $scope.personForm.loadCompanies = function(){
        CompanySrvc.getAll().then(
            function(data){
                $scope.personForm.companies = data;
            },
            function(response){
                $scope.personForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Вурнуться назад
    $scope.personForm.back = function(){
        $window.history.back(); 
    };

    $scope.personForm.loadCompanies();    
    $scope.personForm.init();     
});


// ===============================================================================================================================
// File: 17. controllers/AllPersonsCtrl.js
// ===============================================================================================================================
'use strict';
//dd

/*===========================================================================================
Все сотрудники
===========================================================================================*/
controllersModule.controller('AllPersonsCtrl', function($scope, $location, $routeParams, $filter, OrderSrvc, PersonSrvc, CertificateSrvc, UtilsSrvc){
    $scope.menu.selectMenu('persons');
    
    if (!$scope.pageStore.persons)
        $scope.pageStore.persons = {grid:{}};

    $scope.personTable = {items:[]};
    $scope.trainingTable = {items:[]};
    $scope.certificateTable = {items:[]};
    $scope.courseTable = {items:[]};
    $scope.teacherStat = {data: {courses:[]}};
    $scope.companyTable = {items:[]};
    $scope.other = {allEmpty: true};

    // Инициализация всех таблиц
    $scope.personTable.init = function(){
        // CERTIFICATES --------------------------
        $scope.certificateTable.columns = [
                          {name: 'Курс'}, 
                          {name: 'Номер', captionStyle: {textAlign: 'center', width: '80px'}}, 
                          {name: 'Дата создания', captionStyle: {width: '150px'}}, 
                          {name: 'Статус', captionStyle: {textAlign: 'center', width: '80px'}}];
        
        $scope.certificateTable.properties = [
                          {name:'course'}, 
                          {name:'number', cellStyle: {textAlign: 'center'}}, 
                          {name:'createdDate', filter: 'date', filterParam: $filter('localize')('d MMMM y', $scope.menu.lang)}, 
                          {name:'status', cellStyle: {textAlign: 'center'}, 
                          getCssClass: function(item){
                                          return 'label ' + (item.isPrinted == 0 ? 'label-important' : 'label-success');             
                                        }, 
                          calculate: function(item){
                                          item.status = item.isPrinted == 1 ? $filter('localize')('Распечатан') : $filter('localize')('Не распечатан');
                                        }}];
        
        // TRAINING --------------------------
        $scope.trainingTable.columns = [
                          {name: 'Курс'}, 
                          {name: 'Город'}, 
                          {name: 'Дата начала / окончания', captionStyle: {textAlign: 'center', width: '200px'}}, 
                          {name: 'Статус', captionStyle: {textAlign: 'center', width: '90px'}}];
        
        $scope.trainingTable.properties = [
                          {name: 'course'}, 
                          {name: 'city'}, 
                          {name: 'dates', cellStyle: {textAlign: 'center'},
                          calculate: function(item){
                                        item.dates = UtilsSrvc.getTwoDate(item.dateStart, item.dateFinish);
                                      }}, 
                          {name: 'status', cellStyle: {textAlign: 'center'},
                          getCssClass: function(item){
                                            return 'label ' + (item.isCompleted == 0 ? 'label-info' : 'label-success');
                          },
                          calculate: function(item){
                                            item.status = item.isCompleted == 1 ? $filter('localize')('Завершено') : $filter('localize')('Не завершено');
                                        }}];
        
        // COURSES --------------------------
        $scope.courseTable.columns = [
                          {name: 'Название'}, 
                          {name: 'Часы', captionStyle: {textAlign: 'center', width: '50px'}}, 
                          {name: 'Дни', captionStyle: {textAlign: 'center', width: '50px'}}];
        
        $scope.courseTable.properties = [
                          {name:'name'}, 
                          {name:'hours', cellStyle: {textAlign: 'center'}},
                          {name:'days', cellStyle: {textAlign: 'center'}}];
                          
        // TEACHER STATISTICS --------------------------
        $scope.teacherStat.columns = [
                          {name: 'Курс'}, 
                          {name: 'Проведено обучений', captionStyle: {textAlign: 'center'}}, 
                          {name: 'Средний балл по отзывам', captionStyle: {textAlign: 'center'}}];
        
        $scope.teacherStat.properties = [
                          {name:'name'}, 
                          {name:'trainingsCount', cellStyle: {textAlign: 'center'}},
                          {name:'avgRating', cellStyle: {textAlign: 'center'}}];
        
        // COMPANIES --------------------------
        $scope.companyTable.columns = [
                          {name: 'Название'}, 
                          {name: 'Юридический адрес'}];
        
        $scope.companyTable.properties = [
                          {name:'shortName'}, 
                          {name:'legalAddress'}];
        
        // PERSONS --------------------------
        $scope.personTable.columns = [
                          {name: 'Фамилия', sqlName: 'LastName->Value', isSorted: true,  isSortable: true, isDown: true, isSearched: true,  isSearchable: true},
                          {name: 'Имя', sqlName: 'FirstName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Отчество', sqlName: 'MiddleName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Организация', sqlName: 'Company->ShortName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Email', sqlName: 'Email', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Телефон', sqlName: 'Phone', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Skype', sqlName: 'Skype', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true}];
        $scope.personTable.properties = [{name:'lastName'}, {name:'firstName'}, {name:'middleName'}, {name:'company.shortName'}, {name:'email'}, {name:'phone'}, {name:'skype'}];
        $scope.personTable.pageSize = parseInt(UtilsSrvc.getPropertyValue($scope.pageStore, 'persons.grid.pageSize', 10));
        $scope.personTable.pageCurr = parseInt(UtilsSrvc.getPropertyValue($scope.pageStore, 'persons.grid.pageCurr', 1));
        $scope.personTable.itemsTotal = 0;
        $scope.personTable.selectedItems = [];
        $scope.personTable.multiSelectMode = false;
        $scope.personTable.forciblyUpdate = 0;
        $scope.personTable.type = UtilsSrvc.getPropertyValue($scope.pageStore, 'persons.grid.type', 'All');
        
        $scope.personTable.loadItems($scope.personTable.pageCurr, $scope.personTable.pageSize, "LastName->Value", true, "", ""); 
    };

    // Загрузить сотрудников
    $scope.personTable.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        PersonSrvc.getAllForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $scope.personTable.type).then(
            function(data){
                $scope.personTable.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.personTable.itemsTotal = data.itemsTotal;
                $scope.personTable.items = data.items;
                                
                if ($scope.personTable.selectedItems && $scope.personTable.items && $scope.personTable.selectedItems.length == 0 && $scope.personTable.items.length != 0){
                    $scope.personTable.selectedItems[0] = $scope.personTable.items[0];
                    $scope.personTable.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.personTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // При смене тип - фильтра
    $scope.$watch('personTable.type', function(){
        $scope.personTable.forciblyUpdate++;
        $scope.pageStore.persons.grid.type = $scope.personTable.type;
    });
    
    // При выборе сотрудника подгрузить все его связи
    $scope.$watch('personTable.selectedItems[0]', function(){
        if (!$scope.personTable.selectedItems || $scope.personTable.selectedItems.length == 0)
          return;
        
        // Загрузить данные по преподу за всё время
        $scope.teacherStat.loadData($scope.personTable.selectedItems[0].id, null, null);
            
        $scope.other.loads = 0; 
        $scope.other.loadItems($scope.personTable.selectedItems[0].id, 'companyTable', 'getCompanies');
        $scope.other.loadItems($scope.personTable.selectedItems[0].id, 'courseTable', 'getCourses');
        $scope.other.loadItems($scope.personTable.selectedItems[0].id, 'certificateTable', 'getCertificates');
        $scope.other.loadItems($scope.personTable.selectedItems[0].id, 'trainingTable', 'getTrainings');
        
    });

    // Загрузка связи сотрудника
    $scope.other.loadItems = function(id, tableName, funcName){
        $scope[tableName].items = [];
        PersonSrvc[funcName](id).then(
            function(data){
                $scope[tableName].items = data;
                $scope.other.loads++; 
            },
            function(response){
                $scope.personTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                $scope.other.loads++;
            });
    };

    // Определить какая связь есть, ту  вкладку и сделать активной
    $scope.$watch('other.loads', function(){
        if ($scope.other.loads != 4){
            return;
        }
        
        var flag = false;

        if ($scope.teacherStat.data.courses.length > 0 && $scope.teacherStat.active){
            $scope.teacherStat.active = true;
            flag = true;
        }
        else if ($scope.trainingTable.items.length > 0){
            $scope.trainingTable.active = true;
            flag = true;
        }
        else if ($scope.certificateTable.items.length > 0){
            $scope.certificateTable.active = true;
            flag = true;
        }
        else if ($scope.courseTable.items.length > 0){
            $scope.courseTable.active = true;
            flag = true;
        }
        else if ($scope.companyTable.items.length > 0){
            $scope.companyTable.active = true;
            flag = true;
        }

        $scope.other.allEmpty = !flag;

        $scope.other.loads = null;
    }, true);

    // Добавить сотрудника
    $scope.personTable.add = function(){
        $location.path('/person');
    };

    // Ред. сотрудника
    $scope.personTable.edit = function(item){
        $location.path('/person/' + item.id);
    };

    // Удалить сотрудника
    $scope.personTable.remove = function(item){
        function del(){
            PersonSrvc.deleteById($scope.personTable.selectedItems[0].id).then(
                function(data){
                    $scope.personTable.alert = UtilsSrvc.getAlert('Готово!', 'Сотрудник удален.', 'success', true);
                    $scope.personTable.forciblyUpdate++;
                },
                function(response){
                    $scope.personTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        }

        UtilsSrvc.openMessageBox($filter('localize')('Удалить сотрудника') + " '" + item.lastName + "'", "Удалить сотрудника из базы данных?", del);
    };


    // Открыть обучение, в котором есть сотрудник
    $scope.trainingTable.open = function(item){
        $location.path('/training/' + item.id);
    };
    
    // Открыть компанию, контактом которой является сотрудник
    $scope.companyTable.edit = function(item){
        $location.path('/company/' + item.id);
    };
    
    // Открыть курс, который преподает
    $scope.courseTable.edit = function(item){
        $location.path('/course/' + item.id);
    };

    // Изменить статус сертификата сотрудника
    $scope.certificateTable.print = function(item){
        CertificateSrvc.print(item.number).then(
            function(data){
                $scope.other.loadItems($scope.personTable.selectedItems[0].id, 'certificateTable', 'getCertificates');
                $scope.other.loads--;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };    

    // Обновить данные статистики препода
    $scope.teacherStat.refreshData = function(){
        if ($scope.personTable.selectedItems.length == 0)
            return;
            
        var dateFrom = UtilsSrvc.getValidDate($scope.teacherStat.data.dateFrom);
        var dateTo = UtilsSrvc.getValidDate($scope.teacherStat.data.dateTo);
        $scope.teacherStat.loadData($scope.personTable.selectedItems[0].id, dateFrom, dateTo);
    };
    
    // Загрузить данные по преподу
    $scope.teacherStat.loadData = function(teacherId, dateFrom, dateTo){
        // Load teacher statisticst if exists
        
        PersonSrvc.getTeacherStatistics(teacherId, dateFrom, dateTo).then(
            function(data){
                $scope.teacherStat.data = data; 
            },
            function(response){
                $scope.teacherStat.data = {courses: []};
                $scope.personTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
    
    $scope.personTable.init();
});


// ===============================================================================================================================
// File: 18. controllers/AllCoursesCtrl.js    
// ===============================================================================================================================
'use strict';
//вdddddddddsd

/*===========================================================================================
Все курсы + преподаватели курсов
===========================================================================================*/

controllersModule.controller('AllCoursesCtrl', function($scope, $location, $window, $filter, CourseTeacherSrvc, PersonSrvc, UtilsSrvc){
    $scope.menu.selectMenu('courses');

    if (!$scope.pageStore.courses)
        $scope.pageStore.courses = {grid:{}};

    $scope.courseTable = {};
    $scope.teacherTable = {};

    $scope.courseTable.init = function(){
        $scope.courseTable.columns = [
                          {name: 'Курс', sqlName: 'Name->Value', isSorted: true, isSortable: true, isDown: true, isSearched: true, isSearchable: true},
                          {name: 'Часы', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '50px'}},
                          {name: 'Дни', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '50px'}},
                          {name: 'К. сложности', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '100px'}},
                          {name: 'Программа курса', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '150px'}},
                          {name: 'Стоимость', sqlName: 'Price', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '80px'}},
                          {name: 'Валюта', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center'}}];
        
        $scope.courseTable.status = UtilsSrvc.getPropertyValue($scope.pageStore, 'courses.status', 1);
        $scope.courseTable.properties = [{name:'name'}, 
                                         {name:'hours', cellStyle: {textAlign: 'center'}}, 
                                         {name:'days', cellStyle: {textAlign: 'center'}}, 
                                         {name:'difCoef', cellStyle: {textAlign: 'center'}}, 
                                         {name:'programUrlShort', cellSelectable: true, cellStyle: {textAlign: 'center'},
                                         calculate: function(item){
                                                        item.programUrlShort = $filter('localize')('Просмотр');
                                                    },
                                         getCssClass: function(item){ 
                                                    return 'cellLink';
                                                },  
                                         onClickCell: function(item){
                                                    $window.open('http://' + item.programUrl, '_blank');
                                                }},
                                         {name:'priceStr', cellStyle: {textAlign: 'center'},
                                         calculate: function(item){
                                            item.priceStr = $filter('number')(item.price);
                                         }},
                                         {name:'currency.name', cellStyle: {textAlign: 'center'}}];
                                                                             
        $scope.courseTable.pageSize = UtilsSrvc.getPropertyValue($scope.pageStore, 'courses.grid.pageSize', 10);
        $scope.courseTable.pageCurr = UtilsSrvc.getPropertyValue($scope.pageStore, 'courses.grid.pageCurr', 1);
        $scope.courseTable.itemsTotal = 0;
        $scope.courseTable.selectedItems = [];
        $scope.courseTable.multiSelectMode = false;
        $scope.courseTable.forciblyUpdate = 0;
    };

    // Загрузить все курсы
    $scope.courseTable.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        CourseTeacherSrvc.getAllForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $scope.courseTable.status).then(
            function(data){
                $scope.courseTable.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.courseTable.itemsTotal = data.itemsTotal;
                $scope.courseTable.items = data.items;

                if ($scope.courseTable.selectedItems && $scope.courseTable.items && $scope.courseTable.selectedItems.length == 0 && $scope.courseTable.items.length != 0){
                    $scope.courseTable.selectedItems[0] = $scope.courseTable.items[0];
                    $scope.courseTable.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.courseTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    $scope.courseTable.onSelectCell = function(item, property){
        console.log(item);
        if (!item) return;

        property.onClickCell(item);
    };
    
    // При смене статуса курса - обновить таблицу и поменять иконки
    $scope.$watch('courseTable.status', function(){
        $scope.courseTable.forciblyUpdate++;
        $scope.pageStore.courses.status = $scope.courseTable.status;

        if ($scope.courseTable.status == 1){
            $scope.courseTable.isInUseActionIcon = 'icon-remove';
            $scope.courseTable.isInUseActionTitle = 'Исключить курс';
        }
        else{
            $scope.courseTable.isInUseActionIcon = 'icon-reply';
            $scope.courseTable.isInUseActionTitle = 'Вернуть курс';   
        }
    });

    // Изменить статус курса
    $scope.courseTable.isInUseActionMethod = function(item){
        function changeIsInUse(){
            CourseTeacherSrvc.changeStatus(item.id).then(
                function(data){
                    $scope.courseTable.alert = UtilsSrvc.getAlert('Готово!', 'Изменен статус курса.', 'success', true);
                    $scope.courseTable.forciblyUpdate++;
                },
                function(response){
                    $scope.courseTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        }

        var title = '';
        var msg = '';

        if ($scope.courseTable.status == 1){
            title = $filter('localize')('Исключить курс') + " '" + item.name + "'";
            msg = "Курс будет перенесен в список 'Не используются'.";
        }
        else{
            title = $filter('localize')('Вернуть курс') + " '" + item.name + "'";
            msg = "Курс будет перенесен в список 'Используются'.";
        }

        UtilsSrvc.openMessageBox(title, msg, changeIsInUse);
    };

    // Добавить курс - переход на страницу
    $scope.courseTable.add = function(){
        $location.path('/course');
    };

    // Удалить курс - переход на страницу
    $scope.courseTable.edit = function(item){
        $location.path('/course/' + item.id);
    };

    // При выборе курса - подгружать преподавателей, если надо.
    $scope.$watch('courseTable.selectedItems', function(){
        if (!$scope.courseTable.selectedItems || $scope.courseTable.selectedItems.length == 0 || $scope.courseTable.prevSelItemId == $scope.courseTable.selectedItems[0].id){
            return;
        }

        $scope.courseTable.prevSelItemId = $scope.courseTable.selectedItems[0].id;
        $scope.teacherTable.loadItems();
    }, true);

    // Инициализация таблицы с преподавателями курса
    $scope.teacherTable.init = function(){
        $scope.teacherTable.columns = [
                          {name: 'Фамилия'},
                          {name: 'Имя'},
                          {name: 'Отчество'},
                          {name: 'Организация'},
                          {name: 'Email'},
                          {name: 'Телефон'},
                          {name: 'Skype'}];
        
        $scope.teacherTable.properties = [{name:'lastName'}, {name:'firstName'}, {name:'middleName'}, {name:'company'}, {name:'email'}, {name:'phone'}, {name:'skype'}];
        $scope.teacherTable.pageSize = 100;
        $scope.teacherTable.pageCurr = 1;
        $scope.teacherTable.itemsTotal = 0;
        $scope.teacherTable.selectedItems = [];
        $scope.teacherTable.multiSelectMode = false;
    };
    
    // Загрузить преподавателей курса
    $scope.teacherTable.loadItems = function(){
        CourseTeacherSrvc.getTeachers($scope.courseTable.selectedItems[0].id).then(
            function(data){
                $scope.teacherTable.items = data;
            },
            function(response){
                $scope.teacherTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });    
    };

    // Удалить связь курса с преподавателем
    $scope.teacherTable.remove = function(item){
        function delCourseTeacher(){
            CourseTeacherSrvc.removeTeacher($scope.courseTable.selectedItems[0].id, item.id).then(
                function(data){
                    $scope.teacherTable.alert = UtilsSrvc.getAlert('Успех!', 'Преподаватель удален.', 'success', true);
                    $scope.teacherTable.loadItems();
                },
                function(response){
                    $scope.teacherTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        }

        UtilsSrvc.openMessageBox($filter('localize')('Удаление преподавателя') + " '" + item.lastName + "'", "Удалить преподавателя из списка?", delCourseTeacher);
    };

    // Добавить преподавателя в курс
    $scope.teacherTable.add = function(){
        $location.path('/course/' + $scope.courseTable.selectedItems[0].id + '/teacher');
    };

    // Редактировать преподавателя
    $scope.teacherTable.edit = function(item){
        $location.path('/course/' + $scope.courseTable.selectedItems[0].id + '/teacher/' + item.id);
    };
    
    $scope.courseTable.init();
    $scope.teacherTable.init();
});



// ===============================================================================================================================
// File: 19. controllers/CourseCtrl.js
// ===============================================================================================================================
'use strict';
//dddddfd

/*===========================================================================================
Курс, создание и изменение
===========================================================================================*/

controllersModule.controller('CourseCtrl', function($scope, $routeParams, $window, CourseTeacherSrvc, TrainingSrvc, UtilsSrvc){
    if ($scope.menu.active) $scope.menu.active.css = "menuAfterActive";
    $scope.courseForm = {};
    
    $scope.courseForm.init = function(){
        $scope.courseForm.loadCurrencies();

        if (!isNaN(parseInt($routeParams.id))){
            $scope.courseForm.caption = 'Редактирование курса';
            $scope.courseForm.actionName = 'Сохранить';
            $scope.courseForm.loadData();    
        }
        else{
            $scope.courseForm.caption = 'Добавление курса';
            $scope.courseForm.actionName = 'Добавить';
        }
    };

    // Загрузить курс
    $scope.courseForm.loadData = function(){
        CourseTeacherSrvc.get($routeParams.id).then(
            function(data){
                $scope.courseForm.course = data;
                $scope.courseForm.course.isPublic = data.isPublic == 1;
            },
            function(response){
                 $scope.courseForm.alert = UtilsSrvc.getAlert('Ошибка !', response.data, 'error', true);
            }); 
    };

    // Сохранить / создать курс
    $scope.courseForm.submit = function(){
        CourseTeacherSrvc.save($scope.courseForm.course).then(
            function(data){
                if (!$scope.courseForm.course.id){
                    $scope.courseForm.alert = UtilsSrvc.getAlert('Готово!', 'Курс создан.', 'success', true);
                    $scope.courseForm.course = {isPublic: true};
                }
                else{
                    $scope.courseForm.alert = UtilsSrvc.getAlert('Готово!', 'Изменения сохранены.', 'success', true);
                }
                
                $scope.cForm.$setPristine();
            },
            function(response){
                $scope.courseForm.alert = UtilsSrvc.getAlert('Ошибка!', response.data, 'error', true);
            }); 
    };

    // Отмена - возврат на страницу курсов
    $scope.courseForm.cancel = function(){
        $window.history.back();
    };


    // Загрузить валюты
    $scope.courseForm.loadCurrencies = function(){
        TrainingSrvc.getCurrencies().then(
            function(data){
                $scope.courseForm.currencies = data;
            },
            function(response){
                $scope.courseForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
    
    $scope.courseForm.init();
});
    


// ===============================================================================================================================
// File: 20. controllers/TrainingStudentsCtrl.js
// ===============================================================================================================================
'use strict';
//ddddddddddde

/*===========================================================================================

===========================================================================================*/

controllersModule.controller('TrainingStudentsCtrl', function($scope, $location, $filter, $routeParams, UtilsSrvc, ReportSrvc, TrainingSrvc){
    $scope.menu.hide=true;
    $scope.menu.brandCaption = $filter('localize')('Система учёта курсов');
    $scope.menu.appTitle = $scope.menu.brandCaption;
    $scope.page = {training:{}, studTable:{}, newstudTable: {}};
    
    if (!$scope.pageStore.trstudents){
        $scope.pageStore.trstudents = {grid:{}};
        $scope.pageStore.trorders = {grid:{}};
    }
    
    $scope.page.init = function(){
        $scope.page.newstudTable.columns = [
                          {name: 'Фамилия', sqlName: 'LastName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: true, isSearchable: true},
                          {name: 'Имя', sqlName: 'FirstName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Отчество', sqlName: 'MiddleName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Организация', sqlName: 'Company->ShortName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Email', sqlName: 'Email', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Телефон', sqlName: 'Phone', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Skype', sqlName: 'Skype', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Дата создания', sqlName: 'CreatedTS', isSorted: true, isSortable: true, isDown: false, isSearched: false, isSearchable: false, filter: 'date'}];

        $scope.page.newstudTable.properties = [{name:'lastName'}, 
                                     {name:'firstName'},
                                     {name:'middleName'}, 
                                     {name:'company.shortName'},
                                     {name:'email'},
                                     {name:'phone'},
                                     {name:'skype'},
                                     {name:'createdTS', filter: 'date', filterParam: $filter('localize')('d MMMM y, HH:mm:ss')}];

        $scope.page.newstudTable.pageSize = 20;
        $scope.page.newstudTable.pageCurr = 1;
        $scope.page.newstudTable.itemsTotal = 0;
        $scope.page.newstudTable.selectedItems = [];
        $scope.page.newstudTable.multiSelectMode = false;
        $scope.page.newstudTable.forciblyUpdate = 0;
        $scope.page.newstudTable.actionColumnVisible = true;
        
        
        // Students
        $scope.page.studTable.columns = [
                          {name: 'Full name', sqlName: 'Student->FullName', isSorted: false, isSortable: true, isDown: true,  isSearched: true,   isSearchable: true},
                          {name: 'Организация', sqlName: 'Student->Company->ShortName->Value', isSorted: true,  isSortable: true, isDown: true,  isSearched: false,  isSearchable: true},
                          {name: 'Email', sqlName: 'Student->Email', isSorted: false, isSortable: true, isDown: true,  isSearched: false,  isSearchable: true},
                          {name: 'Телефон', sqlName: 'Student->Phone', isSorted: false, isSortable: true, isDown: true,  isSearched: false,  isSearchable: true},
                          {name: 'Skype', sqlName: 'Student->Skype', isSorted: false, isSortable: true, isDown: true,  isSearched: false,  isSearchable: false},
                          {name: 'Посещал курсы', sqlName: '', isSorted: false, isSortable: false, isDown: true,  isSearched: false,  isSearchable: false, captionStyle: {textAlign: 'center', width: '150px'}}];

        $scope.page.studTable.properties = [
            {name:'fullName', 
               calculate: function(item){
                    item.fullName = $scope.getFullNameForCurLang(item.lastName, item.firstName, item.middleName);
               }},
            {name:'company.shortName'}, 
            {name:'email'}, 
            {name:'phone'}, 
            {name:'skype'},
            {name:'attendedStatus',
               cellSelectable: true,
               cellStyle: {textAlign: 'center'},
               getCssClass: function(item){
                    if (item.attendedStatusCode == 'Visited'){
                         return 'icon icon-check';
                    }
                    else if (item.attendedStatusCode == 'NotVisited'){
                         return 'icon icon-check-empty';
                    } 
                    
                    return 'icon icon-question';
               },
               onClickCell: function(item){
                   var newCode = 'Visited';
                   if (item.attendedStatusCode == 'Visited')
                        newCode = 'NotVisited'
                   
                   TrainingSrvc.updateStudentAttendedStatus($routeParams.code, item.id, newCode).then(
                        function(data){
                            //$scope.page.alert = UtilsSrvc.getAlert('Готово!', 'Изменения сохранены.', 'success', true);
                            $scope.page.studTable.forciblyUpdate++;
                        },
                        function(response){
                            $scope.page.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                        });
               }}
        ];
        
        $scope.page.studTable.pageSize = 20;
        $scope.page.studTable.pageCurr = 1;
        $scope.page.studTable.itemsTotal = 0;
        $scope.page.studTable.selectedItems = [];
        $scope.page.studTable.multiSelectMode = false;
        $scope.page.studTable.forciblyUpdate = 0;

        $scope.page.loadTraining();
        $scope.page.studTable.forciblyUpdate++;
        $scope.page.newstudTable.forciblyUpdate++;
    };

    $scope.page.studTable.onSelect = function(item){     
        
    };

    $scope.page.studTable.onSelectCell = function(item, property){
        if (!item) return;

        property.onClickCell(item);
    };
    
    // Загрузить всех слушателей
    $scope.page.studTable.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        TrainingSrvc.getStudentsByAccessCodeForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $routeParams.code).then(
            function(data){
                $scope.page.studTable.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.page.studTable.itemsTotal = data.itemsTotal;
                $scope.page.studTable.items = data.items;

                if ($scope.page.studTable.selectedItems && $scope.page.studTable.items && $scope.page.studTable.selectedItems.length == 0 && $scope.page.studTable.items.length != 0){
                    $scope.page.studTable.selectedItems[0] = $scope.page.studTable.items[0];
                    $scope.page.studTable.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.page.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
    
    // Загрузить все заявки на присоединение к курсу
    $scope.page.newstudTable.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        TrainingSrvc.getOrderStudentsByAccessCodeForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $routeParams.code).then(
            function(data){
                $scope.page.newstudTable.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.page.newstudTable.itemsTotal = data.itemsTotal;
                $scope.page.newstudTable.items = data.items;

                if ($scope.page.newstudTable.selectedItems && $scope.page.newstudTable.items && $scope.page.newstudTable.selectedItems.length == 0 && $scope.page.newstudTable.items.length != 0){
                    $scope.page.newstudTable.selectedItems[0] = $scope.page.newstudTable.items[0];
                    $scope.page.newstudTable.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.page.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    /* Подгрузить обучение */
    $scope.page.loadTraining = function(){
        TrainingSrvc.getForUser($routeParams.id).then(
            function(data){
                $scope.page.training = data;
                $scope.page.training.dates = UtilsSrvc.getTwoDate(data.dateStart, data.dateFinish);
            },
            function(response){
                $scope.ordForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Export all students to file
    $scope.page.studExportToCSV = function(){
        ReportSrvc.students($routeParams.code);
    };
    
    $scope.page.orderExportToCSV = function(){
        ReportSrvc.ordernewstudents($routeParams.code);
    };

    $scope.page.updateStudentStatus = function(item){
        TrainingSrvc.updateStudentAttendedStatus($routeParams.code, item.id).then(
            function(data){
                $scope.page.training = data;
            },
            function(response){
                $scope.ordForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };
    
    $scope.page.init();
});


// ===============================================================================================================================
// File: 21. controllers/FeedBackCtrl.js
// ===============================================================================================================================
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


// ===============================================================================================================================
// File: 22. controllers/DeepSeeCtrl.js
// ===============================================================================================================================
'use strict';
//dddddddddddвddвddffdd

/*===========================================================================================
===========================================================================================*/

controllersModule.controller('DeepSeeCtrl', function($scope, $routeParams, $window){
	$scope.page = {};
	$("#ifChangeLang").attr("src", StcAppSetting.defaultApp + "/Stc.Web.ChangeLang.cls?Lang="+StcAppSetting.lang.substring(0,2));
	
	
	switch($routeParams.type){
		case 'pointsmapgoogle':
			$scope.menu.selectMenu('analyticsMap');
			StcAppSetting.deepSeeCurrentUrl = StcAppSetting.defaultApp + '/deepsee/_DeepSee.UserPortal.DashboardViewer.zen?DASHBOARD=StcDashboards/TrainingPointsMap.dashboard&EMBED=1';
			break;
		case 'pointsmapyandex':
			$scope.menu.selectMenu('analyticsMap');
			StcAppSetting.deepSeeCurrentUrl = StcAppSetting.defaultApp + '/deepsee/_DeepSee.UserPortal.DashboardViewer.zen?DASHBOARD=StcDashboards/TrainingPointsMapYandex.dashboard&EMBED=1';
			break;
		case 'course':
			$scope.menu.selectMenu('analyticsCourse');
			StcAppSetting.deepSeeCurrentUrl = StcAppSetting.defaultApp + '/deepsee/_DeepSee.UserPortal.DashboardViewer.zen?DASHBOARD=StcDashboards/CourseStudents.dashboard&EMBED=1';
			break;
		case 'teacher':
			$scope.menu.selectMenu('analyticsTeacher');
			StcAppSetting.deepSeeCurrentUrl = StcAppSetting.defaultApp + '/deepsee/_DeepSee.UserPortal.DashboardViewer.zen?DASHBOARD=StcDashboards/TeacherStudents.dashboard&EMBED=1';
			break;
		case 'company':
			$scope.menu.selectMenu('analyticsCompany');
			StcAppSetting.deepSeeCurrentUrl = StcAppSetting.defaultApp + '/deepsee/_DeepSee.UserPortal.DashboardViewer.zen?DASHBOARD=StcDashboards/CompanyStudents.dashboard&EMBED=1';
			break;
		case 'order':
			$scope.menu.selectMenu('analyticsOrder');
			StcAppSetting.deepSeeCurrentUrl = StcAppSetting.defaultApp + '/deepsee/_DeepSee.UserPortal.DashboardViewer.zen?DASHBOARD=StcDashboards/OrdersApproved.dashboard&EMBED=1';
			break;
	}
	
	$scope.menu.analytics.css = "active";
	
	// Автообновление ширины панели
	$scope.menu.timeOutIntervalId = $window.setInterval(function(){
        console.log('Autoresize dash');
        try{
        	$window.document.getElementsByName("ifPanel")[0].width = window.document.body.clientWidth-18;
    	}
    	catch(ex){};
    }, 2000);


});


// ===============================================================================================================================
// File: 23. controllers/SettingsCtrl.js
// ===============================================================================================================================
'use strict';
//=    

/*===========================================================================================
SettingsCtrl - all settings for google, mail
===========================================================================================*/

controllersModule.controller('SettingsCtrl', function($scope, $filter, SettingsSrvc, UtilsSrvc){
    $scope.menu.selectMenu('settings');
    $scope.google = 
    {
        settings: {},
        calendar: {}
    }; 
    
    $scope.mail = 
    {
        settings: {},
        operators: {items:[{email:{}}]},
        types: [
                {code: 'reminder', name: $filter('localize')('Слушатели. Напоминание о начале занятий')},
                {code: 'registration', name: $filter('localize')('Слушатель. Подтверждение регистрации')},
                {code: 'feedback', name: $filter('localize')('Слушатели. Доступ к анкете после завершения обучения')},
                {code: 'teacher', name: $filter('localize')('Преподаватель. Доступ к списку слушателей перед началом обучения')},
                {code: 'teacherSetAttendeeStatus', name: $filter('localize')('Преподаватель. Доступ к списку слушателей после завершения обучения, указать посещаемость')},
                {code: 'curator', name: $filter('localize')('Куратор. Доступ к списку слушателей перед началом обучения')},
                {code: 'orders', name: $filter('localize')('Заявки. Ссылка для регистрации')},
                {code: 'orderapply', name: $filter('localize')('Одобрение заявки, отсылка письма контакту организации')},
                {code: 'confirmsubscription', name: $filter('localize')('Активация подписки')},
                {code: 'listOfFeedbacks', name: $filter('localize')('Доступ к отзывам о курсе')}
              ],
        common: {}
     };
    
    
    //================================================================================================================================================================
    // GOOGLE                                                                                                                                                   GOOGLE
    //================================================================================================================================================================
    // Load settings for google tab by type (calendar etc.)
    $scope.google.load = function(type){
        SettingsSrvc.getGoogle(type).then(
                function(data){
                    $scope.google[data.type] = data.data;
                },
                function(response){      
                    $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
    };

    // Save settings for google tab by type (calendar etc.)
    $scope.google.save = function(type, form){
        SettingsSrvc.saveGoogle($scope.google[type], type).then(
                function(data){
                    form.$setPristine();
                    $scope.google[type].alertLabel = UtilsSrvc.getAlertLabel('Сохранение завершено', 'success');
                },
                function(response){      
                    $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
    };

    // Load settings for google tab by type (calendar etc.)
    $scope.google.cancel = function(type, form){
        $scope.google.load(type);
        form.$setPristine();
    };

    // Show help dialog window
    $scope.google.showHelp = function(type){
        var msg = '';

        switch(type){
            case 'calendar':{
              msg = '<strong>Перевод строки:</strong> &lt;br&gt;<br><strong>Обязательные параметры:</strong> %1 - ссылка на программу курса, %2 - домен + порт, %3 - идентификатор обучения, %4 - место обучения, %5 - преподаватель, %6 - время, %7 - контактное лицо, %8 - примечание.';
              break;
            }
        }
    //<a href='http://%1'>Программа курса</a><br><br><a href='http://%2/stc/index.csp#/orderstudent?training=%3'>Записаться на обучение</a><br><br>Место проведения:<br>%4<br><br>Преподаватель:<br>%5<br><br>Время проведения: %6<br>%7%8
        UtilsSrvc.openCustomMessageBox('Справка', msg, [{result: '1', label: $filter('localize')('Закрыть'),  cssClass: 'btn-small', func: null}]);    
    };

    // Show preview for google tab as html
    $scope.google.showPreview = function(type){
    SettingsSrvc.getGooglePreview(type).then(
                function(data){
                  $scope.google[type].preview = data.preview;
                  $scope.google[type].previewIsVisible = true;
                },
                function(response){      
                    $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });  
    };


    //================================================================================================================================================================
    // MAIL                                                                                                                                                       MAIL
    //================================================================================================================================================================
    // Load settings for mail tab by type (reminder, feedback and etc.)
    $scope.mail.load = function(type){
        var propertyName = type;
        
        if (type != 'settings' && type != 'operators')
            propertyName = 'common';
    
    
        SettingsSrvc.getMail(type).then(
                function(data){
                    $scope.mail[propertyName] = data.data;
                    if ($scope.mail[propertyName].message){
                        $scope.mail[propertyName].message = $scope.mail[propertyName].message.replace(/<br>/g, "\n")
                    }
                },
                function(response){      
                    $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
    };
    
    // Save settings for mail tab by type (reminder, feedback and etc.)
    $scope.mail.save = function(type, form){
        var propertyName = type;
        if (type != 'settings' && type != 'operators')
            propertyName = 'common';
            
        var mailData = angular.copy($scope.mail[propertyName]);
        
        if (mailData.message){
            mailData.message = mailData.message.replace(/\n/g, "<br>");
        }
        
        SettingsSrvc.saveMail(mailData, type).then(
                function(data){
                    form.$setPristine(); 
                    $scope.mail[propertyName].alertLabel = UtilsSrvc.getAlertLabel('Сохранение завершено', 'success');
                },
                function(response){      
                    $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
    };

    // Load settings for mail tab by type (reminder, feedback and etc.)
    $scope.mail.cancel = function(type, form){
        $scope.mail.load(type);
        form.$setPristine();
    };

    $scope.mail.removeOperator = function(idx, form){
        $scope.mail.operators.items.splice(idx, 1);
        form.$setDirty();
    };
    
    $scope.mail.onTypeChanged = function(form){
        $scope.mail.load($scope.mail.typeCode);
        form.$setPristine();
    };
    
    
    
    // Show help dialog window 
    $scope.mail.showHelp = function(type){
        var getLocValue = function(key){
            return $filter('localize')(key)
        };
        
        
        var msg = getLocValue('В содержании письма можно использовать переменные(%Variable), которые впоследствии будут заменены на соответствующие значения. Список доступных переменных для данного шаблона:<br>');
        
        var trainingVariables = 
              '%DateStart, %DateEnd - ' + getLocValue('дата начала / окончания обучения') + ';<br>' +
              '%TimeStart, %TimeEnd - ' + getLocValue('время начала / окончание занятий') + ';<br>' +
              '%Course.Name - ' + getLocValue('название курса') + ';<br>' +
              '%City.Name, %Region.Name, %Country.Name - ' + getLocValue('город, регион, страна') + ';<br>' +
              '%Street, %Room - ' + getLocValue('улица и аудитория') + ';<br>' +
              '%Trainer.FullName - ' + getLocValue('фамилия и имя преподавателя') + ';<br>' +
              '%Trainer.Email, %Trainer.Phone - ' + getLocValue('email, телефон') + ';<br>' +
              '%Curator.FullName - ' + getLocValue('фамилия и имя куратора') + ';<br>' + 
              '%Curator.Email, %Curator.PhoneSecret, %Curator.PhonePublic - ' + getLocValue('email, личный | публичный телефон') + ';<br>' +
              '%OtherInfo - '  + getLocValue('дополнительная информация об обучении') + ';';
        
        switch(type){
            case 'registration':{
              msg += trainingVariables;
              break;
            }
            case 'reminder':{
              msg += trainingVariables;
              break;
            }
            case 'feedback':{
              msg += '%Course.Name - ' + getLocValue('название курса') + ';<br>' + 
                    '%SurveyUrl - ' + getLocValue('ссылка на страницу для анкетирования') + '.';
              break;
            }
            case 'teacherSetAttendeeStatus':
            case 'teacher':{
              msg += trainingVariables + '<br>' +
                    '%ListOfAttendeesUrl - ' + getLocValue('ссылка на страницу со списком слушателей') + '.';
              break;
            }
            case 'curator':{
              msg += trainingVariables + '<br>' +
                    '%ListOfAttendeesUrl - ' + getLocValue('ссылка на страницу со списком слушателей') + '.';
              break;
            }
            case 'orders':{
              msg += trainingVariables + '<br>' +
                    '%JoinUrl - ' + getLocValue('ссылка на страницу регистрации')  + '.';
              break;
            }
            case 'orderapply':{
              msg += '%Course.Name - ' + getLocValue('название курса') + '.';
              break;
            } 
            case 'confirmsubscription':{
              msg += '%ActivationUrl - ' + getLocValue('ссылка для активации подписки') + '.';
              break;
            }
            case 'listOfFeedbacks':{
              msg += trainingVariables + '<br>' + 
                     '%NumberOfNewestSurveys - ' + getLocValue('количество новых отзывов') + ';<br>' +
                     '%ListOfSurveysUrl - ' + getLocValue('ссылка на страницу с отзывами') + '.';
              break;
            } 
        }
        
        UtilsSrvc.openCustomMessageBox('Справка', msg, [{result: '1', label: $filter('localize')('Закрыть'),  cssClass: 'btn-small', func: null}]);    
    };

    // Show preview for mail tab as html
    $scope.mail.showPreview = function(type){
        var propertyName = type;
        
        if (type != 'settings' && type != 'operators')
            propertyName = 'common';
        
        SettingsSrvc.getMailPreview(type).then(
                function(data){
                    $scope.mail[propertyName].preview = data.preview;
                    $scope.mail[propertyName].previewIsVisible = true;
                },
                function(response){      
                    $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });  
    };

    
    // Load all settings
    $scope.google.load('settings');
    $scope.google.load('calendar');
    $scope.mail.load('settings');
    $scope.mail.load('operators');
});


// ===============================================================================================================================
// File: 24. controllers/AllMailingGroupsCtrl.js
// ===============================================================================================================================
'use strict';
//вdddddddddd

/*===========================================================================================
Все группы рассылки + участники 
===========================================================================================*/

controllersModule.controller('AllMailingGroupsCtrl', function($scope, $location, $filter, MailingSrvc, UtilsSrvc){
    $scope.menu.selectMenu('mailingGroups');

    if (!$scope.pageStore.mailingGroups)
        $scope.pageStore.mailingGroups = {grid:{}};
    
   	if (!$scope.pageStore.mailingItems)
        $scope.pageStore.mailingItems = {grid:{}};

    $scope.groupTable = {};
    $scope.mitemTable = {};

    //===========================================================================================================================================================================
    // Group                                                                                                                                                                Group
    //===========================================================================================================================================================================
    $scope.groupTable.init = function(){
        $scope.groupTable.columns = [
                          {name: 'Название', sqlName: 'Name', isSorted: true, isSortable: true, isDown: true, isSearched: true, isSearchable: true},
                          {name: 'Описание', sqlName: 'Description', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Участники', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '120px'}}];
        
        $scope.groupTable.properties = [{name:'name'}, 
                                        {name:'description'}, 
                                        {name:'itemsCount', cellStyle: {textAlign: 'center'}}]; 
                                                                             
        $scope.groupTable.pageSize = UtilsSrvc.getPropertyValue($scope.pageStore, 'mailingGroups.grid.pageSize', 10);
        $scope.groupTable.pageCurr = UtilsSrvc.getPropertyValue($scope.pageStore, 'mailingGroups.grid.pageCurr', 1);
        $scope.groupTable.itemsTotal = 0;
        $scope.groupTable.selectedItems = [];
        $scope.groupTable.multiSelectMode = false;
        $scope.groupTable.forciblyUpdate = 0; 
    };

    // Загрузить все группы рассылки
    $scope.groupTable.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        MailingSrvc.getAllGroupsForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, {}).then(
            function(data){
                $scope.groupTable.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.groupTable.itemsTotal = data.itemsTotal;
                $scope.groupTable.items = data.items;

                if ($scope.groupTable.selectedItems && $scope.groupTable.items && $scope.groupTable.selectedItems.length == 0 && $scope.groupTable.items.length != 0){
                    $scope.groupTable.selectedItems[0] = $scope.groupTable.items[0];
                    $scope.groupTable.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.groupTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    $scope.groupTable.refresh = function(){
        $scope.groupTable.forciblyUpdate++;
    	
    	window.document.getElementById('fileNameReal').innerHTML = ''; 
		window.document.getElementById('fileNameReal').style.display = 'none';
		window.document.getElementById('fileNameDefault').style.display = 'block';
		window.document.getElementById('btnSubmit').disabled=1; 
		window.document.getElementById('ifUpload').style.display = 'none';
		window.document.getElementById('inputFile').value = '';
    };

    // Добавить группу - переход на страницу
    $scope.groupTable.add = function(){
        $location.path('/mailing/group');
    };

    // Изменить группу - переход на страницу
    $scope.groupTable.edit = function(item){
        $location.path('/mailing/group/' + item.id);
    };

    // Удалить группу
    $scope.groupTable.remove = function(item){
        function remove(){
            MailingSrvc.removeGroup(item.id).then(
                function(data){
                    $scope.groupTable.alert = UtilsSrvc.getAlert('Готово!', 'Группы удалена.', 'success', true);
                    $scope.groupTable.refresh();
                    $scope.mitemTable.refresh();
                },
                function(response){
                    $scope.groupTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        }

        UtilsSrvc.openMessageBox($filter('localize')('Удаление группы') + " '" + item.name + "'", "Удалить группу из списка?", remove);
    };

   
    //===========================================================================================================================================================================
    // Item                                                                                                                                                                  Item
    //===========================================================================================================================================================================
    // Инициализация таблицы с участниками группы
    $scope.mitemTable.init = function(){
        $scope.mitemTable.columns = [
                          {name: 'Ф.И.О.', sqlName: 'ItemFullName', isSorted: true, isSortable: true, isDown: true, isSearched: true, isSearchable: true},
                          {name: 'Email', sqlName: 'ItemEmail', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Город', sqlName: 'ItemCity', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Организация', sqlName: 'ItemCompany', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Должность', sqlName: 'ItemPosition', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Послед. изменение', sqlName: 'LastUpdated', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: false, captionStyle: {width: '190px'}}];
        
        $scope.mitemTable.properties = [{name:'fullName'}, 
                                        {name:'email'}, 
                                        {name:'city'},
                                        {name:'company'},
                                        {name:'position'},
                                        {name:'lastUpdated',filter: 'dateUTC', filterParam: $filter('localize')('d MMMM y, HH:mm:ss')}];
                                                                             
        $scope.mitemTable.pageSize = 10;
        $scope.mitemTable.pageCurr = 1;
        $scope.mitemTable.itemsTotal = 0;
        $scope.mitemTable.selectedItems = [];
        $scope.mitemTable.multiSelectMode = false;
        $scope.mitemTable.forciblyUpdate = 0;
    };
    
    // Загрузить участников группы
    $scope.mitemTable.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        if ($scope.groupTable.selectedItems.length == 0)
            return;
        
        MailingSrvc.getAllGroupItemsForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, {groupId: $scope.groupTable.selectedItems[0].id}).then(
            function(data){
                $scope.mitemTable.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.mitemTable.itemsTotal = data.itemsTotal;
                $scope.mitemTable.items = data.items;

                if ($scope.mitemTable.selectedItems && $scope.mitemTable.items && $scope.mitemTable.selectedItems.length == 0 && $scope.mitemTable.items.length != 0){
                    $scope.mitemTable.selectedItems[0] = $scope.mitemTable.items[0];
                    $scope.mitemTable.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.mitemTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // При выборе группы - подгружать участнков, если надо.
    $scope.$watch('groupTable.selectedItems', function(){
        if (!$scope.groupTable.selectedItems || $scope.groupTable.selectedItems.length == 0 || $scope.groupTable.prevSelItemId == $scope.groupTable.selectedItems[0].id){
            return;
        }

        $("#importForm").attr("action", "Stc.Web.ImportMailingItems.cls?groupId=" + $scope.groupTable.selectedItems[0].id);
		console.log($("#importForm").attr("action"));
        $scope.groupTable.prevSelItemId = $scope.groupTable.selectedItems[0].id;
        $scope.mitemTable.refresh();
    }, true);

    $scope.mitemTable.refresh = function(){
        $scope.mitemTable.forciblyUpdate++;  
    };

    // Добавить участника - переход на страницу
    $scope.mitemTable.add = function(){
        if ($scope.groupTable.selectedItems[0].code == 'Students'){
	    	alert('Элемент рассылки создается при добавлении слушателя из завяки (если слушатель желает получать оповещения).');
	    	return;
	    }
	    
        $location.path('/mailing/group/' + $scope.groupTable.selectedItems[0].id + '/item');
    };

    // Изменить участника - переход на страницу
    $scope.mitemTable.edit = function(item){
	    if (item.type == 'student'){
	    	$location.path('/person/' + item.studentId);
	    	return;
	    }
	    
        $location.path('/mailing/group/' + $scope.groupTable.selectedItems[0].id + '/item/' + item.id);
    };
    
    // Создать письмо
    $scope.mitemTable.createMail = function(){
        $location.path('/mailing/group/' + $scope.groupTable.selectedItems[0].id + '/mail');
    };
 
    // Удалить связь курса с преподавателем
    $scope.mitemTable.remove = function(item){
        function remove(){
            MailingSrvc.removeGroupItem(item.id).then(
                function(data){
                    $scope.mitemTable.alert = UtilsSrvc.getAlert('Готово!', 'Участник удален.', 'success', true);
                    $scope.mitemTable.refresh();
                },
                function(response){
                    $scope.mitemTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        }

        UtilsSrvc.openMessageBox($filter('localize')('Удаление участника группы') + " '" + $scope.groupTable.selectedItems[0].name + "'", "Удалить участника '" + item.fullName + "' из списка?", remove);
    };
    
    $scope.groupTable.init();
    $scope.mitemTable.init();
    
    $scope.groupTable.refresh();
});



// ===============================================================================================================================
// File: 25. controllers/MailingGroupCtrl.js
// ===============================================================================================================================
'use strict';
//

/*===========================================================================================
Группа рассылки, создание и изменение
===========================================================================================*/

controllersModule.controller('MailingGroupCtrl', function($scope, $filter, $routeParams, $location, MailingSrvc, UtilsSrvc){
    $scope.groupForm = {};
    
    $scope.groupForm.init = function(){
        if (!isNaN(parseInt($routeParams.id))){
            $scope.groupForm.caption = 'Редактирование группы';
            $scope.groupForm.actionName = 'Сохранить';
            $scope.groupForm.loadData();    
        }
        else{
            $scope.groupForm.caption = 'Добавление группы';
            $scope.groupForm.actionName = 'Добавить';
        }
    };

    // Загрузить курс
    $scope.groupForm.loadData = function(){
        MailingSrvc.getGroup($routeParams.id).then(
            function(data){
                data.mailMessage = data.mailMessage.replace(/<br>/g, "\n");
                $scope.groupForm.group = data;
            },
            function(response){
                 $scope.groupForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Сохранить / создать курс
    $scope.groupForm.submit = function(){
        var group = angular.copy($scope.groupForm.group);
        group.mailMessage = group.mailMessage.replace(/\n/g, "<br>");
        
        MailingSrvc.saveGroup(group).then(
            function(data){
                if (!$scope.groupForm.group.id){
                    $scope.groupForm.alert = UtilsSrvc.getAlert('Готово!', 'Группа создана.', 'success', true);
                    $scope.groupForm.group = {};
                }
                else{
                    $scope.groupForm.alert = UtilsSrvc.getAlert('Готово!', 'Изменения сохранены.', 'success', true);
                }
                
                $scope.form.$setPristine();
            },
            function(response){
                $scope.groupForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };


    // Загрузить превью
    $scope.groupForm.loadPreview = function(){
        MailingSrvc.getGroupMail($scope.groupForm.group.id).then(
            function(data){
                $scope.groupForm.previewVisible = true;
                $scope.groupForm.preview = data.subject + '<br><br>' + data.message;
            },
            function(response){
                $scope.groupForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Отмена - возврат на страницу курсов
    $scope.groupForm.cancel = function(){
        $location.path('/mailing/groups');
    };
    
    // Show help dialog window 
    $scope.groupForm.showHelp = function(type){
        var getLocValue = function(key){
            return $filter('localize')(key)
        };
       
        var msg = getLocValue('В содержании письма можно использовать переменные(%Variable), которые впоследствии будут заменены на соответствующие значения. Список доступных переменных для данного шаблона:<br>');
        msg += 
              '%DateStart, %DateEnd - '+ getLocValue('дата начала / окончания обучения') + ';<br>' +
              '%TimeStart, %TimeEnd - '+ getLocValue('время начала / окончание занятий') + ';<br>' +
              '%Course.Name - '+ getLocValue('название курса') + ';<br>' +
              '%City.Name, %Region.Name, %Country.Name - '+ getLocValue('город, регион, страна') + ';<br>' +
              '%Street, %Room - '+ getLocValue('улица и аудитория') + ';<br>' +
              '%Trainer.FullName - '+ getLocValue('фамилия и имя преподавателя') + ';<br>' +
              '%Trainer.Email, %Trainer.Phone - '+ getLocValue('email, телефон') + '<br>' +
              '%Curator.FullName - '+ getLocValue('фамилия и имя куратора') + ';<br>' + 
              '%Curator.Email, %Curator.PhoneSecret, %Curator.PhonePublic - '+ getLocValue('email, личный | публичный телефон') + ';<br>' +
              '%OtherInfo - '+ getLocValue('дополнительная информация об обучении') + ';<br>' + 
              '%ListOfCertificates - '+ getLocValue('список сертификатов') + ';<br>' + 
              '%JoinUrl - '+ getLocValue('ссылка на страницу регистрации') + ';<br>'+
              '%ListOfAttendeesUrl - '+ getLocValue('ссылка на страницу со списком слушателей') + ';<br>' +
              '%DownloadCertificatesUrl - '+ getLocValue('ссылка для загрузки сертификатов') + ';<br>' +
              '%DeliveryAddressOfCertificates - ' + getLocValue('aдр. дост. сертификатов') + ';<br>' +
              '%UnsubscribeUrl - '+ getLocValue('ссылка на отмену подписки') + '.<br>';
         
        UtilsSrvc.openCustomMessageBox('Справка', msg, [{result: '1', label: $filter('localize')('Закрыть'),  cssClass: 'btn-small', func: null}]);    
    };
    
    $scope.groupForm.init();
});
    


// ===============================================================================================================================
// File: 26. controllers/MailingGroupMailCtrl.js
// ===============================================================================================================================
'use strict';
//

/*===========================================================================================
Письмо группе рассылки
===========================================================================================*/

controllersModule.controller('MailingGroupMailCtrl', function($scope, $filter, $window, $routeParams, MailingSrvc, UtilsSrvc){
    if ($scope.menu.admin){
        $scope.menu.brandCaption = 'Система учёта курсов';
        $scope.menu.appTitle = 'Система учёта курсов';
    }
    
    $scope.mailForm = {};
    $scope.mailForm.contacts = [];
    $scope.mailForm.contactsStyle = {};
    
    // Загрузить группу
    $scope.mailForm.loadGroup = function(){
        MailingSrvc.getGroup($routeParams.id).then(
            function(data){
                data.mailSubject = '';
                data.mailMessage = "" + $filter('localize')("Чтобы отписаться от почтовых уведомлений перейдите по <a target='_blank' href='%UnsubscribeUrl'>ссылке</a>.");
                $scope.mailForm.group = data;
            },
            function(response){
                $scope.mailForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Загрузить всех получателей
    $scope.mailForm.loadItems = function(){
        MailingSrvc.getGroupContacts($routeParams.id).then(
            function(data){
                if (data.length > 40){
                    $scope.mailForm.contactsStyle = {
                        height: '150px', 
                        overflowX: 'auto',
                        border: '1px dashed rgb(158, 158, 158)',
                        padding: '4px'
                    };
                }
                
                for (var i=0; i < data.length; i++){
                    if (data[i].name.length > 20){
                        data[i].nameShort = data[i].name.substring(0, 17) + '...'
                    }
                    else{
                        data[i].nameShort = data[i].name;
                    }
                }
                $scope.mailForm.contacts = data;  
            },
            function(response){
                $scope.mailForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };
    
    // Delete email from recipient field
    $scope.mailForm.deleteEmailContact = function(contact){
        var idx = UtilsSrvc.getIndexes($scope.mailForm.contacts, 'id', contact.id);
                
        if (idx.length != 0)
            $scope.mailForm.contacts.splice(idx[0], 1);
    };
    
    // Загрузить превью
    $scope.mailForm.loadPreview = function(){
        $scope.mailForm.previewVisible = true;
        $scope.mailForm.preview = $scope.mailForm.group.mailSubject + '<br><br>' + $scope.mailForm.group.mailMessage.replace(/\n/g, "<br>");
        return;
        
        MailingSrvc.getGroupMail($routeParams.id).then(
            function(data){
                $scope.mailForm.preview = data.subject + '<br><br>' + data.message;
                $scope.mailForm.previewVisible = true;  
            },
            function(response){
                $scope.mailForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Отправить письмо
    $scope.mailForm.sendMail = function(){
        if ($scope.mailForm.contacts.length == 0)
            return;

        var resultContacts = $filter('filter')($scope.mailForm.contacts, { city: $scope.mailForm.cityFilter, companyTypeCode: $scope.companyTypeFilterFunc()});
        
        MailingSrvc.sendEMail({
                    contacts: resultContacts, 
                    subject: $scope.mailForm.group.mailSubject, 
                    message: $scope.mailForm.group.mailMessage.replace(/\n/g, "<br>")
                }).then(
            function(data){
                $scope.form_mail.$setPristine();
                $scope.mailForm.alert = UtilsSrvc.getAlert('Готово!', 'Письма добавлены в очередь, проверьте журнал рассылок', 'success', true);  
            },
            function(response){
                $scope.mailForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };
    
    // Назад
    $scope.mailForm.back = function(){
        $window.history.back();
    };


    $scope.companyTypeFilterFunc = function () { 
        if ($scope.mailForm.companyTypeUniverFilter && $scope.mailForm.companyTypePartnerFilter){
            return '';            
        }
        
        if ($scope.mailForm.companyTypePartnerFilter){
            return 'Partner';      
        }
        
        if ($scope.mailForm.companyTypeUniverFilter){
            return 'Univer'           
        }
        
        return 'UnknownCompanyType';
    };
    
    $scope.mailForm.loadGroup();
    $scope.mailForm.loadItems();
});
    


// ===============================================================================================================================
// File: 27. controllers/MailingItemCtrl.js
// ===============================================================================================================================
'use strict';
//dddddfd

/*===========================================================================================
Элемент рассылки, создание и изменение
===========================================================================================*/

controllersModule.controller('MailingItemCtrl', function($scope, $routeParams, $location, MailingSrvc, UtilsSrvc){
    $scope.mitemForm = {};
    
    $scope.mitemForm.init = function(){
        $scope.mitemForm.loadGroups();

        if (!isNaN(parseInt($routeParams.iId))){
            $scope.mitemForm.caption = 'Редактирование участника';
            $scope.mitemForm.actionName = 'Сохранить';
            $scope.mitemForm.loadData();    
        }
        else{
            $scope.mitemForm.caption = 'Добавление участника';
            $scope.mitemForm.actionName = 'Добавить';
            $scope.mitemForm.mitem = {group: {id: parseInt($routeParams.gId)}};
        }
    };

    // Загрузить участника
    $scope.mitemForm.loadData = function(){
        MailingSrvc.getGroupItem($routeParams.iId).then(
            function(data){
                $scope.mitemForm.mitem = data;
            },
            function(response){
                 $scope.mitemForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Сохранить / создать участника
    $scope.mitemForm.submit = function(){
        MailingSrvc.saveGroupItem($scope.mitemForm.mitem).then(
            function(data){
	            if (!$scope.mitemForm.mitem.id){
                	$scope.mitemForm.alert = UtilsSrvc.getAlert('Готово!', 'Участник добавлен.', 'success', true);
                	$scope.mitemForm.course = {};
	            }
                else{
                	$scope.mitemForm.alert = UtilsSrvc.getAlert('Готово!', 'Изменения сохранены.', 'success', true);
                }
                
                $scope.form.$setPristine();
            },
            function(response){
                $scope.mitemForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Отмена - возврат на страницу групп
    $scope.mitemForm.cancel = function(){
        $location.path('/mailing/groups');
    };

    // Загрузить группы рассылки для комбобокса
    $scope.mitemForm.loadGroups = function(){
        MailingSrvc.getGroups().then(
            function(data){
                $scope.mitemForm.groups = data;
            },
            function(response){
                $scope.mitemForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
    
    $scope.mitemForm.init();
});
    


// ===============================================================================================================================
// File: 28. controllers/MailingSubscriptionCtrl.js
// ===============================================================================================================================
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
    


// ===============================================================================================================================
// File: 29. controllers/AllLogsCtrl.js
// ===============================================================================================================================
'use strict';
//j

/*===========================================================================================
Логи
===========================================================================================*/

controllersModule.controller('AllLogsCtrl', function($scope, $filter, UtilsSrvc){
    $scope.logTable = {grid:{}};

    $scope.logTable.init = function(){
        $scope.logTable.columns = [
                          {name: 'Location', sqlName: 'Location', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Msg', sqlName: 'Msg', isSorted: false, isSortable: false, isDown: true, isSearched: true, isSearchable: true},
                          {name: 'CreatedTS', sqlName: 'ID', isSorted: true, isSortable: false, isDown: false, isSearched: false, isSearchable: false, captionStyle: {width: '150px'}}];
        
        $scope.logTable.properties = [
                          {name:'location'}, 
                          {name:'msg'}, 
                          {name:'createdTS', filter: 'date', filterParam: $filter('localize')('d MMMM y, HH:mm:ss')}];
                                                                             
        $scope.logTable.pageSize = 40;
        $scope.logTable.pageCurr = 1;
        $scope.logTable.itemsTotal = 0;
        $scope.logTable.selectedItems = [];
        $scope.logTable.multiSelectMode = false;
        $scope.logTable.forciblyUpdate = 0;
        $scope.logTable.forciblyUpdate++;
    };

    // Загрузить все курсы
    $scope.logTable.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        UtilsSrvc.getAllLogsForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText).then(
            function(data){
                $scope.logTable.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.logTable.itemsTotal = data.itemsTotal;
                $scope.logTable.items = data.items;
            },
            function(response){
	            console.log(response);
                $scope.logTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    $scope.logTable.init();
});



// ===============================================================================================================================
// File: 30. controllers/MailingJournalCtrl.js
// ===============================================================================================================================
'use strict';
//jddd
  
/*===========================================================================================
Журнал рассылок
===========================================================================================*/

controllersModule.controller('MailingJournalCtrl', function($scope, MailingSrvc, $filter, UtilsSrvc){
    $scope.grMailTable = {grid:{}};
    $scope.allMailTable = {grid:{}};
    $scope.menu.selectMenu('mailingJournal');


    $scope.init = function(){
        //
        // Вкладка "Сгруппированные письма"
        // 
        $scope.grMailTable.columns = [
                          {name: 'Дата создания', sqlName: '', isSorted: true, isSortable: false, isDown: false, isSearched: false, isSearchable: false, captionStyle: {width: '190px'}},
                          {name: 'Отправлено писем', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Тип рассылки', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Тема письма', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Содержание', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false}];
        
        $scope.grMailTable.properties = [
                          {name: 'createdTS', filter: 'date', filterParam: $filter('localize')('d MMMM y, HH:mm:ss')},
                          {name: 'grStatus', 
                          calculate: function(item){
                                item.grStatus = item.sendedCount + " из " + item.recipientsCount;
                          }},
                          {name: 'type'},
                          {name: 'subject'},
                          {name: 'messageShort',
                          calculate: function(item){
                                if (item.message.length >= 30){
                                    item.messageShort = item.message.substring(0, 30) + '...';
                                }
                                else{
                                    item.messageShort = item.message;
                                }
                          }}];
                                                                             
        $scope.grMailTable.pageSize = 10;
        $scope.grMailTable.pageCurr = 1;
        $scope.grMailTable.itemsTotal = 0;
        $scope.grMailTable.selectedItems = [];
        $scope.grMailTable.multiSelectMode = false;
        $scope.grMailTable.forciblyUpdate = 0;

    
        //
        // Вкладка "Все письма"
        // 
        $scope.allMailTable.columns = [
                          {name: 'Дата отправки', sqlName: 'ID', isSorted: true, isSortable: false, isDown: false, isSearched: false, isSearchable: false, captionStyle: {width: '190px'}},
                          {name: 'Получатель', sqlName: 'RecipientName', isSorted: false, isSortable: false, isDown: true, isSearched: true, isSearchable: true},
                          {name: 'Тип рассылки', sqlName: 'Type', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Тема письма', sqlName: 'Subject', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Содержание', sqlName: 'Message', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true}];
        
        $scope.allMailTable.properties = [
                          {name: 'sendedStatus',
                          calculate: function(item){
                                if (item.isSended){
                                    item.sendedStatus = $filter('convertCacheDate')(item.sendedTS, $filter('localize')('d MMMM y, HH:mm:ss'));
                                }
                                else{
                                    item.sendedStatus = $filter('localize')('В очереди');
                                }
                          }},
                          {name: 'recipient.fullName', 
                          calculate: function(item){
                                if (item.recipient.name != ''){
                                    item.recipient.fullName = item.recipient.name + ' (' + item.recipient.email + ')';   
                                }
                                else{
                                    item.recipient.fullName = item.recipient.email;
                                }
                          }},
                          {name: 'type'},
                          {name: 'subject'},
                          {name: 'messageShort',
                          calculate: function(item){
                                if (item.message.length >= 30){
                                    item.messageShort = item.message.substring(0, 30) + '...';
                                }
                                else{
                                    item.messageShort = item.message;
                                }
                          }}];
                                                                             
        $scope.allMailTable.pageSize = 10;
        $scope.allMailTable.pageCurr = 1;
        $scope.allMailTable.itemsTotal = 0;
        $scope.allMailTable.selectedItems = [];
        $scope.allMailTable.multiSelectMode = false;
        $scope.allMailTable.forciblyUpdate = 0;
    };

    $scope.grMailTable.refresh = function(){
        $scope.grMailTable.forciblyUpdate++;  
    };

    $scope.grMailTable.selectTab = function(){
        $scope.allMailTable.refresh();  
    };

    $scope.allMailTable.refresh = function(){
        $scope.allMailTable.forciblyUpdate++;  
    };


    // Загрузить сгруппированные элементы журнала
    $scope.grMailTable.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        MailingSrvc.getAllJournalPartsForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText).then(
            function(data){
                $scope.grMailTable.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.grMailTable.itemsTotal = data.itemsTotal;
                $scope.grMailTable.items = data.items;
                
            },
            function(response){
                $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Удалить всю группу 
    $scope.grMailTable.remove = function(item){
        MailingSrvc.removeJournalPart(item.groupNumber).then(
            function(data){
                $scope.alert = UtilsSrvc.getAlert('Готово!', 'Записи удалены.', 'success', true);
                if ($scope.grMailTable.selectedItems.length !=0 && item.groupNumber == $scope.grMailTable.selectedItems[0].groupNumber){
                    $scope.grMailTable.selectedItems = [];
                }
                
                $scope.grMailTable.refresh();
            },
            function(response){
                $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
 
    $scope.$watch('grMailTable.selectedItems[0]', function(){
        if ($scope.grMailTable.selectedItems && $scope.grMailTable.selectedItems.length > 0){
            $scope.allMailTable.tabCaption = "Все письма выбранной группы";
        }
        else{
            $scope.allMailTable.tabCaption = "Все письма";
        }
    }, true);


    // Загрузить элементы журнала
    $scope.allMailTable.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        var groupNumber = null;
        if ($scope.grMailTable.selectedItems && $scope.grMailTable.selectedItems.length > 0 && $scope.grMailTable.selectedItems[0]){
            groupNumber = $scope.grMailTable.selectedItems[0].groupNumber;
        }

        MailingSrvc.getAllJournalItemsForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, {groupNumber: groupNumber}).then(
            function(data){
                $scope.allMailTable.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.allMailTable.itemsTotal = data.itemsTotal;
                $scope.allMailTable.items = data.items;
            },
            function(response){
                $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Изменить статус рассылки
    $scope.changeMailingStatus = function(status){
        MailingSrvc.changeMailingStatus(status).then(
            function(data){
                $scope.mailingStatus = data.status;
                
                if (data.status == "On"){
                    $scope.alert = UtilsSrvc.getAlert('Готово!', 'Отправка писем возобновлена', 'success', true);
                }
                else{
                    $scope.alert = UtilsSrvc.getAlert('Готово!', 'Отправка писем прекращена', 'info', true);
                }
            },
            function(response){
                $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Загрузить статус рассылки 
    $scope.loadMailingStatus = function(){
        MailingSrvc.getMailingStatus().then(
            function(data){
                $scope.mailingStatus = data.status;
            },
            function(response){
                $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
 
    // Удалить запись 
    $scope.allMailTable.remove = function(item){
        MailingSrvc.removeJournalItem(item.id).then(
            function(data){
                $scope.alert = UtilsSrvc.getAlert('Готово!', 'Запись удалена.', 'success', true);
                if ($scope.allMailTable.selectedItems.length !=0 && item.id == $scope.allMailTable.selectedItems[0].id){
                    $scope.allMailTable.selectedItems = [];
                }
                
                $scope.allMailTable.forciblyUpdate++;
            },
            function(response){
                $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    $scope.init();
    $scope.grMailTable.refresh();
    $scope.loadMailingStatus();

/*
    $scope.allMailTable = {grid:{}};
    $scope.menu.selectMenu('mailingJournal');

    $scope.allMailTable.init = function(){
        $scope.allMailTable.columns = [
                          {name: 'Дата отправки', sqlName: 'ID', isSorted: true, isSortable: false, isDown: false, isSearched: false, isSearchable: false, captionStyle: {width: '190px'}},
                          {name: 'Получатель', sqlName: 'RecipientName', isSorted: false, isSortable: false, isDown: true, isSearched: true, isSearchable: true},
                          {name: 'Тип рассылки', sqlName: 'Type', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Тема письма', sqlName: 'Subject', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Содержание', sqlName: 'Message', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true}];
        
        $scope.allMailTable.properties = [
                          {name: 'sendedStatus',
                          calculate: function(item){
	                      		if (item.isSended){
	                      			item.sendedStatus = $filter('convertCacheDate')(item.sendedTS, $filter('localize')('d MMMM y, HH:mm:ss'));
	                      		}
	                      		else{
	                      			item.sendedStatus = $filter('localize')('В очереди');
		                      	}
	                      }},
                          {name: 'recipient.fullName', 
                          calculate: function(item){
                                if (item.recipient.name != ''){
                                    item.recipient.fullName = item.recipient.name + ' (' + item.recipient.email + ')';   
                                }
                                else{
	                                item.recipient.fullName = item.recipient.email;
                                }
                          }},
                          {name: 'type'},
                          {name: 'subject'},
                          {name: 'messageShort',
                          calculate: function(item){
                                if (item.message.length >= 30){
                                    item.messageShort = item.message.substring(0, 30) + '...';
                                }
                                else{
	                                item.messageShort = item.message;
                                }
                          }}];
                                                                             
        $scope.allMailTable.pageSize = 10;
        $scope.allMailTable.pageCurr = 1;
        $scope.allMailTable.itemsTotal = 0;
        $scope.allMailTable.selectedItems = [];
        $scope.allMailTable.multiSelectMode = false;
        $scope.allMailTable.forciblyUpdate = 0;
        $scope.allMailTable.forciblyUpdate++;
    };

    // Загрузить элементы журнала
    $scope.allMailTable.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        MailingSrvc.getAllJournalItemsForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText).then(
            function(data){
                $scope.allMailTable.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.allMailTable.itemsTotal = data.itemsTotal;
                $scope.allMailTable.items = data.items;
                
                if ($scope.allMailTable.selectedItems && $scope.allMailTable.items && $scope.allMailTable.selectedItems.length == 0 && $scope.allMailTable.items.length != 0){
                    $scope.allMailTable.selectedItems[0] = $scope.allMailTable.items[0];
                    $scope.allMailTable.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.allMailTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Изменить статус рассылки
    $scope.allMailTable.changeMailingStatus = function(status){
        MailingSrvc.changeMailingStatus(status).then(
            function(data){
                $scope.allMailTable.mailingStatus = data.status;
                $scope.allMailTable.forciblyUpdate++;
                
                if (data.status == "On"){
                	$scope.allMailTable.alert = UtilsSrvc.getAlert('Готово!', 'Отправка писем возобновлена', 'success', true);
                }
                else{
	                $scope.allMailTable.alert = UtilsSrvc.getAlert('Готово!', 'Отправка писем прекращена', 'info', true);
                }
            },
            function(response){
                $scope.allMailTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Загрузить статус рассылки 
    $scope.allMailTable.loadMailingStatus = function(){
        MailingSrvc.getMailingStatus().then(
            function(data){
                $scope.allMailTable.mailingStatus = data.status;
            },
            function(response){
                $scope.allMailTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
 
    // Удалить запись 
    $scope.allMailTable.remove = function(item){
        MailingSrvc.removeJournalItem(item.id).then(
            function(data){
               	$scope.allMailTable.alert = UtilsSrvc.getAlert('Готово!', 'Запись удалена.', 'success', true);
            	if ($scope.allMailTable.selectedItems.length !=0 && item.id == $scope.allMailTable.selectedItems[0].id){
            		$scope.allMailTable.selectedItems = [];
            	}
            	
            	$scope.allMailTable.forciblyUpdate++;
            },
            function(response){
                $scope.allMailTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    $scope.allMailTable.init();
    $scope.allMailTable.loadMailingStatus();
    */
});



// ===============================================================================================================================
// File: 31. services/DALSrvc.js
// ===============================================================================================================================
'use strict';
//dddxdddddв

/*===========================================================================================
Доступ к БД через REST
===========================================================================================*/

servicesModule.factory('DALSrvc', function($resource, $q) {	
	return {
		getPromise: function(method, url, obj){
    		var resource = $resource(url);
            var deferred = $q.defer();
            
            resource[method](obj,
                        function(data){
                            deferred.resolve(data.children ? data.children : data);
                        },
                        function(response){
	                        if (response.data == ""){
	                        	response.data = "Error status: " + response.status + ". Method: " + response.config.method + ". Url: " + response.config.url + "."; 
	                        }
                            
                            deferred.reject(response);
                        });

            return deferred.promise;
    	}
    }
});
  

// ===============================================================================================================================
// File: 32. services/YandexSrvc.js
// ===============================================================================================================================
'use strict';
//

/*===========================================================================================
Для работы с яндексом
===========================================================================================*/

servicesModule.factory('YandexSrvc', function(DALSrvc) {
	return {
		// Получить координаты адреса
        getResult: function(string){
	       return DALSrvc.getPromise('get', 'http://geocode-maps.yandex.ru/1.x/?lang=' +  StcAppSetting.lang + '&format=json&geocode=' + string, null);
        },
        getMapLink: function(lat, lng){
           return 'http://maps.yandex.ru/?ll=' + lng + ',' + lat + '&pt=' + lng + ',' + lat + '&l=map&z=15';
        }
    }
});
  

// ===============================================================================================================================
// File: 33. services/TrainingSrvc.js
// ===============================================================================================================================
'use strict';
//dddddde

/*===========================================================================================
Обучения
===========================================================================================*/

servicesModule.factory('TrainingSrvc', function(DALSrvc, $filter) {
    return {
        /* Добавить слушателя из заявки в обучение */
        addNewStudentIntoTraining: function(trainingData){
           return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/training/orderNewStudent', trainingData);
        },
        /* Сохранить/ создать обучение */
        save: function(trainingData){
           return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/training', trainingData);
        },
        /* Удалить обучение */
        remove: function(id){
           return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/training/' + id, null);
        },
        /* Завершить обучение */
        complete: function(trainingId){
           return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/training/' + trainingId + '/complete', null);
        },
        /* Получить обучение */
        get: function(id){
           return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/training/' + id, null);
        },
        /**/
        getSubGroupById: function(id){
           return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/training/subgroup/' + id, null);
        },
        /* Получить обучение для пользователя*/
        getForUser: function(id){
           return DALSrvc.getPromise('get', StcAppSetting.user + '/json/training/' + id, null);
        },
        /* Все сертификаты обучения */
        getCertificates: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, trainingId){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       trainingId: trainingId};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/training/certificate/grid', obj);
        },
        createCertificates: function(trainingId){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/training/' + trainingId + '/certificate', null);
          },
        /* Получить все обучения для таблицы */
        getAllForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, other){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       other: other};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/training/grid', obj);
        },
        /* Все подгруппы обучения для таблицы */
        getSubGroupsForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, trainingId){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       trainingId: trainingId};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/training/subgroup/grid', obj);
        },
        /* Все слушатели обучения для таблицы */
        getStudentsForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, trainingId){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       trainingId: trainingId};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/training/student/grid', obj);
        },
        /* Все слушатели обучения для таблицы */
        getStudentsByAccessCodeForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, code){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText
                     };

            return DALSrvc.getPromise('save', StcAppSetting.user + '/json/training/' + code + '/student', obj);
        },
        /* Все заявки на присоединение  */
        getOrderStudentsByAccessCodeForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, code){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText
                     };

            return DALSrvc.getPromise('save', StcAppSetting.user + '/json/training/' + code + '/ordernewstudent', obj);
        },
        deleteSubGroupStudent: function(sgroupId, studentId){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/training/subgroup/' + sgroupId + '/student/' + studentId, null);
        },
        deleteStudent: function(trainingId, studentId){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/training/' + trainingId + '/student/' + studentId, null);
        },
        /* Все валюты */
        getCurrencies: function(){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/currency', null);
        },
        /* */
        getEMail: function(trId, type){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/training/' + trId + '/mail/' + type, null);
        },
        /* Сохранить платеж */
        saveSubGroupPayment: function(payment){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/training/subgroup/payment', payment);  
        },
        addStudent: function(trainingId, groupId, person){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/training/student', {training: {id: trainingId},group: {id: groupId}, student: person});
        },
        /* Сохранить инфу о договоре */
        saveSubGroupContract: function(contract){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/training/subgroup/contract', contract);  
        },
        /* Создать подгруппу и добавить ее в обучение */
        createSubGroup: function(trId, sgData){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/training/' + trId + '/subgroup', sgData);  
        },
        /* Удалить подгруппу из обучения */
        deleteSubGroup: function(trainingId, sgroupId){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/training/' + trainingId + '/subgroup/' +  sgroupId, null);  
        },
        doEvent: function(data){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/trainingEvent', data);
          },
        getEmailContacts: function(trainingId){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/training/' + trainingId + '/student/email', null);
        },
        changeStatusAutoMailing: function(data){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/training/automailing/status', data);
        },
        saveFeedBack: function(data, trId, code){
            return DALSrvc.getPromise('save', StcAppSetting.user + '/json/training/' + trId + '/feedback/' + code, data);
        },
        getFeedBackTemplate:function(){
            return DALSrvc.getPromise('get', StcAppSetting.user + '/json/feedback/template', null);
        },
        /* All training feedbacks */
        getFeedBacksForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, trainingId){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       trainingId: trainingId};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/training/feedback/grid', obj);
        },
        /* All training feedbacks by Access Code */
        getFeedBacksForGridByAccessCode: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, trainingId, accessCode){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       trainingId: trainingId,
                       accessCode: accessCode};

            return DALSrvc.getPromise('save', StcAppSetting.user + '/json/training/feedback/grid', obj);
        },
        deleteFeedBack: function(id){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/training/feedback/' + id, null); 
        },
        getMailingGroups: function(trId){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/training/' + trId + '/mailing/group', null);
        },
        sendEmail: function(data){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/training/mail/send', data);
        },
        createQuestion: function(trId, data){
            return DALSrvc.getPromise('save', StcAppSetting.user + '/json/training/' + trId + '/question', data);
        },
        getTeacherPayout: function(trainingId, teacherId){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/training/' + trainingId + '/teacher/' + teacherId + '/payout', null);
        },
        updateStudentAttendedStatus: function(accessCode, studentId, statusCode){
            return DALSrvc.getPromise('save', StcAppSetting.user + '/json/training/' + accessCode + '/student/udpateStatus', {studentId : studentId, statusCode: statusCode});
        },
        getUrlForCreateGoogleCalendarEvent: function(text, dates, location, details){
                return 'https://www.google.com/calendar/render?action=TEMPLATE&hl=ru' + 
                                        '&text=' + text +
                                        '&dates=' + dates +
                                        '&location=' + location +
                                        '&details=' +  
                                                    '<a href="' + details.courseProgramUrl + '" target="_blank">Программа курса</a>%0A%0A' +
                                                    '<a href="' + 'http://' + window.location.host + StcAppSetting.defaultApp + '/stc/index.csp%23/training/' + details.trainingId + '/order" target="_blank">' + $filter('localize')('Присоединиться') + '</a>%0A%0A' +
                                                    $filter('localize')('Место проведения') + ':' + '%0A' + 
                                                    details.city + '%0A' +
                                                    details.address + '%0A%0A' +
                                                    $filter('localize')('Время') + ':' + '%0A' + 
                                                    details.time + '%0A%0A' +
                                                    $filter('localize')('Преподаватель') + ':' + '%0A' +
                                                    details.teacher + '%0A%0A' + 
                                                    $filter('localize')('Контактное лицо') + ':' + '%0A' +
                                                    details.curator +
                                                    (details.otherInfo == "" ? "" : '%0A%0A' +  $filter('localize')('Примечание') + ':' + ' %0A' + details.otherInfo) 
                                                    '&sf=true&output=xml';
        }
        
    }
});
  

// ===============================================================================================================================
// File: 34. services/OrderSrvc.js
// ===============================================================================================================================
'use strict';
//dвdddвd

/*===========================================================================================
Заявки
===========================================================================================*/

servicesModule.factory('OrderSrvc', function(DALSrvc) {
	return {
	      /* Создание грязной заявки */
        createOrder: function(order){
            return DALSrvc.getPromise('save', StcAppSetting.user + '/json/order', order);
        },
        /* Создание заявки для слушателя*/
        createOrderNewStudent: function(order){
            return DALSrvc.getPromise('save', StcAppSetting.user + '/json/orderNewStudent', order);
        },
        /* Удаление любой заявки */
        deleteOrder: function(id){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/order/' + id, null);
        },
        /* Удаление заявки от слушателя*/
        deleteOrderNewStudent: function(id){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/orderNewStudent/' + id, null);
        },
        /* Получить все заявки */
        getAllOrdersForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, status){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       status: status};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/order/grid', obj);
        },
        /* Получить все заявки-студентов */
        getAllOrdersNewStudentForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, trainingId){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       trainingId: trainingId};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/orderNewStudent/grid', obj);
        },
        /* Получить 1 заявку */
        getOrder: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/order/' + id, null);
        },
        /* Получить 1 заявку от слушателя*/
        getOrderNewStudent: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/orderNewStudent/' + id, null);
        },
        /* Сменить компанию в заявке */
        changeOrderCompany: function(orderId, companyId){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/order/' + orderId + '/company/' + companyId, null);
        },
        /* Сменить компанию в заявке от слушателя */
        changeOrderNewStudentCompany: function(orderId, companyId){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/orderNewStudent/' + orderId + '/company/' + companyId, null);
        },
        /* Изменить статус заявки */
        changeOrderStatus: function(ordId, status){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/order/' + ordId + '/status/' + status, null);
        }
    }
});

// ===============================================================================================================================
// File: 35. services/CourseTeacherSrvc.js
// ===============================================================================================================================
'use strict';
//ddd

/*===========================================================================================
Курсы и преподватели
===========================================================================================*/

servicesModule.factory('CourseTeacherSrvc', function(DALSrvc) {
	return {
		/* Получить все курсы, коротко */
		getAll: function(isInUse){
			return DALSrvc.getPromise('get', StcAppSetting.user + '/json/course/isInUse/' + isInUse, null);
		},
		/* Получить все курсы, полная инфа, для таблицы */
		getAllForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, isInUse){
			var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       isInUse: isInUse};

            return DALSrvc.getPromise('save', StcAppSetting.user + '/json/course/grid', obj);
		},
		/* Изменить статус курса */
		changeStatus: function(courseId){
			return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/course/' + courseId + '/inverseStatus', null);
		},
		/* Обновить или создать курс */
		save: function(course){
			return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/course', course);
		},
		/*  */
		get: function(id){
			return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/course/' + id, null);
		},
		getTeachers: function(id){
			return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/course/' + id + '/teacher', null);
		},
		/* Schedule */
		getSchedule: function(){
			return DALSrvc.getPromise('get', StcAppSetting.user + '/json/schedule', null);
		},
		addTeacher: function(courseId, person){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/course/' + courseId + '/teacher',  {teacher: person});
        },
        removeTeacher: function(courseId, teacherId){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/course/' + courseId + '/teacher/' + teacherId,  null);
        }
	}
});

// ===============================================================================================================================
// File: 36. services/RegionSrvc.js
// ===============================================================================================================================
'use strict';
//dddв

/*===========================================================================================
Регионы, города
===========================================================================================*/

servicesModule.factory('RegionSrvc', function(DALSrvc) {
	return {
	    /* Все города по начальным буквам */
        getAllCitiesStartsWith: function(startsWith){
            return DALSrvc.getPromise('get', StcAppSetting.user + '/json/city/' + startsWith, null);
        }
    }
});
  

// ===============================================================================================================================
// File: 37. services/CompanySrvc.js
// ===============================================================================================================================
'use strict';
//dddв

/*===========================================================================================
Компании
===========================================================================================*/

servicesModule.factory('CompanySrvc', function(DALSrvc) {
    
    return {
        /* Получить короткую информацию о компаниях */
        getAll: function(){
            return DALSrvc.getPromise('get', StcAppSetting.user + '/json/company', null);
        },
        /* Получить короткую информацию о компаниях */
        getAllForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, status){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       status: status};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/company/grid', obj);
        },
        /* Получить короткую информацию о компаниях */
        get: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/company/' + id, null);
        },
        /* Сохранить компанию из заявки */
        saveFromOrder: function(company, orderId){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/company/order', {company: company, orderId: orderId, isOrder: true});
        },
        /* Сохранить компанию из заявки от слушателя*/
        saveFromOrderNewStudent: function(company, orderId){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/company/order', {company: company, orderId: orderId, isOrder: false});
        },
        /* Сохранить данные компании | создать*/
        save: function(company){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/company', company);
        },
        /* Удалить компанию*/
        remove: function(id){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/company/' + id, null);
        },
        changeContact: function(data){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/company/contact/change', data);
        },
        createContact: function(data){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/company/contact/new', data);
        }
    }
});
  

// ===============================================================================================================================
// File: 38. services/CertificateSrvc.js
// ===============================================================================================================================
'use strict';
//dddddddвdd

/*===========================================================================================
Сертификаты
===========================================================================================*/

servicesModule.factory('CertificateSrvc', function(DALSrvc) {
    
    return {
          /* Все сертификаты */
        getAllForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, isPrinted){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       isPrinted: isPrinted};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/certificate/grid', obj);
        },
        remove: function(number){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/certificate/' + number, null);
        },
        print: function(number){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/certificate/' + number + '/print', null);
        },
        sendToOffice: function(trainingId){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/traiing/' + trainingId + '/certificate/sendToOffice', null);
        }    
    }
});
  

// ===============================================================================================================================
// File: 39. services/PersonSrvc.js
// ===============================================================================================================================
'use strict';
//

/*===========================================================================================
Персоны
===========================================================================================*/

servicesModule.factory('PersonSrvc', function(DALSrvc) {
    return {
        save: function(person){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/person', person);
        },
        getById: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/person/' + id, null);
        },
        getByEmail: function(email){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/person/email/' + email, null);
        },
        deleteById: function(id){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/person/' + id, null);
        },
        getAllForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, type){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       type: type};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/person/grid', obj);
        },
        getBySearchParameters: function(word){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/person/search/' + word, null);
        },
        getFreeTrainingStudents: function(trainingId, word){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/person/free/training/' + trainingId + '/student/' + word, null);
        },
        getFreeCourseTeachers: function(courseId, word){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/person/free/course/' + courseId + '/teacher/' + word, null);
        },
        getTeacherStatistics: function(teachId, dateFrom, dateTo){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/teacher/' + teachId + '/statistics/datefrom/' + (dateFrom ? dateFrom : '0') + '/dateto/' + (dateTo ? dateTo : '0'), null);
        },
        getTrainings: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/person/' + id + '/training', null);
        },
        getCourses: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/person/' + id + '/course', null);
        },
        getCompanies: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/person/' + id + '/company', null);
        },
        getCertificates: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/person/' + id + '/certificate', null);
        }
    }
});
  

// ===============================================================================================================================
// File: 40. services/UtilsSrvc.js
// ===============================================================================================================================
'use strict';
//ddвddddв

/*===========================================================================================
Utils
===========================================================================================*/

servicesModule.factory('UtilsSrvc', function($dialog, $filter, DALSrvc) {
    
    return {
        openMessageBox: function(title, msg, func){
            var btns = [{result: true, label: 'Ок', cssClass: 'btn-primary btn-small'}, 
                        {result: false, label: $filter('localize')('Отмена'), cssClass: 'btn-small'}];

            $dialog.messageBox($filter('localize')(title), $filter('localize')(msg), btns).open().then(function(result){
                if (result && func)
                    func(); 
             });
        },
        openCustomMessageBox: function(title, msg, btns){
            $dialog.messageBox($filter('localize')(title), $filter('localize')(msg), btns).open().then(function(result){
                for (var i=0; i < btns.length; i++){
                    if (result == btns[i].result && btns[i].func)
                        btns[i].func();
                }
             });
        },
        getAlert: function(title, msg, eventType, visible){
            return {title: $filter('localize')(title),
                    msg: $filter('localize')(msg),
                    cssClass: 'alert alert-' + eventType,
                    visible: visible};
        },
        getAlertLabel: function(msg, eventType){
            return {msg: $filter('localize')(msg),
                    cssClass: eventType,
                    visible: true};
        },
        getIndexes: function(array, objField, valueField){
            var indexes = [];
            
            if (!array) return indexes;
            
            for (var i = 0; i < array.length; i++) {
                if (array[i][objField] == valueField)
                    indexes.push(i);
            };
            return indexes;
        },
        getValidDate: function(str){
            var date = new Date(str);
            if (isNaN(date))
                return "";
                
            //return $filter('date')(date, 'dd-MM-y');
            return $filter('date')(date, 'y-MM-dd');
        },
        getTwoDate: function(start, finish){
            var startText = $filter('convertCacheDate')(start, $filter('localize')('d MMMM y'));
            var finishText = $filter('convertCacheDate')(finish, $filter('localize')('d MMMM y'));
            var partsDate = startText.split(",");

            if (partsDate.length == 1){
                // На тот случай если startText == "17 октября 2015"
                partsDate = startText.split(" ");
                startText = partsDate[0] + ' ' + partsDate[1];
            }
            else if (partsDate.length == 2){
                // На тот случай если startText == "october 17, 2015"
                startText = partsDate[0];
            }
     
            return startText + ' - ' +  finishText;
        },
        getMailPattern: function(type){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/mail/pattern/' + type, null);
        },
        sendEmail: function(data){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/mail/send', data);
        },
        getAllLogsForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/log/grid', obj);
        },
        getFullNameForCurLang: function(lastName, firstName, middleName){
            // У русских - фамилия имя, а у англичан - имя фамилия
            
            if (StcAppSetting.lang == 'ru-RU' || StcAppSetting.lang == 'ru'){
                return lastName + ' ' + firstName + (middleName ? ' ' + middleName : '');
            }
            else {
                return firstName + (middleName ? ' ' + middleName : '') + ' ' + lastName;
            }
        },
        getPropertyValue: function (item, propertyStr, defaultValue){
            var value;
            defaultValue = defaultValue ? defaultValue : '';

            try{
                var properties = propertyStr.split('.');
                
                switch(properties.length){
                    case 1:
                        value = item[properties[0]];
                        break;
                    case 2:
                        value = item[properties[0]][properties[1]];
                        break;
                    case 3:
                        value = item[properties[0]][properties[1]][properties[2]];
                        break;
                    case 4:
                        value = item[properties[0]][properties[1]][properties[2]][properties[3]];
                        break;
                    case 5:
                        value = item[properties[0]][properties[1]][properties[2]][properties[3]][properties[4]];
                        break;
                }
            }
            catch(ex){
                //console.log('Cвойства не существует ' + propertyStr);
            }

            return value == undefined ? defaultValue : value;
        }
    }
});
  

// ===============================================================================================================================
// File: 41. services/ReportSrvc.js
// ===============================================================================================================================
'use strict';
//ddвddddв

/*===========================================================================================
Отчеты
===========================================================================================*/

servicesModule.factory('ReportSrvc', function($cookies, $window) {
    
    return {
        certificates: function(trainingId){
            var lang = $cookies.lang ? $cookies.lang.substring(0,2) : 'ru';
            $window.open(StcAppSetting.admin + '/text/' + lang + '/certificates/'+trainingId,'_blank');
        },
        students: function(trainingAccessCode){
            var lang = $cookies.lang ? $cookies.lang.substring(0,2) : 'ru';
            $window.open(StcAppSetting.user + '/text/' + lang + '/students/'+trainingAccessCode,'_blank');
        },
        ordernewstudents: function(trainingAccessCode){
            var lang = $cookies.lang ? $cookies.lang.substring(0,2) : 'ru';
            $window.open(StcAppSetting.user + '/text/' + lang + '/ordernewstudents/'+trainingAccessCode,'_blank');
        }
    }
});
  

// ===============================================================================================================================
// File: 42. services/SettingsSrvc.js
// ===============================================================================================================================
'use strict';
//dddвd

/*===========================================================================================
Settings service for google, mail
===========================================================================================*/

servicesModule.factory('SettingsSrvc', function(DALSrvc) {
	return {
	    getGoogle: function(type){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/settings/google/' + type, null);
        },
        getMail: function(type){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/settings/mail/' + type, null);
        },
        getMailPreview: function(type){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/settings/mail/preview/' + type, null);
        },
        getGooglePreview: function(type){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/settings/google/preview/' + type, null);
        },
        saveGoogle: function(obj, type){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/settings/google/' + type, obj);
        },
        saveMail: function(obj, type){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/settings/mail/' + type, obj);
        }
    }
});
  

// ===============================================================================================================================
// File: 43. services/MailingSrvc.js
// ===============================================================================================================================
'use strict';
//ddff

/*===========================================================================================
Группы и участники рассылки
===========================================================================================*/

servicesModule.factory('MailingSrvc', function(DALSrvc) {
	return {
        getAllGroupsForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, other){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       other: other};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/mailing/group/grid', obj);
        },
        getAllGroupItemsForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, other){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       other: other};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/mailing/group/item/grid', obj);
        },
        saveGroup: function(group){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/mailing/group', group);
        },
        saveGroupItem: function(item){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/mailing/group/item', item);
        },
        createSubscription: function(item){
            return DALSrvc.getPromise('save', StcAppSetting.user + '/json/mailing/subscription', item);
        },
        updateSubscription: function(item, code){
            return DALSrvc.getPromise('save', StcAppSetting.user + '/json/mailing/subscription/' + code, item);
        },
        removeSubscription: function(code){
            return DALSrvc.getPromise('delete', StcAppSetting.user + '/json/mailing/subscription/' + code, null);
        },
        confirmSubscription: function(code){
            return DALSrvc.getPromise('save', StcAppSetting.user + '/json/mailing/subscription/confirmation/' + code, null);
        },
        getGroupItemByAccessCode: function(code){
            return DALSrvc.getPromise('get', StcAppSetting.user + '/json/mailing/subscription/' + code, null);
        },
        getGroup: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/mailing/group/' + id, null);
        },
        getGroups: function(){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/mailing/group', null);
        },
        getGroupItem: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/mailing/group/item/' + id, null);
        },
        getGroupContacts: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/mailing/group/' + id + '/contact', null);
        },
        getGroupMail: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/mailing/group/' + id + '/mail', null);
        },
        removeGroup: function(id){
	   		    return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/mailing/group/' + id, null);
	    },
        removeGroupItem: function(id){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/mailing/group/item/' + id, null);
        },
        sendEMail: function(data){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/mailing/mail/send', data);
        },
        changeMailingStatus: function(status){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/mailing/status/' + status, null);
        },
        getMailingStatus: function(){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/mailing/status', null);
        },
        getAllJournalPartsForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/mailing/journal/parts/grid', obj);
        },
        getAllJournalItemsForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, other){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       other: other};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/mailing/journal/grid', obj);
        },
        removeJournalItem: function(id){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/mailing/journal/' + id, null);
        },
        removeJournalPart: function(groupNumber){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/mailing/journal/part/' + groupNumber, null);
        }

    }
});
  

// ===============================================================================================================================
// File: 44. directives/stcalert.js 
// ===============================================================================================================================
'use strict';
//sddddddd

directivesModule.directive('stcalert', function(){
    return {
        replace: true,
        restrict: 'E',
        templateUrl: 'components/stcalert.csp',
        
        scope: {
            data: '=',
            spanRight: '@',
            spanMiddle: '@',
            spanLeft: '@'
        },
        controller: function($scope, $timeout){           
           if (!$scope.data)
           		$scope.data = {visible: false};
           
           $scope.close = function(){
	           $scope.data.visible = false;
               if ($scope.data.closeMethod) {
                    $scope.data.closeMethod();
               }
	       };
	       
	       $scope.$watch('data.visible', function(){
                if ($scope.data.visible && $scope.data.cssClass == 'alert alert-success'){
                    $timeout(function(){$scope.close()}, 3200);        
                }     
           });
	   	}
    }
});

// ===============================================================================================================================
// File: 45. directives/stcalertlabel.js 
// ===============================================================================================================================
'use strict';
//sdddddddddd

directivesModule.directive('stcalertlabel', function(){
    return {
        replace: true,
        restrict: 'E',
        templateUrl: 'components/stcalertlabel.csp',
        
        scope: {
            data: '='
        },
        controller: function($scope, $timeout){           
           $scope.data = {visible: false};
           
	       
	       $scope.$watch('data', function(){
                if ($scope.data && $scope.data.visible && $scope.data.cssClass == 'success'){
                     $timeout(function(){
                      $scope.data.visible=false;
                    }, 2000);       
                }  
           });
	   	}
    }
});

// ===============================================================================================================================
// File: 46. directives/stctraining.js 
// ===============================================================================================================================
'use strict';
//dddddddddd

directivesModule.directive('stctraining', function(){
    return {
        replace: true,
        restrict: 'E',
        templateUrl: 'components/stctraining.csp',
        
        scope: {
            training: '=',
            dateStart: '=',
            dateFinish: '=',
            editMode: '=',
            formName: '=',
            btnAdditionVisible: '=',
            btnAdditionName: '=',
            btnAdditionAction: '&'
        },
        controller: function($scope, $filter, TrainingSrvc, RegionSrvc, CourseTeacherSrvc, YandexSrvc, DALSrvc, PersonSrvc, UtilsSrvc){
            $scope.init = function(){
                $scope.courses = [];
                $scope.cities = [];
                $scope.teachers = [];
                $scope.yandex = {results:[]};
            
                if ($scope.editMode){
                    $scope.btnSubmitName = 'Сохранить';
                    //
                }
                else{
                    $scope.btnSubmitName = 'Создать';
                    $scope.addressCheck(false, false, true);   
                }

                $scope.loadCourses();
            };

            $scope.$watch('training.isLoaded', function(){
                if ($scope.training && $scope.training.isLoaded){
                    $scope.yandex.results.push($scope.training.address);
                    $scope.addressCheck(false, true, false);
                }
            }, true);

            $scope.addressCheck = function(msg, select, btn){
                $scope.addressMsg = msg;
                $scope.addressSelect = select;
                $scope.addressBtn = btn;
            };

            $scope.findAddress = function(){
                var searchStr = $scope.training.city.greatParentName + ', ' + $scope.training.city.parentName + ', ' + $scope.training.city.name + ', ' + $scope.training.street;
                
                YandexSrvc.getResult(searchStr).then(
                    function(data){
                       
                        $scope.yandex.results =[];
                        for(var i=0; i < data.response.GeoObjectCollection.featureMember.length; i++){
                            $scope.yandex.results.push(
                                {point: UtilsSrvc.getPropertyValue(data.response.GeoObjectCollection.featureMember[i], 'GeoObject.Point.pos'),
                                 title: UtilsSrvc.getPropertyValue(data.response.GeoObjectCollection.featureMember[i], 'GeoObject.name')});
                            //title: UtilsSrvc.getPropertyValue(data.response.GeoObjectCollection.featureMember[i], 'GeoObject.metaDataProperty.GeocoderMetaData.text')
                        }

                        if ($scope.yandex.results.length != 0){
                            $scope.training.address = $scope.yandex.results[0];
                            $scope.addressCheck(false, true, false);
                        }
                        else{
                            $scope.addressCheck(true, false, false);
                        }

                    },
                    function(response){
                        console.log(response);
                    });
            };

            $scope.changeTimeMode = function(timeType){
                switch($scope.training[timeType]){
                    case 'a.m.':
                    {
                        $scope.training[timeType] = 'p.m.';
                        break;
                    }
                    case 'p.m.':
                    {
                        $scope.training.timeStartType = '24';
                        $scope.training.timeFinishType = '24';
                        break;
                    }
                    case '24':
                    {
                        $scope.training[timeType] = 'a.m.';
                        break;
                    }
                }
            };
            
            $scope.$watch('training.timeStartType', function(){
                if ($scope.training.timeStartType != '24')
                    $scope.training.timePattern = '([0-9]|0[0-9]|1[0-2]|2[0-2]):[0-5][0-9]';
                else
                    $scope.training.timePattern = '([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]';
            }, true);
            
            
            // Подгрузить курсы 
            $scope.loadCourses = function(){
                CourseTeacherSrvc.getAll(-1).then(
                    function(data){
                        $scope.courses = data;
                    },
                    function(response){
                        $scope.alert = UtilsSrvc.getAlert('Ошибка!', response.data, 'error', true);
                    }); 
            };

            $scope.$watch('training.course', function(){
                if (!$scope.training || !$scope.training.course || !$scope.training.course.id)
                    return;

                CourseTeacherSrvc.getTeachers($scope.training.course.id).then(
                    function(data){
                        $scope.teachers = data;
                        if (!$scope.editMode && data && data.length != 0)
                            $scope.training.teacher = data[0];
                    },
                    function(response){
                        $scope.alert = UtilsSrvc.getAlert('Ошибка !', response.data, 'error', true);
                    }); 
            }, true);

            // Подгружать города по набору
            $scope.loadCities = function(startsWith){
                $scope.addressCheck(false, false, true);
                   
                if(!startsWith || startsWith.length == 0)
                    $scope.cities = [];
                
                if (!startsWith || startsWith.length != 2)
                    return;  

                RegionSrvc.getAllCitiesStartsWith(startsWith).then(
                    function(data){
                        $scope.cities = data;
                    },
                    function(response){
                        $scope.alert = UtilsSrvc.getAlert('Ошибка !', response.data, 'error', true);
                    }); 
            };


            $scope.formatDate = function(){
                $scope.training.dateStart = UtilsSrvc.getValidDate($scope.dateStart);
                $scope.training.dateFinish = UtilsSrvc.getValidDate($scope.dateFinish);
                
                if ($scope.training.dateStart == "")
                    $scope.dateStart = "";

                if ($scope.training.dateFinish == "")
                    $scope.dateFinish = "";

                
            };
            
            
            $scope.openTeacherPayoutDialog = function(){
                var doAfterLoadPayout = function(data){              
                    var buttons = [
                        {
                            result: '1',
                            label: $filter('localize')('Подтвердить сумму'),
                            cssClass: 'btn-small btn-primary',
                            func : function(){
                                        $scope.training.payout = data.PRound;
                                        $scope.formName.$setDirty();
                                   }
                        },
                        {
                            result: '0',
                            label: $filter('localize')('Отмена'),
                            cssClass: 'btn-small',
                            func : null
                        }];
                    
                    var getLocValue = function(key){
                        return $filter('localize')(key)
                    };
                    
                    var msg = 
                    "<b>" + getLocValue("Формула расчета") +":</b><br>"+
                    "<b>P = Y * x * v * h</b>, " + getLocValue("где") + " <b>Y = 1 + (y1 - 1) + (y2 - 1) + (y3 - 1)</b><br>" +            
                    "<b>v</b> - " + getLocValue("стоимость нормочаса обучения") + ";<br>" +
                    "<b>x</b> - " + getLocValue("коэф. сложности курса") + "; <br>" +
                    "<b>h</b> - " + getLocValue("продолжительность курса в часах") + ";<br>" +
                    "<b>y1</b> - " + getLocValue("количество обучений любых курсов этого преподавателя за последний год до обучения. Изменяется от 0.8 до 1.1 с шагом 0.1.") + "<br>" +
                    "<b>y2</b> - " + getLocValue("опыт проведения именно этого курса за всё время. Изменяется от 0.75 до 1.25 c шагом 0.05.") + "<br>" +
                    "<b>y3</b> - " + getLocValue("рейтинг преподавателя по отзывам слушателей (средняя оценка по курсу). Коэффициент меняется от 0.9 до 1.1 в пропорции.") + "<br>" +
                    "<b>" + getLocValue("Результат") + ":</b><br>";
                    
                    msg += 
                    "P = " + data.P + " = " + data.Y + " * " + data.x + " * " + data.v + " * " + data.h + ".<br>" +
                    "Y = " + data.Y + " = 1 + (" + data.y1 + " - 1) + (" + data.y2 + " - 1) + (" + data.y3 + " - 1)"; 
                        
                    UtilsSrvc.openCustomMessageBox(getLocValue('Сумма выплаты преподавателю') + ': ' + $filter('number')(data.PRound) + ', ' + data.currency, msg, buttons);
                };
                
                TrainingSrvc.getTeacherPayout($scope.training.id, $scope.training.teacher.id).then(
                    function(data){
                        doAfterLoadPayout(data);
                    },
                    function(response){
                    });     
            };

            $scope.init();
        }
    }
});

// ===============================================================================================================================
// File: 47. directives/stcgrid.js 
// ===============================================================================================================================
'use strict';
//ddd
   
directivesModule.directive('stcgrid', function(){
    return {
        replace: true,
        restrict: 'E',
        templateUrl: 'components/stcgrid.csp',
        
        scope: {
            grid: '=',

            tableClass: '@',
            caption: '@',

            columns: '=',
            items: '=',
            properties: '=',
            updateItems: '&',
            pageCurr: '=',
            pageSize: '=',
            pageTotal: '=',
            navigatorVisible: '=',
            searchHide: '=',
            searchTop: '=',
            
            selectable: '=',
            selectedItems: '=',
            multiSelectMode: '=',
            onSelect: '&',
            onSelectCell: '&',

            actionColumnVisible: '=',
            actionColumnIcon: '=',
            actionColumnTitle: '=',
            actionColumnMethod: '&',

            firstRowActionIcon: '=',
            firstRowActionTitle: '=',
            firstRowActionMethod: '&',

            secondRowActionIcon: '=',
            secondRowActionTitle: '=',
            secondRowActionMethod: '&',

            forciblyUpdate: '='
        },
        controller: function($scope, $filter, $cookieStore, UtilsSrvc){
            $scope.searchText = '';
            $scope.searchedColumn = {};
            
            var idxSearch = UtilsSrvc.getIndexes($scope.columns, 'isSearched', true);
            if (idxSearch.length != 0) 
                $scope.searchedColumn = $scope.columns[idxSearch[0]];
            
            var idxSort = UtilsSrvc.getIndexes($scope.columns, 'isSorted', true);
            if (idxSort.length != 0) 
                $scope.sortedColumn = $scope.columns[idxSort[0]];

            // Отключить кнопки навигации, если достигли последней стриницы, первой и тп
            $scope.checkNavigatorButtons = function(){
                
                if ($scope.pageCurr == 1){
                    $scope.firstPageDisabled = true;
                    $scope.prevPageDisabled = true;
                }
                else{
                    $scope.firstPageDisabled = false;
                    $scope.prevPageDisabled = false;   
                }
                
                if ($scope.pageCurr == $scope.pageTotal){
                    $scope.lastPageDisabled = true;
                    $scope.nextPageDisabled = true;   
                }
                else{
                    $scope.lastPageDisabled = false;
                    $scope.nextPageDisabled = false;   
                }                
            };

            $scope.checkPageTotal = function(){
                
                if (parseInt($scope.pageCurr) > parseInt($scope.pageTotal) && parseInt($scope.pageTotal) != 0){
                    $scope.pageCurr = $scope.pageTotal;
                    $scope.updateSource();
                }

                $scope.checkNavigatorButtons();
            };

            $scope.$watch('pageCurr', $scope.checkNavigatorButtons);
            $scope.$watch('pageTotal', $scope.checkPageTotal);
            
            // Вкл/Выкл мультиселекта в таблице
            $scope.$watch('multiSelectMode', function(){
                if (!$scope.selectedItems || $scope.selectedItems.length == 0){
                    $scope.selectedItems = [];
                    return;
                }    

                for(var i=1; i < $scope.selectedItems.length; i++)
                    $scope.selectedItems[i].rowClass = '';

                $scope.selectedItems = [$scope.selectedItems[0]];
            });

            $scope.$watch('items', function(){
                if (!$scope.selectedItems || $scope.selectedItems.length == 0)
                    return;
                
                for(var i=0; i < $scope.items.length; i++){
                    var idx = UtilsSrvc.getIndexes($scope.selectedItems, 'id', $scope.items[i].id);
                    if (idx.length != 0){
                        $scope.items[i].rowClass = $scope.selectedItems[0].rowClass;
                        $scope.selectedItems[idx[0]] = $scope.items[i];
                    }
                }
            });

            $scope.getRowClass = function(rowClass){
                //if ($scope.selectable)
                    return rowClass;
               // return '';
            };


            // Установить текущую страницу
            $scope.setPage = function(incr){
                $scope.pageCurr += incr;
                $scope.updateSource();

                $scope.grid.pageCurr = $scope.pageCurr;
            };

            // Установить размер страницы
            $scope.setPageSize = function(value){
                $scope.pageSize = value;
                $scope.updateSource();

                $scope.grid.pageSize = $scope.pageSize;
            };

            // Выбор столбца для сортировки
            $scope.sort = function(column, isDown){ 
                if (!$scope.selectable || !column.isSortable)
                    return;

                if ($scope.sortedColumn){
                    $scope.sortedColumn.isSorted = false;
                }

                column.isSorted = true;
                column.isDown = !isDown;
                $scope.sortedColumn = column;

                $scope.updateSource();
            };

            // Выбор строки
            $scope.select = function(item, property){
                if (!$scope.selectable || property.cellSelectable)
                    return;
                 
                item.rowClass = 'info';
                var idx = UtilsSrvc.getIndexes($scope.selectedItems, 'id', item.id);
                
                if (idx.length != 0){
                    $scope.selectedItems.splice(idx[0], 1);
                    item.rowClass = '';
                    $scope.onSelect({item: null});
                }
                else if ($scope.multiSelectMode){
                    $scope.selectedItems.push(item);
                    $scope.onSelect({item: item});
                }
                else if ($scope.selectedItems.length > 0){
                    $scope.selectedItems[0].rowClass = '';
                    $scope.selectedItems = [item];
                    $scope.onSelect({item: item});
                }
                else{
                    $scope.selectedItems = [item];
                    $scope.onSelect({item: item});
                }
            };


            $scope.selectCell = function(item, property){
                if (!property.cellSelectable)
                    return;

                if (item && property && $scope.onSelectCell)
                    $scope.onSelectCell({item: item, property: property});   
            };


            // Клик по ячейки - действие для строки
            $scope.actionRow = function(item){
                if ($scope.firstActionMode){
                    $scope.secondRowActionMethod({item: item});
                }
                else{
                    $scope.firstRowActionMethod({item: item});   
                }
            };
            
            // Обновить данные - вызов внешнего метода
            $scope.updateSource = function(){
               //console.log('$scope.updateSource'); 
               if (!$scope.sortedColumn){
                    var idx = UtilsSrvc.getIndexes($scope.columns, 'isSorted', true);
                    
                    if (idx.length != 0){
                        $scope.sortedColumn = $scope.columns[idx[0]];
                    }
                }
                
                $scope.updateItems({pageCurr: parseInt($scope.pageCurr), 
                                    pageSize: parseInt($scope.pageSize), 
                                    sqlName: $scope.sortedColumn.sqlName, 
                                    isDown: $scope.sortedColumn.isDown,
                                    searchSqlName: $scope.searchedColumn.sqlName,
                                    searchText: $scope.searchText}); 
            };

            // Получит значение для поля .prop1.pro1_1.porp1_1_1 и тд
            $scope.getPropertyValue = function(item, property){
                if (property.calculate)
                    property.calculate(item);

                var value = UtilsSrvc.getPropertyValue(item, property.name);
              
                if (property.filter)
                    value = $scope.getFilteredValue(value, property.filter, property.filterParam);

                return value;
            } 

            // Фильтрация даты
            $scope.getFilteredValue = function(value, filter, filterParam){
                if (filter == 'date'){
                    value = $filter('convertCacheDate')(value, filterParam);
                }
                else if (filter == 'time' && value && value.length >= 5){
                    value = value.substring(0, 5);
                }
                else if (filter == 'bool' && filterParam && filterParam.length == 2){
                    value = value == 1 ? filterParam[0]: filterParam[1];
                }

                return value;
            };

            // Выбор столбца для поиска
            $scope.selectSearchColumn = function(column){
                if ($scope.searchedColumn)
                    $scope.searchedColumn.isSearched = false;
    
                $scope.searchedColumn = column;
                $scope.searchedColumn.isSearched = true;
            };
    
            // Поиск
            $scope.search = function(){
                if (!$scope.searchedColumn)
                    return;
                $scope.updateSource();
            };

            $scope.getCountOfVisibleColumns = function(columns){
                var visibleCount = 0;
                for(var i=0; i < columns.length; i++)
                    if (!columns[i].hidden)
                        visibleCount++;
                
                if ($scope.grid && $scope.grid.hideNumbersColumn){
                    visibleCount--;
                }
                    
                return visibleCount;
            };
            
            // Принудительное обновление при смене значения извне
            $scope.$watch('forciblyUpdate', function(){
                if ($scope.forciblyUpdate > 0)
                    $scope.updateSource();
            });
        }
    }
});

// ===============================================================================================================================
// File: 48. directives/stcperson.js 
// ===============================================================================================================================
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

// ===============================================================================================================================
// File: 49. directives/stcschedule.js 
// ===============================================================================================================================
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

// ===============================================================================================================================
// File: 50. directives/stccompany.js
// ===============================================================================================================================
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

// ===============================================================================================================================
// File: 51. directives/linkbuilder.js    
// ===============================================================================================================================
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

// ===============================================================================================================================
// File: 52. localization/filter.js
// ===============================================================================================================================
'use strict';
//
/*===========================================================================================
Фильтр и общая настройка для заголовков
===========================================================================================*/

localizationModule.filter('localize', function(StcDictionary) {
    return function(input) {
	    //console.log('call localize');  
        return StcDictionary.getTranslate(input);
    }
});


servicesModule.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.defaults.headers.common['Accept-Language'] = StcAppSetting.lang.substring(0,2);
}]);

// ===============================================================================================================================
// File: 53. filters/cacheDate.js
// ===============================================================================================================================
//d

filterModule.filter('convertCacheDate', function($filter) {
    return function(input, filterParams, isUTC) {
        var result;

        try{
	        //if (isUTC){
	        	
	        //}
	        
            var dateTime = input.split(' ');
            var date = dateTime[0].split('-');
            
            if (dateTime.length == 1){
            	result = $filter('date')(new Date(date[0], date[1]-1, date[2]), filterParams);
            }
            else{
                //var time = dateTime[1].split(':');
                //result = $filter('date')(new Date(date[0], date[1]-1, date[2], time[0], time[1], time[2]), filterParams);
            	return $filter('date')(new Date(input.replace(/-/g,"/")+' UTC'), filterParams)
            }
        }
        catch (ex){
            result = input;
        }

        return result;
    }
});
