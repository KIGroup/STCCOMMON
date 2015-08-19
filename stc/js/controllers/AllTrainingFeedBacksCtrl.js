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

