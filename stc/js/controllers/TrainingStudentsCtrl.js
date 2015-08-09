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

