'use strict';
//

/*===========================================================================================
Обучение
===========================================================================================*/

controllersModule.controller('TrainingCtrl', function($scope, $route, $location, $filter, $routeParams, UtilsSrvc, OrderSrvc, ReportSrvc, TrainingSrvc, CompanySrvc, PersonSrvc, CertificateSrvc){    
    if ($scope.menu.admin){
        $scope.menu.brandCaption = 'Система учёта курсов';
        $scope.menu.appTitle = 'Система учёта курсов';
    }
        
    $scope.training = {};
    $scope.sgroup = {contract:{}, grid: {}};
    $scope.cert = {};
    $scope.feedBack = {};
    $scope.newstud = {};
    $scope.student = {grid:{}};
    $scope.allstud = {};
    $scope.other = {email:{}};

    if (!$scope.pageStore.training || $scope.pageStore.training.id != $routeParams.id)
        $scope.pageStore.training = {id: $routeParams.id, tabSgActive: false, tabSgStActive: false, tabAllStudActive: false, tabCertsActive: false, tabNewStudActive: false};

    $scope.pageStore.trainingCertificates = {grid:{}};
    $scope.pageStore.newstud = {grid:{}};
    $scope.pageStore.feedBack = {grid:{}};
    $scope.pageStore.allstud = {grid:{}};

    $scope.other.init = function(){
        //============================== ПОДГРУППЫ ==========================================================================
            $scope.sgroup.columns = [
                          {name: 'Плательщик', sqlName: 'SubGroups->Payer->ShortName->Value', isSorted: true,  isSortable: true, isDown: true, isSearched: true,  isSearchable: true},
                          {name: 'Слушатели', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '80px'}},
                          {name: 'Сумма к оплате',sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '140px'}},
                          {name: 'Валюта', sqlName: 'SubGroups->Currency->Name->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true, captionStyle: {textAlign: 'center', width: '150px'}}];
                          
        $scope.sgroup.properties = [
                          {name:'payer.shortName'}, 
                          {name:'students.length', cellStyle: {textAlign: 'center'}}, 
                          {name:'amount', cellStyle: {textAlign: 'center'}}, 
                          {name:'currency.name', cellStyle: {textAlign: 'center'}}];
        $scope.sgroup.pageSize = 10;
        $scope.sgroup.pageCurr = 1;
        $scope.sgroup.itemsTotal = 0;
        $scope.sgroup.selectedItems = [];
        $scope.sgroup.multiSelectMode = false;
        $scope.sgroup.forciblyUpdate = 0;

        //$scope.sgroup.loadCurrencies();
        
        //============================== СЕРТИФИКАТЫ ==========================================================================
        $scope.cert.columns = [
                          {name: 'Курс', sqlName: 'Training->Course->Name->Value', isSorted: false, isSortable: true, isDown: true, isSearched: true, isSearchable: true},
                          {name: 'Номер', sqlName: 'Number', isSorted: true, isSortable: true, isDown: true, isSearched: false, isSearchable: true, captionStyle: {textAlign: 'center', width: '80px'}},
                          {name: 'Слушатель', sqlName: 'Student->LastName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Организация', sqlName: '', isSorted: false, isSortable: false,isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Дата создания', sqlName: 'CreatedDate', isSorted: false, isSortable: true, isDown: false, isSearched: false, isSearchable: false, filter: 'date'},
                          {name: 'Статус', sqlName: 'isPrinted', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true, captionStyle: {textAlign: 'center', width: '100px'}}];
        
        $scope.cert.properties = [{name:'training.course.nameString', 
                                  calculate: function(item){
                                                item.training.course.nameString = item.training.course.name;
                                                
                                                if (item.training.course.name.length >= 30){
                                                    item.training.course.nameString = item.training.course.nameString.substring(0,30) + '...';
                                                }
                                             }
                                  }, 
                                  {name:'number', cellStyle: {textAlign: 'center'}},
                                  {name:'student.fullName', 
                                  calculate: function(item){
                                                item.student.fullName = item.student.lastName + ' ' + item.student.firstName + ' ' + item.student.middleName;
                                  }}, 
                                  {name:'student.company.shortNameString', 
                                  calculate: function(item){
                                                item.student.company.shortNameString = item.student.company.shortName;
                                                
                                                if (item.student.company.shortName.length >= 40){
                                                    item.student.company.shortNameString = item.student.company.shortNameString.substring(0,40) + '...';
                                                }
                                             }
                                  },
                                  {name:'date', filter: 'date', filterParam: $filter('localize')('d MMMM y')}, 
                                  {name:'status', cellStyle: {textAlign: 'center'},
                                  getCssClass: function(item){
                                                return 'label ' + (item.isPrinted == 0 ? 'label-important' : 'label-success');
                                              }, 
                                  calculate: function(item){
                                                item.status = item.isPrinted == 1 ? $filter('localize')('Распечатан') : $filter('localize')('Не распечатан');
                                  }}];

        $scope.cert.pageSize = UtilsSrvc.getPropertyValue($scope.pageStore, 'trainingCertificates.grid.pageSize', 15);
        $scope.cert.pageCurr = UtilsSrvc.getPropertyValue($scope.pageStore, 'trainingCertificates.grid.pageCurr', 1);
        $scope.cert.itemsTotal = 0;
        $scope.cert.selectedItems = [];
        $scope.cert.multiSelectMode = false;
        $scope.cert.forciblyUpdate = 0;
        $scope.cert.actionColumnVisible = true;

        //$scope.cert.forciblyUpdate++; 

        //============================== ОТЗЫВЫ =======================================================================================
        $scope.feedBack.columns = [
                          {name: 'Автор', sqlName: 'Author', isSorted: false, isSortable: true, isDown: true, isSearched: true, isSearchable: false, captionStyle: {textAlign: 'center', width: '200px'}},
                          {name: 'Ср. оценка курса', sqlName: 'AvgCourseRating', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center'}},
                          {name: 'Ср. оценка преподавателя', sqlName: 'AvgInstructorRating', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true, captionStyle: {textAlign: 'center'}},
                          {name: 'Дата создания', sqlName: 'CreatedTS', isSorted: true, isSortable: true, isDown: false, isSearched: false, isSearchable: false, filter: 'date', captionStyle: {width: '180px'}}];
 
        $scope.feedBack.properties = [
                                     {name: 'author'},
                                     {name: 'avgCourseRating', cellStyle: {textAlign: 'center'}}, 
                                     {name: 'avgInstructorRating', cellStyle: {textAlign: 'center'}},
                                     {name: 'createdTS', filter: 'date', filterParam: $filter('localize')('d MMMM y, HH:mm:ss')}];

        $scope.feedBack.pageSize = UtilsSrvc.getPropertyValue($scope.pageStore, 'feedBack.grid.pageSize', 10);
        $scope.feedBack.pageCurr = UtilsSrvc.getPropertyValue($scope.pageStore, 'feedBack.grid.pageCurr', 1);
        $scope.feedBack.itemsTotal = 0;
        $scope.feedBack.selectedItems = [];
        $scope.feedBack.multiSelectMode = false;
        $scope.feedBack.forciblyUpdate = 0;

        //============================== НОВЫЕ СЛУШАТЕЛИ ==========================================================================
        $scope.newstud.columns = [
                          {name: 'Фамилия', sqlName: 'LastName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: true, isSearchable: true},
                          {name: 'Имя', sqlName: 'FirstName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Отчество', sqlName: 'MiddleName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Организация', sqlName: 'Company->ShortName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Email', sqlName: 'Email', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Телефон', sqlName: 'Phone', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Skype', sqlName: 'Skype', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Дата создания', sqlName: 'CreatedTS', isSorted: true, isSortable: true, isDown: false, isSearched: false, isSearchable: false, filter: 'date'}];

        $scope.newstud.properties = [{name:'lastName'}, 
                                     {name:'firstName'},
                                     {name:'middleName'}, 
                                     {name:'company.shortName'},
                                     {name:'email'},
                                     {name:'phone'},
                                     {name:'skype'},
                                     {name:'createdTS', filter: 'date', filterParam: $filter('localize')('d MMMM y, HH:mm:ss')}];

        $scope.newstud.pageSize = UtilsSrvc.getPropertyValue($scope.pageStore, 'newstud.grid.pageSize', 10);
        $scope.newstud.pageCurr = UtilsSrvc.getPropertyValue($scope.pageStore, 'newstud.grid.pageCurr', 1);
        $scope.newstud.itemsTotal = 0;
        $scope.newstud.selectedItems = [];
        $scope.newstud.multiSelectMode = false;
        $scope.newstud.forciblyUpdate = 0;
        $scope.newstud.actionColumnVisible = true;

        //$scope.newstud.forciblyUpdate++;
        
        //============================== СТУДЕНТЫ ПОДГРУППЫ ==========================================================================
        $scope.student.columns = [{name: 'Фамилия'}, {name: 'Имя'}, {name: 'Отчество'}, {name: 'Организация'}, {name: 'Email'}, {name: 'Телефон'}, {name: 'Skype'}];
        $scope.student.properties = [{name:'lastName'}, {name:'firstName'}, {name:'middleName'}, {name:'company.shortName'}, {name:'email'}, {name:'phone'}, {name:'skype'}];
        $scope.student.pageSize = 100;
        $scope.student.pageCurr = 1;
        $scope.student.itemsTotal = 0;
        $scope.student.selectedItems = [];
        $scope.student.multiSelectMode = false; 
     

        //============================== ВСЕ СТУДЕНТЫ ==========================================================================
        $scope.allstud.columns = [
                          {name: 'ФИО', sqlName: 'FullName', isSorted: false, isSortable: true, isDown: true, isSearched: true, isSearchable: true},
                          {name: 'Организация', sqlName: 'Student->Company->ShortName->Value', isSorted: true, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Email', sqlName: 'Student->Email', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Телефон', sqlName: 'Student->Phone', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Skype', sqlName: 'Student->Skype', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: false},
                          {name: 'Посещал курсы', sqlName: '', isSorted: false, isSortable: false, isDown: true,  isSearched: false,  isSearchable: false, captionStyle: {textAlign: 'center', width: '150px'}}];

        $scope.allstud.properties = [
            {name:'lastName',
                calculate: function(item){
                    item.fullName = $scope.getFullNameForCurLang(item.lastName, item.firstName, item.middleName);
                },}, 
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
                   
                   TrainingSrvc.updateStudentAttendedStatus($scope.training.data.accessCode, item.id, newCode).then(
                        function(data){
                            $scope.allstud.forciblyUpdate++;
                        },
                        function(response){
                            $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                        });
               }}
        ];
            
        $scope.allstud.pageSize = 15;
        $scope.allstud.pageCurr = 1;
        $scope.allstud.itemsTotal = 0;
        $scope.allstud.selectedItems = [];
        $scope.allstud.multiSelectMode = false;
        $scope.allstud.forciblyUpdate = 0;
    };



    // Загрузить обучение по ИД
    $scope.training.loadData = function(id){
        TrainingSrvc.get(id).then(
            function(data){
                $scope.training.data = data;

                $scope.training.dateStart = data.dateStart;
                $scope.training.dateFinish = data.dateFinish;
                $scope.training.data.isCertificatesDone = data.isCertificatesDone == 1;
                $scope.training.data.isPublic = data.isPublic == 1;
                
                if (data.isCompleted == 0){
                    $scope.training.btnAdditionName = 'Завершить';
                      $scope.training.btnAdditionVisible = true;
                }
                else{
                    $scope.training.btnAdditionVisible = false;
                }
                
                $scope.training.btnAdditionAction = $scope.training.complete;  
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Обновить данные обучения
    $scope.training.save = function(){
        TrainingSrvc.save($scope.training.data).then(
            function(data){
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Изменения сохранены.', 'success', true);
                $scope.trainingForm.$setPristine();
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Завершить обучение и создать сертификаты
    $scope.training.complete = function(){
        function complete (){
          TrainingSrvc.complete($scope.training.data.id).then(
              function(data){
                  $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Обучение завершено.', 'success', true);
                  $route.reload();
              },
              function(response){
                  $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
              });
        }

         UtilsSrvc.openMessageBox('Завершение обучения', $filter('localize')("Завершить обучение и создать сертификаты для слушателей?"), complete);  
    };

    //===============================================================================================================================================================================
    // GROUP                                                                                                                                                                    GROUP
    //===============================================================================================================================================================================
    // Загрузить подгруппы
    $scope.sgroup.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        //console.log('msg: sgroup.loadItems');
        TrainingSrvc.getSubGroupsForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $routeParams.id).then(
            function(data){
                $scope.sgroup.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.sgroup.itemsTotal = data.itemsTotal;
                $scope.sgroup.items = data.items;
                $scope.training.data.sgroups = data.itemsTotal;

                if ($scope.sgroup.selectedItems && $scope.sgroup.items && $scope.sgroup.selectedItems.length == 0 && $scope.sgroup.items.length != 0){
                    $scope.sgroup.selectedItems[0] = $scope.sgroup.items[0];
                    $scope.sgroup.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Загрузить валюты
    $scope.sgroup.loadCurrencies = function(){
        //console.log('msg: sgroup.loadCurrencies');
        TrainingSrvc.getCurrencies().then(
            function(data){
                $scope.sgroup.currencies = data;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Сохранить платеж
    $scope.sgroup.savePayment = function(){
        TrainingSrvc.saveSubGroupPayment({id: $scope.sgroup.selectedItems[0].id, 
                                          currencyId: $scope.sgroup.selectedItems[0].currency.id, 
                                          amount: $scope.sgroup.selectedItems[0].amount,
                                          discount: $scope.sgroup.selectedItems[0].discount=='' ? 0: $scope.sgroup.selectedItems[0].discount}).then(
            function(data){
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Платеж для подгруппы сохранен.', 'success', true);
                $scope.sgPaymentForm.$setPristine();
                $scope.sgroup.modalPaymentVisible = false;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });  
    };
    
    // Изменение величины скидки на обучение
    $scope.sgroup.changeDiscount = function(){
        if ($scope.sgroup.selectedItems[0].discount <= 100 && $scope.sgroup.selectedItems[0].discount >= 0){
            $scope.sgroup.selectedItems[0].amount = ($scope.training.data.cost.price - $scope.training.data.cost.price * ($scope.sgroup.selectedItems[0].discount / 100)).toFixed(2) * 1;    
        }
        else{
            $scope.sgroup.selectedItems[0].amount = $scope.sgroup.selectedItems[0].amountReal; 
        }
    };

    // Сохранить данные договора
    $scope.sgroup.saveContract = function(){
        TrainingSrvc.saveSubGroupContract($scope.sgroup.contract).then(
            function(data){
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Данные договора сохранены.', 'success', true);
                $scope.sgContractForm.$setPristine();
                $scope.sgroup.forciblyUpdate++;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });  
    };


    // Открыть модальное окно для платежа
    $scope.sgroup.openPaymentModal = function(){
        $('#PaymentModal').modal('show');
        $scope.sgroup.modalPaymentVisible = true;
    };
    
    // Отмена изменений платежа
    $scope.sgroup.cancelPayment = function(){
        if ($scope.sgPaymentForm.$pristine){
            $scope.sgroup.modalPaymentVisible = false;    
        }
        $scope.sgroup.forciblyUpdate++;
        $scope.sgPaymentForm.$setPristine();
    };

    // Отслеживание выбранной подгруппы
    $scope.$watch('sgroup.selectedItems[0].id', function(){
        if ($scope.sgroup.selectedItems.length != 0){
            $scope.sgroup.contract = $scope.sgroup.selectedItems[0].contract;
            $scope.sgroup.dateSt = $scope.sgroup.contract.dateStart;
            $scope.sgroup.dateFn = $scope.sgroup.contract.dateFinish;

            if ($scope.sgroup.selectedItems[0].amount == $scope.training.data.cost.price && $scope.sgroup.selectedItems[0].currency.id == $scope.training.data.cost.currency.id){
                $scope.sgroup.selectedItems[0].discount = 0;
            }
        }
        
        if (!$scope.sgPaymentForm.$dirty)
            return;

        $scope.sgroup.forciblyUpdate++;
        $scope.sgPaymentForm.$setPristine();
    },true);

    // При изменении валюты в выбранной подгруппе
    $scope.$watch('sgroup.selectedItems[0].currency.id', function(){ 
        if (!$scope.sgroup.selectedItems[0])
            return;
            
        var idx = UtilsSrvc.getIndexes($scope.sgroup.currencies, 'id', $scope.sgroup.selectedItems[0].currency.id)
        
        if (idx.length == 0)
            return;
        
        $scope.sgroup.selectedItems[0].currency.name = $scope.sgroup.currencies[idx[0]].name;
    },true);

  

    // Удалить подгруппу из обучения
    $scope.sgroup.remove = function(item){
        function deleteSGroup(){
            TrainingSrvc.deleteSubGroup($scope.training.data.id, item.id).then(
                function(data){
                    $scope.sgroup.selectedItems = [];
                    $scope.sgroup.forciblyUpdate++;
                    $scope.allstud.forciblyUpdate++;
                    $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Подгруппа удалена.', 'success', true);
                },
                function(response){
                    $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });  
        };

        UtilsSrvc.openMessageBox('Удалить подгруппу', $filter('localize')("Удалить подгруппу плательщика") + ' ' + item.payer.shortName + "?", deleteSGroup);  
    };

    // Открыть модальное окно для создания новой подгруппы
    $scope.sgroup.add = function(){
        $('#AddSubGroupModal').modal('show');
        $scope.sgroup.modalAddSubGroupVisible = true;

        if (!$scope.sgroup.companies || $scope.sgroup.companies.length == 0)
            $scope.sgroup.loadCompanies();
    };
    
    // Добавить подгруппу в обучение
    $scope.sgroup.addSubGroup = function(){
        $scope.sgroup.modalAddSubGroupVisible = false;
        
        TrainingSrvc.createSubGroup($scope.training.data.id, {payerId: $scope.sgroup.newSubGroupPayer ? $scope.sgroup.newSubGroupPayer.id : ''}).then(
            function(data){
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Подгруппа добавлена.', 'success', true);
                $scope.sgroup.forciblyUpdate++;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });  
    };

    /* Подгрузить имена компаний */
    $scope.sgroup.loadCompanies = function(){
        //console.log('msg: sgroup.loadCompanies');
        CompanySrvc.getAll().then(
            function(data){
                $scope.sgroup.companies = data;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };


    // Перейти на страницу для добавления слушателя в подгруппу
    $scope.student.add = function(){
        $location.path('/training/' + $scope.training.data.id + '/subgroup/' + $scope.sgroup.selectedItems[0].id + '/student');
    };
    
    // Перейти на страницу для редактирования слушателя в подгруппу
    $scope.student.edit = function(item){
        $location.path('/training/' + $scope.training.data.id + '/student/' + item.id);
    };

    // Удалить слушателя из подгруппы
    $scope.student.remove = function(item){
        function deleteSGroupStudent(){
            TrainingSrvc.deleteStudent($scope.training.data.id, item.id).then(
                function(data){
                    $scope.sgroup.forciblyUpdate++;
                    $scope.allstud.forciblyUpdate++;
                    $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Слушатель удален из обучения.', 'success', true);
                },
                function(response){
                    $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });  
        };

        UtilsSrvc.openMessageBox('Удалить слушателя', $filter('localize')("Удалить слушателя") + ' ' + item.lastName + "?", deleteSGroupStudent);   
    };

    // Отформатировать данные перед отправкой формы
    $scope.sgroup.formatData = function(){
        $scope.sgroup.contract.dateStart = UtilsSrvc.getValidDate($scope.sgroup.dateSt);
        if ($scope.sgroup.contract.dateStart == "")
            $scope.sgroup.dateSt = "";

        $scope.sgroup.contract.dateFinish = UtilsSrvc.getValidDate($scope.sgroup.dateFn);
        if ($scope.sgroup.contract.dateFinish == "")
            $scope.sgroup.dateFn = "";

        $scope.sgroup.contract.city = $scope.training.data.city;
        $scope.sgroup.contract.id = $scope.sgroup.selectedItems[0].id;
    };

    $scope.sgroup.selectTab = function(){
        if (!$scope.sgroup.items || $scope.sgroup.items.length==0)
            $scope.sgroup.forciblyUpdate++;

        if (!$scope.sgroup.currencies || $scope.sgroup.currencies.length==0)
            $scope.sgroup.loadCurrencies();
    };



    //===============================================================================================================================================================================
    // CERTIFICATES                                                                                                                                                      CERTIFICATES
    //===============================================================================================================================================================================
    // Загрузка сертификатов
    $scope.cert.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        //console.log('msg: cert.loadItems');
        TrainingSrvc.getCertificates(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $routeParams.id).then(
            function(data){
                $scope.cert.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.cert.itemsTotal = data.itemsTotal;
                $scope.cert.items = data.items;
                $scope.training.data.certificates = $scope.cert.itemsTotal;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Сменить статус печати
    $scope.cert.print = function(item){
         CertificateSrvc.print(item.number).then(
            function(data){
                //$scope.cert.alert = UtilsSrvc.getAlert('Готово!', 'Статус сертификата изменен.', 'success', true);
                $scope.cert.forciblyUpdate++;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Удалить сертификат
    $scope.cert.remove = function(item){
        function removeCert(){
           CertificateSrvc.remove(item.number).then(
              function(data){
                  $scope.cert.forciblyUpdate++;
                  $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Сертификат удалён.', 'success', true);
              },
              function(response){
                  $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
              });
        };

        UtilsSrvc.openMessageBox('Удалить сертификат', $filter('localize')("Удалить сертификат слушателя") + " '" + item.student.lastName + "'?", removeCert); 
    };


    // Экспорт сертификатов
    $scope.cert.exportToCSV = function(){
        ReportSrvc.certificates($scope.training.data.id);
    };
    
    // Отправка в офис
    $scope.cert.sendToOffice = function(){
        function send(){
            CertificateSrvc.sendToOffice($scope.training.data.id).then(
            function(data){
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Письма добавлены в очередь, проверьте журнал рассылок', 'success', true);
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
        };

        UtilsSrvc.openMessageBox('Рассылка писем', $filter('localize')("Выполнить рассылку списка сертификатов участникам группы \"Офис\" ?"), send);  
    };

    // Создать все сертификаты
    $scope.cert.createAll = function(){
         TrainingSrvc.createCertificates($routeParams.id).then(
            function(data){
                $scope.cert.forciblyUpdate++;
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Сертификаты обновлены.', 'success', true);
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    $scope.cert.selectTab = function(){
        if (!$scope.cert.items || $scope.cert.items.length==0)
            $scope.cert.forciblyUpdate++;
    };    



    //===============================================================================================================================================================================
    // NEW ORDERS                                                                                                                                                          NEW ORDERS     
    //===============================================================================================================================================================================
    // Загрузка новых слушателей
    $scope.newstud.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        //console.log('msg: newstud.loadItems');
        OrderSrvc.getAllOrdersNewStudentForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $routeParams.id).then(
            function(data){
                $scope.newstud.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.newstud.itemsTotal = data.itemsTotal;
                $scope.newstud.items = data.items;
                $scope.training.data.newStudents = data.itemsTotal;

                if ($scope.newstud.selectedItems && $scope.newstud.items && $scope.newstud.selectedItems.length == 0 && $scope.newstud.items.length != 0){
                    $scope.newstud.selectedItems[0] = $scope.newstud.items[0];
                    $scope.newstud.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Удалить заявку
    $scope.newstud.remove = function(item){
        function removeOrd(){
           OrderSrvc.deleteOrderNewStudent(item.id).then(
              function(data){
                  $scope.newstud.forciblyUpdate++;
                  $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Заявка от слушателя удалена.', 'success', true);
              },
              function(response){
                  $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
              });
        };

        UtilsSrvc.openMessageBox('Удалить заявку', $filter('localize')("Удалить заявку от слушателя") + " '" + item.lastName + "'?", removeOrd); 
    };

    // Вызов при каждом выборе студента
    $scope.$watch('newstud.selectedItems[0].id', function(){
        if ($scope.newstud.selectedItems.length == 0)
            return;

        PersonSrvc.getByEmail($scope.newstud.selectedItems[0].email).then(
            function(data){
                $scope.newstud.conflict = data;
            },
            function(response){
                $scope.newstud.conflict = {};
            });
    },true);

    // Добавление слушателя из заявки в обучение
    $scope.newstud.addIntoTraining = function(type){
        TrainingSrvc.addNewStudentIntoTraining({orderId: $scope.newstud.selectedItems[0].id, trainingId: $scope.training.data.id, type: type}).then(
                function(data){
                    $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Слушатель из заявки добавлен в обучение.', 'success', true);
                    $scope.newstud.forciblyUpdate++;
                    $scope.sgroup.forciblyUpdate++;
                    $scope.allstud.forciblyUpdate++;
          
                    $scope.newstud.selectedItems = [];
                },
                function(response){
                    $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                    $scope.newstud.forciblyUpdate++;
                    $scope.sgroup.forciblyUpdate++;
                    $scope.allstud.forciblyUpdate++;
          
                    $scope.newstud.selectedItems = [];
                });
    };

    // Открыть диалог смены компании в заявке
    $scope.other.openChangeCompanyDialog = function(){
        if (!$scope.sgroup.companies || $scope.sgroup.companies.length == 0)
            $scope.sgroup.loadCompanies();
        
        $('#ChangeCompanyModal').modal('show');
        $scope.other.modalChangeCompanyVisible = true;
    };

    // Изменение компании в заявке
    $scope.other.changeCompany = function(){
        $scope.other.modalChangeCompanyVisible = false;
        if (!$scope.other.newOrderCompany || !$scope.other.newOrderCompany.id)
            return;
        
        OrderSrvc.changeOrderNewStudentCompany($scope.newstud.selectedItems[0].id, $scope.other.newOrderCompany.id).then(
                function(data){
                    $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Произошла смена организации в заявке.', 'success', true);
                    $scope.newstud.forciblyUpdate++;
                },
                function(response){
                    $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
    };

    // Переход на страницу создания компании
    $scope.other.createCompany = function(){
        $location.path('/company').search({ordernewstudent: $scope.newstud.selectedItems[0].id});
    };


    $scope.newstud.selectTab = function(){
        if (!$scope.newstud.items || $scope.newstud.items.length==0)
            $scope.newstud.forciblyUpdate++;
    };    



    //============================================================================================================================================================================
    // ALL STUDENTS                                                                                                                                                   ALL STUDENTS  
    //============================================================================================================================================================================
    // Загрузить всех слушателей
    $scope.allstud.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        //console.log('msg: allstud.loadItems');
        TrainingSrvc.getStudentsForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $routeParams.id).then(
            function(data){
                $scope.allstud.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.allstud.itemsTotal = data.itemsTotal;
                $scope.allstud.items = data.items;
                $scope.training.data.students = data.itemsTotal;

                if ($scope.allstud.selectedItems && $scope.allstud.items && $scope.allstud.selectedItems.length == 0 && $scope.allstud.items.length != 0){
                    $scope.allstud.selectedItems[0] = $scope.allstud.items[0];
                    $scope.allstud.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Перейти на страницу для добавления слушателя в подгруппу
    $scope.allstud.add = function(){
        $location.path('/training/' + $scope.training.data.id + '/student');
    };
    
    // Перейти на страницу для редактирования слушателя в подгруппу
    $scope.allstud.edit = function(item){
        $location.path('/training/' + $scope.training.data.id + '/student/' + item.id);
    };

    // Удалить слушателя из подгруппы
    $scope.allstud.remove = function(item){
        function deleteTrainingStudent(){
            TrainingSrvc.deleteStudent($scope.training.data.id, item.id).then(
                function(data){
                    $scope.sgroup.forciblyUpdate++;
                    $scope.allstud.forciblyUpdate++;
                    $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Слушатель удален из подгруппы.', 'success', true);
                },
                function(response){
                    $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });  
        };

        UtilsSrvc.openMessageBox('Удалить слушателя', $filter('localize')("Удалить слушателя") + ' ' + item.lastName + "?", deleteTrainingStudent);   
    };

    $scope.allstud.onSelect = function(item){     
        
    };

    $scope.allstud.onSelectCell = function(item, property){
        if (!item) return;

        property.onClickCell(item);
    };
    
    $scope.allstud.selectTab = function(){
        if (!$scope.allstud.items || $scope.allstud.items.length==0)
            $scope.allstud.forciblyUpdate++;
    };    

    //===========================================================================================================================================================================
    // Google Calendar                                                                                                                                            Google Calendar
    //===========================================================================================================================================================================
    // Load event by id or if id==null -> generate
    $scope.training.loadEvent = function(){
       TrainingSrvc.doEvent({method: "get", id: $routeParams.id}).then(
            function(data){
                data.event.description = data.event.description.replace(/<br>/g, "\n");
                $scope.training.eventData = data;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Create event
    $scope.training.createEvent = function(){
       TrainingSrvc.doEvent({method: "create", id: $routeParams.id, event:  $scope.training.eventData.event}).then(
            function(data){
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Событие создано.', 'success', true);
                $scope.training.eventData.event.exists = 1;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Update event
    $scope.training.updateEvent = function(){
       TrainingSrvc.doEvent({method: "update", id: $routeParams.id, event:  $scope.training.eventData.event}).then(
            function(data){
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Событие обновлено.', 'success', true);
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Delete event
    $scope.training.deleteEvent = function(){
        function deleteEvent(){
           TrainingSrvc.doEvent({method: "delete", id: $routeParams.id}).then(
                function(data){
                    $scope.training.loadEvent();      
                    $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Событие удалено.', 'success', true);
                },
                function(response){
                    $scope.training.loadEvent();      
                    $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Событие удалено.', 'success', true);
                });
        };

        UtilsSrvc.openMessageBox('Удалить событие', "Удалить событие из календаря?", deleteEvent);   
    };


    //==============================================================================================================================================================================
    // Automailing                                                                                                                                                       Automailing
    //==============================================================================================================================================================================
    // Load all students emails
    $scope.mailing = {};

    // Delete email from recipient field
    $scope.mailing.deleteEmailContact = function(contact){
        var idx = UtilsSrvc.getIndexes($scope.mailing.selectedGroup.contacts, 'id', contact.id);
                
        if (idx.length != 0)
            $scope.mailing.selectedGroup.contacts.splice(idx[0], 1);
    };

     // Send email to training students or custom student (single email)
    $scope.mailing.sendEmail = function(isSingleEmail){
        var contacts = [];

        if (isSingleEmail){
            contacts = [{name: '', email: $scope.mailing.single}];
        }
        else{
            contacts = $scope.mailing.selectedGroup.contacts;
        }

        if (contacts.length == 0){
            $scope.other.alert = UtilsSrvc.getAlert('Внимание!', 'Выберите получателей письма.', 'error', true);
            return;
        }

        var promise = TrainingSrvc.sendEmail({
            isSubscribers: $scope.mailing.selectedGroup.isSubscribers,
            contacts: contacts,
            subject: $scope.mailing.selectedGroup.mail.subject,
            message: $scope.mailing.selectedGroup.mail.message.replace(/\n/g, "<br>")
        });
    
        promise.then(
            function(data){
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Письма добавлены в очередь, проверьте журнал рассылок', 'success', true);
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

 
    // Off\On Automailing for training 
    $scope.mailing.changeStatus = function(){
        //console.log('msg: mailing.changeStatus');
      
        TrainingSrvc.changeStatusAutoMailing({id: $scope.training.data.id, isAutoMailing: $scope.mailing.selectedGroup.isAutoMailing, groupId: $scope.mailing.selectedGroup.id}).then(
            function(data){
                $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Изменения сохранены.', 'success', true);
              
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };


    // Select tab "Mailing"
    $scope.mailing.selectTab = function(){
        TrainingSrvc.getMailingGroups($scope.training.data.id).then(
            function(data){
                $scope.mailing.groups = data.mGroups;

                if (data.mGroups.length != 0){
                    if ($scope.mailing.selectedGroup){
                        var idx = UtilsSrvc.getIndexes($scope.mailing.groups, 'id', $scope.mailing.selectedGroup.id);         
                        if (idx.length != 0){
                            $scope.mailing.selectedGroup = data.mGroups[idx[0]];
                        }
                        else{
                            $scope.mailing.selectedGroup = data.mGroups[0];  
                        }
                    }
                    else{
                        $scope.mailing.selectedGroup = data.mGroups[0];
                    }
                }

                for (var i=0; i < $scope.mailing.groups.length; i++){
                    $scope.mailing.groups[i].isAutoMailing = $scope.mailing.groups[i].isAutoMailing == 1;
                    $scope.mailing.groups[i].mail.message = $scope.mailing.groups[i].mail.message.replace(/<br>/g, "\n");
                    
                    var contacts = $scope.mailing.groups[i].contacts;
                    
                    if (contacts.length > 30){
                        $scope.mailing.groups[i].contactsStyle = {
                            height: '130px', 
                            overflowX: 'auto',
                            border: '1px dashed rgb(158, 158, 158)',
                            padding: '4px'
                        };
                    }
                    
                    for (var c=0; c < contacts.length; c++){
                        if (contacts[c].name.length > 20){
                            contacts[c].nameShort = contacts[c].name.substring(0, 17) + '...'
                        }
                        else{
                            contacts[c].nameShort = contacts[c].name;
                        }
                    }
                }
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    //=============================================================================================================================================================================
    // FeedBacks                                                                                                                                                          FeedBacks
    //=============================================================================================================================================================================
    // Load feedbacks
    $scope.feedBack.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        //console.log('msg: feedBack.loadItems');
        TrainingSrvc.getFeedBacksForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $routeParams.id).then(
            function(data){
                $scope.feedBack.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.feedBack.itemsTotal = data.itemsTotal;
                $scope.feedBack.items = data.items;
                $scope.training.data.feedBacks.count = $scope.feedBack.itemsTotal;
        
                if ($scope.feedBack.selectedItems && $scope.feedBack.items && $scope.feedBack.selectedItems.length == 0 && $scope.feedBack.items.length != 0){
                    $scope.feedBack.selectedItems[0] = $scope.feedBack.items[0];
                    $scope.feedBack.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // Select tab "FeedBacks"
    $scope.feedBack.selectTab = function(){
        $scope.feedBack.forciblyUpdate++;
    };

    // Remove feedback from student
    $scope.feedBack.remove = function(item){
        function deleteFeedBack(){
           TrainingSrvc.deleteFeedBack(item.id).then(
                function(data){
                    $scope.feedBack.selectedItems = [];
                    $scope.feedBack.forciblyUpdate++;    
                    $scope.other.alert = UtilsSrvc.getAlert('Готово!', 'Отзыв удален.', 'success', true);
                },
                function(response){      
                    $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        };

        UtilsSrvc.openMessageBox('Удалить отзыв', "Вы уверены?", deleteFeedBack);   
    };    

    $scope.other.init();
    $scope.training.loadData($routeParams.id);
    
    if (!$scope.menu.admin){
        $scope.menu.brandCaption = 'Система учёта курсов';
        $scope.menu.appTitle = 'Система учёта курсов';
        console.log('training $scope.menu.login();')
        $scope.menu.login(); 
    };
});

