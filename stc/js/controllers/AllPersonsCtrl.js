'use strict';
//dd

/*===========================================================================================
Все сотрудники
===========================================================================================*/
controllersModule.controller('AllPersonsCtrl', function($scope, $location, $routeParams, $filter, OrderSrvc, PersonSrvc, CertificateSrvc, UtilsSrvc){
    $scope.menu.selectMenu('persons');
    
    if (!$scope.pageStore.persons)
        $scope.pageStore.persons = {grid:{}};

    $scope.personTable = {items:[]};
    $scope.trainingTable = {items:[]};
    $scope.certificateTable = {items:[]};
    $scope.courseTable = {items:[]};
    $scope.teacherStat = {data: {courses:[]}};
    $scope.companyTable = {items:[]};
    $scope.other = {allEmpty: true};

    // Инициализация всех таблиц
    $scope.personTable.init = function(){
        // CERTIFICATES --------------------------
        $scope.certificateTable.columns = [
                          {name: 'Курс'}, 
                          {name: 'Номер', captionStyle: {textAlign: 'center', width: '80px'}}, 
                          {name: 'Дата создания', captionStyle: {width: '150px'}}, 
                          {name: 'Статус', captionStyle: {textAlign: 'center', width: '80px'}}];
        
        $scope.certificateTable.properties = [
                          {name:'course'}, 
                          {name:'number', cellStyle: {textAlign: 'center'}}, 
                          {name:'createdDate', filter: 'date', filterParam: $filter('localize')('d MMMM y', $scope.menu.lang)}, 
                          {name:'status', cellStyle: {textAlign: 'center'}, 
                          getCssClass: function(item){
                                          return 'label ' + (item.isPrinted == 0 ? 'label-important' : 'label-success');             
                                        }, 
                          calculate: function(item){
                                          item.status = item.isPrinted == 1 ? $filter('localize')('Распечатан') : $filter('localize')('Не распечатан');
                                        }}];
        
        // TRAINING --------------------------
        $scope.trainingTable.columns = [
                          {name: 'Курс'}, 
                          {name: 'Город'}, 
                          {name: 'Дата начала / окончания', captionStyle: {textAlign: 'center', width: '200px'}}, 
                          {name: 'Статус', captionStyle: {textAlign: 'center', width: '90px'}}];
        
        $scope.trainingTable.properties = [
                          {name: 'course'}, 
                          {name: 'city'}, 
                          {name: 'dates', cellStyle: {textAlign: 'center'},
                          calculate: function(item){
                                        item.dates = UtilsSrvc.getTwoDate(item.dateStart, item.dateFinish);
                                      }}, 
                          {name: 'status', cellStyle: {textAlign: 'center'},
                          getCssClass: function(item){
                                            return 'label ' + (item.isCompleted == 0 ? 'label-info' : 'label-success');
                          },
                          calculate: function(item){
                                            item.status = item.isCompleted == 1 ? $filter('localize')('Завершено') : $filter('localize')('Не завершено');
                                        }}];
        
        // COURSES --------------------------
        $scope.courseTable.columns = [
                          {name: 'Название'}, 
                          {name: 'Часы', captionStyle: {textAlign: 'center', width: '50px'}}, 
                          {name: 'Дни', captionStyle: {textAlign: 'center', width: '50px'}}];
        
        $scope.courseTable.properties = [
                          {name:'name'}, 
                          {name:'hours', cellStyle: {textAlign: 'center'}},
                          {name:'days', cellStyle: {textAlign: 'center'}}];
                          
        // TEACHER STATISTICS --------------------------
        $scope.teacherStat.columns = [
                          {name: 'Курс'}, 
                          {name: 'Проведено обучений', captionStyle: {textAlign: 'center'}}, 
                          {name: 'Средний балл по отзывам', captionStyle: {textAlign: 'center'}}];
        
        $scope.teacherStat.properties = [
                          {name:'name'}, 
                          {name:'trainingsCount', cellStyle: {textAlign: 'center'}},
                          {name:'avgRating', cellStyle: {textAlign: 'center'}}];
        
        // COMPANIES --------------------------
        $scope.companyTable.columns = [
                          {name: 'Название'}, 
                          {name: 'Юридический адрес'}];
        
        $scope.companyTable.properties = [
                          {name:'shortName'}, 
                          {name:'legalAddress'}];
        
        // PERSONS --------------------------
        $scope.personTable.columns = [
                          {name: 'Фамилия', sqlName: 'LastName->Value', isSorted: true,  isSortable: true, isDown: true, isSearched: true,  isSearchable: true},
                          {name: 'Имя', sqlName: 'FirstName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Отчество', sqlName: 'MiddleName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Организация', sqlName: 'Company->ShortName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Email', sqlName: 'Email', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Телефон', sqlName: 'Phone', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Skype', sqlName: 'Skype', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true}];
        $scope.personTable.properties = [{name:'lastName'}, {name:'firstName'}, {name:'middleName'}, {name:'company.shortName'}, {name:'email'}, {name:'phone'}, {name:'skype'}];
        $scope.personTable.pageSize = parseInt(UtilsSrvc.getPropertyValue($scope.pageStore, 'persons.grid.pageSize', 10));
        $scope.personTable.pageCurr = parseInt(UtilsSrvc.getPropertyValue($scope.pageStore, 'persons.grid.pageCurr', 1));
        $scope.personTable.itemsTotal = 0;
        $scope.personTable.selectedItems = [];
        $scope.personTable.multiSelectMode = false;
        $scope.personTable.forciblyUpdate = 0;
        $scope.personTable.type = UtilsSrvc.getPropertyValue($scope.pageStore, 'persons.grid.type', 'All');
        
        $scope.personTable.loadItems($scope.personTable.pageCurr, $scope.personTable.pageSize, "LastName->Value", true, "", ""); 
    };

    // Загрузить сотрудников
    $scope.personTable.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        PersonSrvc.getAllForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $scope.personTable.type).then(
            function(data){
                $scope.personTable.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.personTable.itemsTotal = data.itemsTotal;
                $scope.personTable.items = data.items;
                                
                if ($scope.personTable.selectedItems && $scope.personTable.items && $scope.personTable.selectedItems.length == 0 && $scope.personTable.items.length != 0){
                    $scope.personTable.selectedItems[0] = $scope.personTable.items[0];
                    $scope.personTable.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.personTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    // При смене тип - фильтра
    $scope.$watch('personTable.type', function(){
        $scope.personTable.forciblyUpdate++;
        $scope.pageStore.persons.grid.type = $scope.personTable.type;
    });
    
    // При выборе сотрудника подгрузить все его связи
    $scope.$watch('personTable.selectedItems[0]', function(){
        if (!$scope.personTable.selectedItems || $scope.personTable.selectedItems.length == 0)
          return;
        
        // Загрузить данные по преподу за всё время
        $scope.teacherStat.loadData($scope.personTable.selectedItems[0].id, null, null);
            
        $scope.other.loads = 0; 
        $scope.other.loadItems($scope.personTable.selectedItems[0].id, 'companyTable', 'getCompanies');
        $scope.other.loadItems($scope.personTable.selectedItems[0].id, 'courseTable', 'getCourses');
        $scope.other.loadItems($scope.personTable.selectedItems[0].id, 'certificateTable', 'getCertificates');
        $scope.other.loadItems($scope.personTable.selectedItems[0].id, 'trainingTable', 'getTrainings');
        
    });

    // Загрузка связи сотрудника
    $scope.other.loadItems = function(id, tableName, funcName){
        $scope[tableName].items = [];
        PersonSrvc[funcName](id).then(
            function(data){
                $scope[tableName].items = data;
                $scope.other.loads++; 
            },
            function(response){
                $scope.personTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                $scope.other.loads++;
            });
    };

    // Определить какая связь есть, ту  вкладку и сделать активной
    $scope.$watch('other.loads', function(){
        if ($scope.other.loads != 4){
            return;
        }
        
        var flag = false;

        if ($scope.teacherStat.data.courses.length > 0 && $scope.teacherStat.active){
            $scope.teacherStat.active = true;
            flag = true;
        }
        else if ($scope.trainingTable.items.length > 0){
            $scope.trainingTable.active = true;
            flag = true;
        }
        else if ($scope.certificateTable.items.length > 0){
            $scope.certificateTable.active = true;
            flag = true;
        }
        else if ($scope.courseTable.items.length > 0){
            $scope.courseTable.active = true;
            flag = true;
        }
        else if ($scope.companyTable.items.length > 0){
            $scope.companyTable.active = true;
            flag = true;
        }

        $scope.other.allEmpty = !flag;

        $scope.other.loads = null;
    }, true);

    // Добавить сотрудника
    $scope.personTable.add = function(){
        $location.path('/person');
    };

    // Ред. сотрудника
    $scope.personTable.edit = function(item){
        $location.path('/person/' + item.id);
    };

    // Удалить сотрудника
    $scope.personTable.remove = function(item){
        function del(){
            PersonSrvc.deleteById($scope.personTable.selectedItems[0].id).then(
                function(data){
                    $scope.personTable.alert = UtilsSrvc.getAlert('Готово!', 'Сотрудник удален.', 'success', true);
                    $scope.personTable.forciblyUpdate++;
                },
                function(response){
                    $scope.personTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        }

        UtilsSrvc.openMessageBox($filter('localize')('Удалить сотрудника') + " '" + item.lastName + "'", "Удалить сотрудника из базы данных?", del);
    };


    // Открыть обучение, в котором есть сотрудник
    $scope.trainingTable.open = function(item){
        $location.path('/training/' + item.id);
    };
    
    // Открыть компанию, контактом которой является сотрудник
    $scope.companyTable.edit = function(item){
        $location.path('/company/' + item.id);
    };
    
    // Открыть курс, который преподает
    $scope.courseTable.edit = function(item){
        $location.path('/course/' + item.id);
    };

    // Изменить статус сертификата сотрудника
    $scope.certificateTable.print = function(item){
        CertificateSrvc.print(item.number).then(
            function(data){
                $scope.other.loadItems($scope.personTable.selectedItems[0].id, 'certificateTable', 'getCertificates');
                $scope.other.loads--;
            },
            function(response){
                $scope.other.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };    

    // Обновить данные статистики препода
    $scope.teacherStat.refreshData = function(){
        if ($scope.personTable.selectedItems.length == 0)
            return;
            
        var dateFrom = UtilsSrvc.getValidDate($scope.teacherStat.data.dateFrom);
        var dateTo = UtilsSrvc.getValidDate($scope.teacherStat.data.dateTo);
        $scope.teacherStat.loadData($scope.personTable.selectedItems[0].id, dateFrom, dateTo);
    };
    
    // Загрузить данные по преподу
    $scope.teacherStat.loadData = function(teacherId, dateFrom, dateTo){
        // Load teacher statisticst if exists
        
        PersonSrvc.getTeacherStatistics(teacherId, dateFrom, dateTo).then(
            function(data){
                $scope.teacherStat.data = data; 
            },
            function(response){
                $scope.teacherStat.data = {courses: []};
                $scope.personTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
    
    $scope.personTable.init();
});

