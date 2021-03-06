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

