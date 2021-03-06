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

