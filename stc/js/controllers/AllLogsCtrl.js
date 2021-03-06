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


