'use strict';
//dddddddddddвddвddffdd

/*===========================================================================================
===========================================================================================*/

controllersModule.controller('DeepSeeCtrl', function($scope, $routeParams, $window){
	$scope.page = {};
	$("#ifChangeLang").attr("src", StcAppSetting.defaultApp + "/Stc.Web.ChangeLang.cls?Lang="+StcAppSetting.lang.substring(0,2));
	
	
	switch($routeParams.type){
		case 'pointsmapgoogle':
			$scope.menu.selectMenu('analyticsMap');
			StcAppSetting.deepSeeCurrentUrl = StcAppSetting.defaultApp + '/deepsee/_DeepSee.UserPortal.DashboardViewer.zen?DASHBOARD=StcDashboards/TrainingPointsMap.dashboard&EMBED=1';
			break;
		case 'pointsmapyandex':
			$scope.menu.selectMenu('analyticsMap');
			StcAppSetting.deepSeeCurrentUrl = StcAppSetting.defaultApp + '/deepsee/_DeepSee.UserPortal.DashboardViewer.zen?DASHBOARD=StcDashboards/TrainingPointsMapYandex.dashboard&EMBED=1';
			break;
		case 'course':
			$scope.menu.selectMenu('analyticsCourse');
			StcAppSetting.deepSeeCurrentUrl = StcAppSetting.defaultApp + '/deepsee/_DeepSee.UserPortal.DashboardViewer.zen?DASHBOARD=StcDashboards/CourseStudents.dashboard&EMBED=1';
			break;
		case 'teacher':
			$scope.menu.selectMenu('analyticsTeacher');
			StcAppSetting.deepSeeCurrentUrl = StcAppSetting.defaultApp + '/deepsee/_DeepSee.UserPortal.DashboardViewer.zen?DASHBOARD=StcDashboards/TeacherStudents.dashboard&EMBED=1';
			break;
		case 'company':
			$scope.menu.selectMenu('analyticsCompany');
			StcAppSetting.deepSeeCurrentUrl = StcAppSetting.defaultApp + '/deepsee/_DeepSee.UserPortal.DashboardViewer.zen?DASHBOARD=StcDashboards/CompanyStudents.dashboard&EMBED=1';
			break;
		case 'order':
			$scope.menu.selectMenu('analyticsOrder');
			StcAppSetting.deepSeeCurrentUrl = StcAppSetting.defaultApp + '/deepsee/_DeepSee.UserPortal.DashboardViewer.zen?DASHBOARD=StcDashboards/OrdersApproved.dashboard&EMBED=1';
			break;
	}
	
	$scope.menu.analytics.css = "active";
	
	// Автообновление ширины панели
	$scope.menu.timeOutIntervalId = $window.setInterval(function(){
        console.log('Autoresize dash');
        try{
        	$window.document.getElementsByName("ifPanel")[0].width = window.document.body.clientWidth-18;
    	}
    	catch(ex){};
    }, 2000);


});

