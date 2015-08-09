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
                 
                item.rowClass = 'success';
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
