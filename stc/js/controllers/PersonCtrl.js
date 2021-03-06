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

