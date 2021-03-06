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


