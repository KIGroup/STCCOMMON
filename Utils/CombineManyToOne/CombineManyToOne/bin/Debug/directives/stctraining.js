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
        controller: function($scope, RegionSrvc, CourseTeacherSrvc, YandexSrvc, DALSrvc, PersonSrvc, UtilsSrvc){
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

            $scope.$watch('training.id', function(){
                if ($scope.training && $scope.training.id){
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
                var searchStr = $scope.training.city.greatParentName + ', ' + $scope.training.city.parentName + ', ' + $scope.training.city.name + ', ' + $scope.training.notCorrectAddress;
                
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
                    });
            };

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

            $scope.init();
	   	}
    }
});
