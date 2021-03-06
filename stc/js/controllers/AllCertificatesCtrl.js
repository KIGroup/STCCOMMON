'use strict';
//ddd

/*===========================================================================================
Все сертификаты
===========================================================================================*/

controllersModule.controller('AllCertificatesCtrl', function($scope, $filter, $location, UtilsSrvc, CertificateSrvc){
    $scope.menu.selectMenu('certificates');;

    if (!$scope.pageStore.certificates)
        $scope.pageStore.certificates = {grid:{}};

    $scope.cert = {};

    $scope.cert.init = function(){
        $scope.cert.columns = [
                          {name: 'Курс', sqlName: 'Training->Course->Name->Value', isSorted: false, isSortable: true, isDown: true,  isSearched: true, isSearchable: true},
                          {name: 'Номер', sqlName: 'Number', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true, captionStyle: {textAlign: 'center', width: '80px'}},
                          {name: 'Слушатель', sqlName: 'Student->LastName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Дата создания', sqlName: 'CreatedDate', isSorted: true,  isSortable: true, isDown: false, isSearched: false, isSearchable: false, filter: 'date', captionStyle: {width: '150px'}},
                          {name: 'Статус', sqlName: 'isPrinted', isSorted: false, isSortable: true, isDown: true,  isSearched: false, isSearchable: true, captionStyle: {textAlign: 'center', width: '80px'}}];
        
        $scope.cert.properties = [{name:'training.course.name'}, 
                                  {name:'number', cellStyle: {textAlign: 'center'}},
                                  {name:'student.fullName', 
                                  calculate: function(item){
                                      item.student.fullName = $scope.getFullNameForCurLang(item.student.lastName, item.student.firstName, item.student.middleName);
                                  }}, 
                                  {name:'date', filter: 'date', filterParam: $filter('localize')('d MMMM y')}, 
                                  {name:'status', cellStyle: {textAlign: 'center'},
                                  getCssClass: function(item){
                                                return 'label ' + (item.isPrinted == 0 ? 'label-important' : 'label-success');
                                              }, 
                                  calculate: function(item){
                                                item.status = item.isPrinted == 1 ? $filter('localize')('Распечатан') : $filter('localize')('Не распечатан');
                                  }}];

        $scope.cert.status = UtilsSrvc.getPropertyValue($scope.pageStore, 'certificates.status', 'All');
        $scope.cert.pageSize = UtilsSrvc.getPropertyValue($scope.pageStore, 'certificates.grid.pageSize', 10);
        $scope.cert.pageCurr = UtilsSrvc.getPropertyValue($scope.pageStore, 'certificates.grid.pageCurr', 1);
        $scope.cert.itemsTotal = 0;
        $scope.cert.selectedItems = [];
        $scope.cert.multiSelectMode = false;
        $scope.cert.forciblyUpdate = 0;
        $scope.cert.actionColumnVisible = true;
    };

    // Загрузка сертификатов
    $scope.cert.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        CertificateSrvc.getAllForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $scope.cert.status).then(
            function(data){
                $scope.cert.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.cert.itemsTotal = data.itemsTotal;
                $scope.cert.items = data.items;

                if ($scope.cert.selectedItems && $scope.cert.items && $scope.cert.selectedItems.length == 0 && $scope.cert.items.length != 0){
                    $scope.cert.selectedItems[0] = $scope.cert.items[0];
                    $scope.cert.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.cert.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Сменить статус печати
    $scope.cert.print = function(item){
         CertificateSrvc.print(item.number).then(
            function(data){
                $scope.cert.alert = UtilsSrvc.getAlert('Готово!', 'Статус сертификата изменен.', 'success', true);
                $scope.cert.forciblyUpdate++;
            },
            function(response){
                $scope.cert.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Удалить сертификат
    $scope.cert.remove = function(item){
        function removeCert(){
           CertificateSrvc.remove(item.number).then(
              function(data){
                  $scope.cert.forciblyUpdate++;
                  $scope.cert.alert = UtilsSrvc.getAlert('Готово!', 'Сертификат удалён.', 'success', true);
              },
              function(response){
                  $scope.cert.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
              });
        };

        UtilsSrvc.openMessageBox('Удалить сертификат', $filter('localize')("Удалить сертификат слушателя") + " '" + item.student.lastName + "'?", removeCert); 
    };

    $scope.$watch('cert.status', function(){
        $scope.cert.forciblyUpdate++;
        $scope.pageStore.certificates.status = $scope.cert.status;
    });

	  $scope.cert.init();
});

