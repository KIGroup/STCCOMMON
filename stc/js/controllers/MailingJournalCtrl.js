'use strict';
//jddd
  
/*===========================================================================================
Журнал рассылок
===========================================================================================*/

controllersModule.controller('MailingJournalCtrl', function($scope, MailingSrvc, $filter, UtilsSrvc){
    $scope.grMailTable = {grid:{}};
    $scope.allMailTable = {grid:{}};
    $scope.menu.selectMenu('mailingJournal');


    $scope.init = function(){
        //
        // Вкладка "Сгруппированные письма"
        // 
        $scope.grMailTable.columns = [
                          {name: 'Дата создания', sqlName: '', isSorted: true, isSortable: false, isDown: false, isSearched: false, isSearchable: false, captionStyle: {width: '190px'}},
                          {name: 'Отправлено писем', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Тип рассылки', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Тема письма', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Содержание', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false}];
        
        $scope.grMailTable.properties = [
                          {name: 'createdTS', filter: 'date', filterParam: $filter('localize')('d MMMM y, HH:mm:ss')},
                          {name: 'grStatus', 
                          calculate: function(item){
                                item.grStatus = item.sendedCount + " из " + item.recipientsCount;
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
                                                                             
        $scope.grMailTable.pageSize = 10;
        $scope.grMailTable.pageCurr = 1;
        $scope.grMailTable.itemsTotal = 0;
        $scope.grMailTable.selectedItems = [];
        $scope.grMailTable.multiSelectMode = false;
        $scope.grMailTable.forciblyUpdate = 0;

    
        //
        // Вкладка "Все письма"
        // 
        $scope.allMailTable.columns = [
                          {name: 'Дата отправки', sqlName: 'ID', isSorted: true, isSortable: false, isDown: false, isSearched: false, isSearchable: false, captionStyle: {width: '190px'}},
                          {name: 'Получатель', sqlName: 'RecipientName', isSorted: false, isSortable: false, isDown: true, isSearched: true, isSearchable: true},
                          {name: 'Тип рассылки', sqlName: 'Type', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Тема письма', sqlName: 'Subject', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Содержание', sqlName: 'Message', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true}];
        
        $scope.allMailTable.properties = [
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
                                                                             
        $scope.allMailTable.pageSize = 10;
        $scope.allMailTable.pageCurr = 1;
        $scope.allMailTable.itemsTotal = 0;
        $scope.allMailTable.selectedItems = [];
        $scope.allMailTable.multiSelectMode = false;
        $scope.allMailTable.forciblyUpdate = 0;
    };

    $scope.grMailTable.refresh = function(){
        $scope.grMailTable.forciblyUpdate++;  
    };

    $scope.grMailTable.selectTab = function(){
        $scope.allMailTable.refresh();  
    };

    $scope.allMailTable.refresh = function(){
        $scope.allMailTable.forciblyUpdate++;  
    };


    // Загрузить сгруппированные элементы журнала
    $scope.grMailTable.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        MailingSrvc.getAllJournalPartsForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText).then(
            function(data){
                $scope.grMailTable.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.grMailTable.itemsTotal = data.itemsTotal;
                $scope.grMailTable.items = data.items;
                
            },
            function(response){
                $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Удалить всю группу 
    $scope.grMailTable.remove = function(item){
        MailingSrvc.removeJournalPart(item.groupNumber).then(
            function(data){
                $scope.alert = UtilsSrvc.getAlert('Готово!', 'Записи удалены.', 'success', true);
                if ($scope.grMailTable.selectedItems.length !=0 && item.groupNumber == $scope.grMailTable.selectedItems[0].groupNumber){
                    $scope.grMailTable.selectedItems = [];
                }
                
                $scope.grMailTable.refresh();
            },
            function(response){
                $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
 
    $scope.$watch('grMailTable.selectedItems[0]', function(){
        if ($scope.grMailTable.selectedItems && $scope.grMailTable.selectedItems.length > 0){
            $scope.allMailTable.tabCaption = "Все письма выбранной группы";
        }
        else{
            $scope.allMailTable.tabCaption = "Все письма";
        }
    }, true);


    // Загрузить элементы журнала
    $scope.allMailTable.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        var groupNumber = null;
        if ($scope.grMailTable.selectedItems && $scope.grMailTable.selectedItems.length > 0 && $scope.grMailTable.selectedItems[0]){
            groupNumber = $scope.grMailTable.selectedItems[0].groupNumber;
        }

        MailingSrvc.getAllJournalItemsForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, {groupNumber: groupNumber}).then(
            function(data){
                $scope.allMailTable.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.allMailTable.itemsTotal = data.itemsTotal;
                $scope.allMailTable.items = data.items;
            },
            function(response){
                $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Изменить статус рассылки
    $scope.changeMailingStatus = function(status){
        MailingSrvc.changeMailingStatus(status).then(
            function(data){
                $scope.mailingStatus = data.status;
                
                if (data.status == "On"){
                    $scope.alert = UtilsSrvc.getAlert('Готово!', 'Отправка писем возобновлена', 'success', true);
                }
                else{
                    $scope.alert = UtilsSrvc.getAlert('Готово!', 'Отправка писем прекращена', 'info', true);
                }
            },
            function(response){
                $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Загрузить статус рассылки 
    $scope.loadMailingStatus = function(){
        MailingSrvc.getMailingStatus().then(
            function(data){
                $scope.mailingStatus = data.status;
            },
            function(response){
                $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
 
    // Удалить запись 
    $scope.allMailTable.remove = function(item){
        MailingSrvc.removeJournalItem(item.id).then(
            function(data){
                $scope.alert = UtilsSrvc.getAlert('Готово!', 'Запись удалена.', 'success', true);
                if ($scope.allMailTable.selectedItems.length !=0 && item.id == $scope.allMailTable.selectedItems[0].id){
                    $scope.allMailTable.selectedItems = [];
                }
                
                $scope.allMailTable.forciblyUpdate++;
            },
            function(response){
                $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    $scope.init();
    $scope.grMailTable.refresh();
    $scope.loadMailingStatus();

/*
    $scope.allMailTable = {grid:{}};
    $scope.menu.selectMenu('mailingJournal');

    $scope.allMailTable.init = function(){
        $scope.allMailTable.columns = [
                          {name: 'Дата отправки', sqlName: 'ID', isSorted: true, isSortable: false, isDown: false, isSearched: false, isSearchable: false, captionStyle: {width: '190px'}},
                          {name: 'Получатель', sqlName: 'RecipientName', isSorted: false, isSortable: false, isDown: true, isSearched: true, isSearchable: true},
                          {name: 'Тип рассылки', sqlName: 'Type', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Тема письма', sqlName: 'Subject', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Содержание', sqlName: 'Message', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: true}];
        
        $scope.allMailTable.properties = [
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
                                                                             
        $scope.allMailTable.pageSize = 10;
        $scope.allMailTable.pageCurr = 1;
        $scope.allMailTable.itemsTotal = 0;
        $scope.allMailTable.selectedItems = [];
        $scope.allMailTable.multiSelectMode = false;
        $scope.allMailTable.forciblyUpdate = 0;
        $scope.allMailTable.forciblyUpdate++;
    };

    // Загрузить элементы журнала
    $scope.allMailTable.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        MailingSrvc.getAllJournalItemsForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText).then(
            function(data){
                $scope.allMailTable.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.allMailTable.itemsTotal = data.itemsTotal;
                $scope.allMailTable.items = data.items;
                
                if ($scope.allMailTable.selectedItems && $scope.allMailTable.items && $scope.allMailTable.selectedItems.length == 0 && $scope.allMailTable.items.length != 0){
                    $scope.allMailTable.selectedItems[0] = $scope.allMailTable.items[0];
                    $scope.allMailTable.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.allMailTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Изменить статус рассылки
    $scope.allMailTable.changeMailingStatus = function(status){
        MailingSrvc.changeMailingStatus(status).then(
            function(data){
                $scope.allMailTable.mailingStatus = data.status;
                $scope.allMailTable.forciblyUpdate++;
                
                if (data.status == "On"){
                	$scope.allMailTable.alert = UtilsSrvc.getAlert('Готово!', 'Отправка писем возобновлена', 'success', true);
                }
                else{
	                $scope.allMailTable.alert = UtilsSrvc.getAlert('Готово!', 'Отправка писем прекращена', 'info', true);
                }
            },
            function(response){
                $scope.allMailTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Загрузить статус рассылки 
    $scope.allMailTable.loadMailingStatus = function(){
        MailingSrvc.getMailingStatus().then(
            function(data){
                $scope.allMailTable.mailingStatus = data.status;
            },
            function(response){
                $scope.allMailTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
 
    // Удалить запись 
    $scope.allMailTable.remove = function(item){
        MailingSrvc.removeJournalItem(item.id).then(
            function(data){
               	$scope.allMailTable.alert = UtilsSrvc.getAlert('Готово!', 'Запись удалена.', 'success', true);
            	if ($scope.allMailTable.selectedItems.length !=0 && item.id == $scope.allMailTable.selectedItems[0].id){
            		$scope.allMailTable.selectedItems = [];
            	}
            	
            	$scope.allMailTable.forciblyUpdate++;
            },
            function(response){
                $scope.allMailTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    $scope.allMailTable.init();
    $scope.allMailTable.loadMailingStatus();
    */
});


