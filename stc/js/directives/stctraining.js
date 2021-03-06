'use strict';
//dddddddddd

directivesModule.directive('stctraining', function(){
    return {
        replace: true,
        restrict: 'E',
        templateUrl: 'components/stctraining.csp',
        
        scope: {
            training: '=',
            dateStart: '=',
            dateFinish: '=',
            editMode: '=',
            formName: '=',
            btnAdditionVisible: '=',
            btnAdditionName: '=',
            btnAdditionAction: '&'
        },
        controller: function($scope, $filter, TrainingSrvc, RegionSrvc, CourseTeacherSrvc, YandexSrvc, DALSrvc, PersonSrvc, UtilsSrvc){
            $scope.init = function(){
                $scope.courses = [];
                $scope.cities = [];
                $scope.teachers = [];
                $scope.yandex = {results:[]};
            
                if ($scope.editMode){
                    $scope.btnSubmitName = 'Сохранить';
                    //
                }
                else{
                    $scope.btnSubmitName = 'Создать';
                    $scope.addressCheck(false, false, true);   
                }

                $scope.loadCourses();
            };

            $scope.$watch('training.isLoaded', function(){
                if ($scope.training && $scope.training.isLoaded){
                    $scope.yandex.results.push($scope.training.address);
                    $scope.addressCheck(false, true, false);
                }
            }, true);

            $scope.addressCheck = function(msg, select, btn){
                $scope.addressMsg = msg;
                $scope.addressSelect = select;
                $scope.addressBtn = btn;
            };

            $scope.findAddress = function(){
                var searchStr = $scope.training.city.greatParentName + ', ' + $scope.training.city.parentName + ', ' + $scope.training.city.name + ', ' + $scope.training.street;
                
                YandexSrvc.getResult(searchStr).then(
                    function(data){
                       
                        $scope.yandex.results =[];
                        for(var i=0; i < data.response.GeoObjectCollection.featureMember.length; i++){
                            $scope.yandex.results.push(
                                {point: UtilsSrvc.getPropertyValue(data.response.GeoObjectCollection.featureMember[i], 'GeoObject.Point.pos'),
                                 title: UtilsSrvc.getPropertyValue(data.response.GeoObjectCollection.featureMember[i], 'GeoObject.name')});
                            //title: UtilsSrvc.getPropertyValue(data.response.GeoObjectCollection.featureMember[i], 'GeoObject.metaDataProperty.GeocoderMetaData.text')
                        }

                        if ($scope.yandex.results.length != 0){
                            $scope.training.address = $scope.yandex.results[0];
                            $scope.addressCheck(false, true, false);
                        }
                        else{
                            $scope.addressCheck(true, false, false);
                        }

                    },
                    function(response){
                        console.log(response);
                    });
            };

            $scope.changeTimeMode = function(timeType){
                switch($scope.training[timeType]){
                    case 'a.m.':
                    {
                        $scope.training[timeType] = 'p.m.';
                        break;
                    }
                    case 'p.m.':
                    {
                        $scope.training.timeStartType = '24';
                        $scope.training.timeFinishType = '24';
                        break;
                    }
                    case '24':
                    {
                        $scope.training[timeType] = 'a.m.';
                        break;
                    }
                }
            };
            
            $scope.$watch('training.timeStartType', function(){
                if ($scope.training.timeStartType != '24')
                    $scope.training.timePattern = '([0-9]|0[0-9]|1[0-2]|2[0-2]):[0-5][0-9]';
                else
                    $scope.training.timePattern = '([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]';
            }, true);
            
            
            // Подгрузить курсы 
            $scope.loadCourses = function(){
                CourseTeacherSrvc.getAll(-1).then(
                    function(data){
                        $scope.courses = data;
                    },
                    function(response){
                        $scope.alert = UtilsSrvc.getAlert('Ошибка!', response.data, 'error', true);
                    }); 
            };

            $scope.$watch('training.course', function(){
                if (!$scope.training || !$scope.training.course || !$scope.training.course.id)
                    return;

                CourseTeacherSrvc.getTeachers($scope.training.course.id).then(
                    function(data){
                        $scope.teachers = data;
                        if (!$scope.editMode && data && data.length != 0)
                            $scope.training.teacher = data[0];
                    },
                    function(response){
                        $scope.alert = UtilsSrvc.getAlert('Ошибка !', response.data, 'error', true);
                    }); 
            }, true);

            // Подгружать города по набору
            $scope.loadCities = function(startsWith){
                $scope.addressCheck(false, false, true);
                   
                if(!startsWith || startsWith.length == 0)
                    $scope.cities = [];
                
                if (!startsWith || startsWith.length != 2)
                    return;  

                RegionSrvc.getAllCitiesStartsWith(startsWith).then(
                    function(data){
                        $scope.cities = data;
                    },
                    function(response){
                        $scope.alert = UtilsSrvc.getAlert('Ошибка !', response.data, 'error', true);
                    }); 
            };


            $scope.formatDate = function(){
                $scope.training.dateStart = UtilsSrvc.getValidDate($scope.dateStart);
                $scope.training.dateFinish = UtilsSrvc.getValidDate($scope.dateFinish);
                
                if ($scope.training.dateStart == "")
                    $scope.dateStart = "";

                if ($scope.training.dateFinish == "")
                    $scope.dateFinish = "";

                
            };
            
            
            $scope.openTeacherPayoutDialog = function(){
                var doAfterLoadPayout = function(data){              
                    var buttons = [
                        {
                            result: '1',
                            label: $filter('localize')('Подтвердить сумму'),
                            cssClass: 'btn-small btn-primary',
                            func : function(){
                                        $scope.training.payout = data.PRound;
                                        $scope.formName.$setDirty();
                                   }
                        },
                        {
                            result: '0',
                            label: $filter('localize')('Отмена'),
                            cssClass: 'btn-small',
                            func : null
                        }];
                    
                    var getLocValue = function(key){
                        return $filter('localize')(key)
                    };
                    
                    var msg = 
                    "<b>" + getLocValue("Формула расчета") +":</b><br>"+
                    "<b>P = Y * x * v * h</b>, " + getLocValue("где") + " <b>Y = 1 + (y1 - 1) + (y2 - 1) + (y3 - 1)</b><br>" +            
                    "<b>v</b> - " + getLocValue("стоимость нормочаса обучения") + ";<br>" +
                    "<b>x</b> - " + getLocValue("коэф. сложности курса") + "; <br>" +
                    "<b>h</b> - " + getLocValue("продолжительность курса в часах") + ";<br>" +
                    "<b>y1</b> - " + getLocValue("количество обучений любых курсов этого преподавателя за последний год до обучения. Изменяется от 0.8 до 1.1 с шагом 0.1.") + "<br>" +
                    "<b>y2</b> - " + getLocValue("опыт проведения именно этого курса за всё время. Изменяется от 0.75 до 1.25 c шагом 0.05.") + "<br>" +
                    "<b>y3</b> - " + getLocValue("рейтинг преподавателя по отзывам слушателей (средняя оценка по курсу). Коэффициент меняется от 0.9 до 1.1 в пропорции.") + "<br>" +
                    "<b>" + getLocValue("Результат") + ":</b><br>";
                    
                    msg += 
                    "P = " + data.P + " = " + data.Y + " * " + data.x + " * " + data.v + " * " + data.h + ".<br>" +
                    "Y = " + data.Y + " = 1 + (" + data.y1 + " - 1) + (" + data.y2 + " - 1) + (" + data.y3 + " - 1)"; 
                        
                    UtilsSrvc.openCustomMessageBox(getLocValue('Сумма выплаты преподавателю') + ': ' + $filter('number')(data.PRound) + ', ' + data.currency, msg, buttons);
                };
                
                TrainingSrvc.getTeacherPayout($scope.training.id, $scope.training.teacher.id).then(
                    function(data){
                        doAfterLoadPayout(data);
                    },
                    function(response){
                    });     
            };

            $scope.init();
        }
    }
});
