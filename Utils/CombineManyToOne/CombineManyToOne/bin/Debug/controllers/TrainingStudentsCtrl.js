'use strict';
//ddddddddddded

/*===========================================================================================

===========================================================================================*/

controllersModule.controller('TrainingStudentsCtrl', function($scope, $location, $filter, $routeParams, UtilsSrvc, ReportSrvc, TrainingSrvc){
    $scope.menu.hide=true;
    $scope.menu.brandCaption = $filter('localize')('Система учёта курсов');
    $scope.menu.appTitle = $scope.menu.brandCaption;
    $scope.page = {training:{}, studTable:{}};
    if (!$scope.pageStore.trstudents)
        $scope.pageStore.trstudents = {grid:{}};
    
    $scope.page.init = function(){
        $scope.page.studTable.columns = [
                          {name: 'Фамилия',       sqlName: 'Students->LastName->Value',           isSorted: false, isSortable: true, isDown: true,  isSearched: true,   isSearchable: true},
                          {name: 'Имя',           sqlName: 'Students->FirstName->Value',          isSorted: false, isSortable: true, isDown: true,  isSearched: false,  isSearchable: false},
                          {name: 'Отчество',      sqlName: 'Students->MiddleName->Value',         isSorted: false, isSortable: true, isDown: true,  isSearched: false,  isSearchable: false},
                          {name: 'Организация',      sqlName: 'Students->Company->ShortName->Value', isSorted: true,  isSortable: true, isDown: true,  isSearched: false,  isSearchable: true},
                          {name: 'Email',         sqlName: 'Students->Email',                     isSorted: false, isSortable: true, isDown: true,  isSearched: false,  isSearchable: true},
                          {name: 'Телефон',       sqlName: 'Students->Phone',                     isSorted: false, isSortable: true, isDown: true,  isSearched: false,  isSearchable: true},
                          {name: 'Skype',         sqlName: 'Students->Skype',                     isSorted: false, isSortable: true, isDown: true,  isSearched: false,  isSearchable: false}];

        $scope.page.studTable.properties = [{name:'lastName'}, {name:'firstName'}, {name:'middleName'}, {name:'company.shortName'}, {name:'email'}, {name:'phone'}, {name:'skype'}];
        $scope.page.studTable.pageSize = 15;
        $scope.page.studTable.pageCurr = 1;
        $scope.page.studTable.itemsTotal = 0;
        $scope.page.studTable.selectedItems = [];
        $scope.page.studTable.multiSelectMode = false;
        $scope.page.studTable.forciblyUpdate = 0;

        $scope.page.loadTraining();
        $scope.page.studTable.forciblyUpdate++;
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

    /* Подгрузить обучение */
    $scope.page.loadTraining = function(){
        TrainingSrvc.getForUser($routeParams.id).then(
            function(data){
                $scope.page.training = data;
            },
            function(response){
                $scope.ordForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Export all students to file
    $scope.page.exportToCSV = function(){
        ReportSrvc.students($routeParams.code);
    };

    $scope.page.init();
});

