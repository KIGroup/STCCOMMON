'use strict';
//jdd

/*===========================================================================================
Журнал рассылок
===========================================================================================*/

controllersModule.controller('MailingJournalCtrl', function($scope, MailingSrvc, $filter, UtilsSrvc){
    $scope.mailTable = {grid:{}};
    $scope.menu.selectMenu('mailingJournal');

    $scope.mailTable.init = function(){
        $scope.mailTable.columns = [
                          {name: 'Дата отправки', sqlName: 'ID', isSorted: true, isSortable: false, isDown: false, isSearched: false, isSearchable: false, captionStyle: {width: '190px'}},
                          {name: 'Получатель', sqlName: 'RecipientName', isSorted: false, isSortable: false, isDown: true, isSearched: true, isSearchable: true},
                          {name: 'Тип рассылки', sqlName: 'Type', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Тема письма', sqlName: 'Subject', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Содержание', sqlName: 'Message', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true}];
        
        $scope.mailTable.properties = [
                          {name: 'sendedStatus',
                          calculate: function(item){
	                      		if (item.isSended){
	                      			item.sendedStatus = $filter('convertCacheDate')(item.sendedTS, $filter('localize')('d MMMM y, HH:mm:ss'));
	                      		}
	                      		else{
	                      			item.sendedStatus = $filter('localize')('В очереди');
		                      	}
	                      }},
                          {name: 'recipient.fullName', 
                          calculate: function(item){
                                if (item.recipient.name != ''){
                                    item.recipient.fullName = item.recipient.name + ' (' + item.recipient.email + ')';   
                                }
                                else{
	                                item.recipient.fullName = item.recipient.email;
                                }
                          }},
                          {name: 'type'},
                          {name: 'subject'},
                          {name: 'messageShort',
                          calculate: function(item){
                                if (item.message.length >= 30){
                                    item.messageShort = item.message.substring(0, 30) + '...';
                                }
                                else{
	                                item.messageShort = item.message;
                                }
                          }}];
                                                                             
        $scope.mailTable.pageSize = 10;
        $scope.mailTable.pageCurr = 1;
        $scope.mailTable.itemsTotal = 0;
        $scope.mailTable.selectedItems = [];
        $scope.mailTable.multiSelectMode = false;
        $scope.mailTable.forciblyUpdate = 0;
        $scope.mailTable.forciblyUpdate++;
    };

    // Загрузить элементы журнала
    $scope.mailTable.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        MailingSrvc.getAllJournalItemsForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText).then(
            function(data){
                $scope.mailTable.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.mailTable.itemsTotal = data.itemsTotal;
                $scope.mailTable.items = data.items;
                
                if ($scope.mailTable.selectedItems && $scope.mailTable.items && $scope.mailTable.selectedItems.length == 0 && $scope.mailTable.items.length != 0){
                    $scope.mailTable.selectedItems[0] = $scope.mailTable.items[0];
                    $scope.mailTable.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.mailTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Изменить статус рассылки
    $scope.mailTable.changeMailingStatus = function(status){
        MailingSrvc.changeMailingStatus(status).then(
            function(data){
                $scope.mailTable.mailingStatus = data.status;
                $scope.mailTable.forciblyUpdate++;
                
                if (data.status == "On"){
                	$scope.mailTable.alert = UtilsSrvc.getAlert('Готово!', 'Отправка писем возобновлена', 'success', true);
                }
                else{
	                $scope.mailTable.alert = UtilsSrvc.getAlert('Готово!', 'Отправка писем прекращена', 'info', true);
                }
            },
            function(response){
                $scope.mailTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Загрузить статус рассылки 
    $scope.mailTable.loadMailingStatus = function(){
        MailingSrvc.getMailingStatus().then(
            function(data){
                $scope.mailTable.mailingStatus = data.status;
            },
            function(response){
                $scope.mailTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
 
    // Удалить запись 
    $scope.mailTable.remove = function(item){
        MailingSrvc.removeJournalItem(item.id).then(
            function(data){
               	$scope.mailTable.alert = UtilsSrvc.getAlert('Готово!', 'Запись удалена.', 'success', true);
            	if ($scope.mailTable.selectedItems.length !=0 && item.id == $scope.mailTable.selectedItems[0].id){
            		$scope.mailTable.selectedItems = [];
            	}
            	
            	$scope.mailTable.forciblyUpdate++;
            },
            function(response){
                $scope.mailTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    $scope.mailTable.init();
    $scope.mailTable.loadMailingStatus();
});


