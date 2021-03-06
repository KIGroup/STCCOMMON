'use strict';
//dddddddd

var servicesModule     = angular.module('servicesModule', ['ngResource', 'ngCookies']);
var controllersModule  = angular.module('controllersModule', ['servicesModule']);
var directivesModule   = angular.module('directivesModule', []);
var localizationModule = angular.module('localizationModule', []);
var filterModule       = angular.module('filterModule', []);
var mainModule         = angular.module('mainModule', ['ui.bootstrap', 'servicesModule', 'controllersModule', 'directivesModule', 'localizationModule', 'filterModule']);

mainModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/createorder', {templateUrl: 'partials/createorder.csp', controller: 'CreateOrderCtrl'});
    $routeProvider.when('/orderstudent', {templateUrl: 'partials/orderstudent.csp', controller: 'OrderNewStudentCtrl'});
    $routeProvider.when('/training/:training/order', {templateUrl: 'partials/orderstudent.csp', controller: 'OrderNewStudentCtrl'});
    $routeProvider.when('/orders', {templateUrl: 'partials/orders.csp', controller: 'AllOrdersCtrl'});
    $routeProvider.when('/companies', {templateUrl: 'partials/companies.csp', controller: 'AllCompaniesCtrl'});
    $routeProvider.when('/company', {templateUrl: 'partials/company.csp', controller: 'CompanyCtrl'});
    $routeProvider.when('/company/:id', {templateUrl: 'partials/company.csp', controller: 'CompanyCtrl'});
    $routeProvider.when('/company/order/:order', {templateUrl: 'partials/company.csp', controller: 'CompanyCtrl'});
    $routeProvider.when('/company/order/:ordernewstudent/student', {templateUrl: 'partials/company.csp', controller: 'CompanyCtrl'});
    
    $routeProvider.when('/persons', {templateUrl: 'partials/persons.csp', controller: 'AllPersonsCtrl'});
    $routeProvider.when('/person/:id', {templateUrl: 'partials/person.csp', controller: 'PersonCtrl'});
    $routeProvider.when('/person', {templateUrl: 'partials/person.csp', controller: 'PersonCtrl'});
    $routeProvider.when('/company/:cmpId/person', {templateUrl: 'partials/person.csp', controller: 'PersonCompanyContactCtrl'});
    $routeProvider.when('/company/:cmpId/person/:id', {templateUrl: 'partials/person.csp', controller: 'PersonCompanyContactCtrl'});
    
    $routeProvider.when('/course/:courseId/teacher', {templateUrl: 'partials/person.csp', controller: 'PersonTeacherCtrl'});
    $routeProvider.when('/course/:courseId/teacher/:teacherId', {templateUrl: 'partials/person.csp', controller: 'PersonTeacherCtrl'});
    $routeProvider.when('/training/:trainingId/student', {templateUrl: 'partials/person.csp', controller: 'PersonStudentCtrl'});
    $routeProvider.when('/training/:trainingId/student/:studentId', {templateUrl: 'partials/person.csp', controller: 'PersonStudentCtrl'});
    $routeProvider.when('/training/:trainingId/subgroup/:subgroupId/student', {templateUrl: 'partials/person.csp', controller: 'PersonStudentCtrl'});
    
    $routeProvider.when('/courses', {templateUrl: 'partials/courses.csp', controller: 'AllCoursesCtrl'});
    $routeProvider.when('/course/:id', {templateUrl: 'partials/course.csp', controller: 'CourseCtrl'});
    $routeProvider.when('/course', {templateUrl: 'partials/course.csp', controller: 'CourseCtrl'});
    $routeProvider.when('/trainings', {templateUrl: 'partials/trainings.csp', controller: 'AllTrainingsCtrl'});
    $routeProvider.when('/training/:id', {templateUrl: 'partials/training.csp', controller: 'TrainingCtrl'});
    $routeProvider.when('/feedback', {templateUrl: 'partials/feedback.csp', controller: 'FeedBackCtrl'});
    $routeProvider.when('/training/:id/feedback/:code', {templateUrl: 'partials/feedback.csp', controller: 'FeedBackCtrl'});
    $routeProvider.when('/training/:id/feedbacks/:code', {templateUrl: 'partials/trainingfeedbacks.csp', controller: 'AllTrainingFeedBacksCtrl'});
    
    $routeProvider.when('/trainingstudents', {templateUrl: 'partials/trainingstudents.csp', controller: 'TrainingStudentsCtrl'});
    $routeProvider.when('/training/:id/students/:code', {templateUrl: 'partials/trainingstudents.csp', controller: 'TrainingStudentsCtrl'});
    
    $routeProvider.when('/training', {templateUrl: 'partials/createtraining.csp', controller: 'CreateTrainingCtrl'});
    $routeProvider.when('/training/:id/clone', {templateUrl: 'partials/createtraining.csp', controller: 'CreateTrainingCtrl'});
    $routeProvider.when('/certificates', {templateUrl: 'partials/certificates.csp', controller: 'AllCertificatesCtrl'});
    $routeProvider.when('/settings', {templateUrl: 'partials/settings.csp', controller: 'SettingsCtrl'});
    
    $routeProvider.when('/analytics/:type', {templateUrl: 'partials/deepsee.csp', controller: 'DeepSeeCtrl'});
    $routeProvider.when('/scheduleframe', {templateUrl: 'partials/scheduleframe.csp', controller: 'ScheduleFrameCtrl'});
    
    $routeProvider.when('/mailing/groups', {templateUrl: 'partials/mailinggroups.csp', controller: 'AllMailingGroupsCtrl'});
    $routeProvider.when('/mailing/group', {templateUrl: 'partials/mailinggroup.csp', controller: 'MailingGroupCtrl'});
    $routeProvider.when('/mailing/group/:id', {templateUrl: 'partials/mailinggroup.csp', controller: 'MailingGroupCtrl'});
    $routeProvider.when('/mailing/group/:id/mail', {templateUrl: 'partials/mailinggroupmail.csp', controller: 'MailingGroupMailCtrl'});
    $routeProvider.when('/mailing/group/:gId/item', {templateUrl: 'partials/mailingitem.csp', controller: 'MailingItemCtrl'});
    $routeProvider.when('/mailing/group/:gId/item/:iId', {templateUrl: 'partials/mailingitem.csp', controller: 'MailingItemCtrl'});
    
    $routeProvider.when('/mailing/subscription', {templateUrl: 'partials/mailingsubscription.csp', controller: 'MailingSubscriptionCtrl'});
    $routeProvider.when('/mailing/subscription/:accessCode', {templateUrl: 'partials/mailingsubscription.csp', controller: 'MailingSubscriptionCtrl'});
    $routeProvider.when('/mailing/subscription/confirmation/:confirmCode', {templateUrl: 'partials/mailingsubscription.csp', controller: 'MailingSubscriptionCtrl'});
    
    $routeProvider.when('/logs', {templateUrl: 'partials/logs.csp', controller: 'AllLogsCtrl'});
    $routeProvider.when('/mailing/journal', {templateUrl: 'partials/mailingjournal.csp', controller: 'MailingJournalCtrl'});
    
    
    $routeProvider.otherwise({redirectTo: '/createorder'});
  }]);
  
  