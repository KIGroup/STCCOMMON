'use strict';
//вdddddddddsd

/*===========================================================================================
Все курсы + преподаватели курсов
===========================================================================================*/

controllersModule.controller('AllCoursesCtrl', function($scope, $location, $window, $filter, CourseTeacherSrvc, PersonSrvc, UtilsSrvc){
    $scope.menu.selectMenu('courses');

    if (!$scope.pageStore.courses)
        $scope.pageStore.courses = {grid:{}};

    $scope.courseTable = {};
    $scope.teacherTable = {};

    $scope.courseTable.init = function(){
        $scope.courseTable.columns = [
                          {name: 'Курс', sqlName: 'Name->Value', isSorted: true, isSortable: true, isDown: true, isSearched: true, isSearchable: true},
                          {name: 'Часы', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '50px'}},
                          {name: 'Дни', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '50px'}},
                          {name: 'К. сложности', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '100px'}},
                          {name: 'Программа курса', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '150px'}},
                          {name: 'Стоимость', sqlName: 'Price', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '80px'}},
                          {name: 'Валюта', sqlName: '', isSorted: false, isSortable: false, isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center'}}];
        
        $scope.courseTable.status = UtilsSrvc.getPropertyValue($scope.pageStore, 'courses.status', 1);
        $scope.courseTable.properties = [{name:'name'}, 
                                         {name:'hours', cellStyle: {textAlign: 'center'}}, 
                                         {name:'days', cellStyle: {textAlign: 'center'}}, 
                                         {name:'difCoef', cellStyle: {textAlign: 'center'}}, 
                                         {name:'programUrlShort', cellSelectable: true, cellStyle: {textAlign: 'center'},
                                         calculate: function(item){
                                                        item.programUrlShort = $filter('localize')('Просмотр');
                                                    },
                                         getCssClass: function(item){ 
                                                    return 'cellLink';
                                                },  
                                         onClickCell: function(item){
                                                    $window.open('http://' + item.programUrl, '_blank');
                                                }},
                                         {name:'priceStr', cellStyle: {textAlign: 'center'},
                                         calculate: function(item){
                                            item.priceStr = $filter('number')(item.price);
                                         }},
                                         {name:'currency.name', cellStyle: {textAlign: 'center'}}];
                                                                             
        $scope.courseTable.pageSize = UtilsSrvc.getPropertyValue($scope.pageStore, 'courses.grid.pageSize', 10);
        $scope.courseTable.pageCurr = UtilsSrvc.getPropertyValue($scope.pageStore, 'courses.grid.pageCurr', 1);
        $scope.courseTable.itemsTotal = 0;
        $scope.courseTable.selectedItems = [];
        $scope.courseTable.multiSelectMode = false;
        $scope.courseTable.forciblyUpdate = 0;
    };

    // Загрузить все курсы
    $scope.courseTable.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        CourseTeacherSrvc.getAllForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $scope.courseTable.status).then(
            function(data){
                $scope.courseTable.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.courseTable.itemsTotal = data.itemsTotal;
                $scope.courseTable.items = data.items;

                if ($scope.courseTable.selectedItems && $scope.courseTable.items && $scope.courseTable.selectedItems.length == 0 && $scope.courseTable.items.length != 0){
                    $scope.courseTable.selectedItems[0] = $scope.courseTable.items[0];
                    $scope.courseTable.selectedItems[0].rowClass = 'info';
                }
            },
            function(response){
                $scope.courseTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    $scope.courseTable.onSelectCell = function(item, property){
        console.log(item);
        if (!item) return;

        property.onClickCell(item);
    };
    
    // При смене статуса курса - обновить таблицу и поменять иконки
    $scope.$watch('courseTable.status', function(){
        $scope.courseTable.forciblyUpdate++;
        $scope.pageStore.courses.status = $scope.courseTable.status;

        if ($scope.courseTable.status == 1){
            $scope.courseTable.isInUseActionIcon = 'icon-remove';
            $scope.courseTable.isInUseActionTitle = 'Исключить курс';
        }
        else{
            $scope.courseTable.isInUseActionIcon = 'icon-reply';
            $scope.courseTable.isInUseActionTitle = 'Вернуть курс';   
        }
    });

    // Изменить статус курса
    $scope.courseTable.isInUseActionMethod = function(item){
        function changeIsInUse(){
            CourseTeacherSrvc.changeStatus(item.id).then(
                function(data){
                    $scope.courseTable.alert = UtilsSrvc.getAlert('Готово!', 'Изменен статус курса.', 'success', true);
                    $scope.courseTable.forciblyUpdate++;
                },
                function(response){
                    $scope.courseTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        }

        var title = '';
        var msg = '';

        if ($scope.courseTable.status == 1){
            title = $filter('localize')('Исключить курс') + " '" + item.name + "'";
            msg = "Курс будет перенесен в список 'Не используются'.";
        }
        else{
            title = $filter('localize')('Вернуть курс') + " '" + item.name + "'";
            msg = "Курс будет перенесен в список 'Используются'.";
        }

        UtilsSrvc.openMessageBox(title, msg, changeIsInUse);
    };

    // Добавить курс - переход на страницу
    $scope.courseTable.add = function(){
        $location.path('/course');
    };

    // Удалить курс - переход на страницу
    $scope.courseTable.edit = function(item){
        $location.path('/course/' + item.id);
    };

    // При выборе курса - подгружать преподавателей, если надо.
    $scope.$watch('courseTable.selectedItems', function(){
        if (!$scope.courseTable.selectedItems || $scope.courseTable.selectedItems.length == 0 || $scope.courseTable.prevSelItemId == $scope.courseTable.selectedItems[0].id){
            return;
        }

        $scope.courseTable.prevSelItemId = $scope.courseTable.selectedItems[0].id;
        $scope.teacherTable.loadItems();
    }, true);

    // Инициализация таблицы с преподавателями курса
    $scope.teacherTable.init = function(){
        $scope.teacherTable.columns = [
                          {name: 'Фамилия'},
                          {name: 'Имя'},
                          {name: 'Отчество'},
                          {name: 'Организация'},
                          {name: 'Email'},
                          {name: 'Телефон'},
                          {name: 'Skype'}];
        
        $scope.teacherTable.properties = [{name:'lastName'}, {name:'firstName'}, {name:'middleName'}, {name:'company'}, {name:'email'}, {name:'phone'}, {name:'skype'}];
        $scope.teacherTable.pageSize = 100;
        $scope.teacherTable.pageCurr = 1;
        $scope.teacherTable.itemsTotal = 0;
        $scope.teacherTable.selectedItems = [];
        $scope.teacherTable.multiSelectMode = false;
    };
    
    // Загрузить преподавателей курса
    $scope.teacherTable.loadItems = function(){
        CourseTeacherSrvc.getTeachers($scope.courseTable.selectedItems[0].id).then(
            function(data){
                $scope.teacherTable.items = data;
            },
            function(response){
                $scope.teacherTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });    
    };

    // Удалить связь курса с преподавателем
    $scope.teacherTable.remove = function(item){
        function delCourseTeacher(){
            CourseTeacherSrvc.removeTeacher($scope.courseTable.selectedItems[0].id, item.id).then(
                function(data){
                    $scope.teacherTable.alert = UtilsSrvc.getAlert('Успех!', 'Преподаватель удален.', 'success', true);
                    $scope.teacherTable.loadItems();
                },
                function(response){
                    $scope.teacherTable.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        }

        UtilsSrvc.openMessageBox($filter('localize')('Удаление преподавателя') + " '" + item.lastName + "'", "Удалить преподавателя из списка?", delCourseTeacher);
    };

    // Добавить преподавателя в курс
    $scope.teacherTable.add = function(){
        $location.path('/course/' + $scope.courseTable.selectedItems[0].id + '/teacher');
    };

    // Редактировать преподавателя
    $scope.teacherTable.edit = function(item){
        $location.path('/course/' + $scope.courseTable.selectedItems[0].id + '/teacher/' + item.id);
    };
    
    $scope.courseTable.init();
    $scope.teacherTable.init();
});


