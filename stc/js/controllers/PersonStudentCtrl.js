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

