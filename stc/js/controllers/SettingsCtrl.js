'use strict';
//=    

/*===========================================================================================
SettingsCtrl - all settings for google, mail
===========================================================================================*/

controllersModule.controller('SettingsCtrl', function($scope, $filter, SettingsSrvc, UtilsSrvc){
    $scope.menu.selectMenu('settings');
    $scope.google = 
    {
        settings: {},
        calendar: {}
    }; 
    
    $scope.mail = 
    {
        settings: {},
        operators: {items:[{email:{}}]},
        types: [
                {code: 'reminder', name: $filter('localize')('Слушатели. Напоминание о начале занятий')},
                {code: 'registration', name: $filter('localize')('Слушатель. Подтверждение регистрации')},
                {code: 'feedback', name: $filter('localize')('Слушатели. Доступ к анкете после завершения обучения')},
                {code: 'teacher', name: $filter('localize')('Преподаватель. Доступ к списку слушателей перед началом обучения')},
                {code: 'teacherSetAttendeeStatus', name: $filter('localize')('Преподаватель. Доступ к списку слушателей после завершения обучения, указать посещаемость')},
                {code: 'curator', name: $filter('localize')('Куратор. Доступ к списку слушателей перед началом обучения')},
                {code: 'orders', name: $filter('localize')('Заявки. Ссылка для регистрации')},
                {code: 'orderapply', name: $filter('localize')('Одобрение заявки, отсылка письма контакту организации')},
                {code: 'confirmsubscription', name: $filter('localize')('Активация подписки')},
                {code: 'listOfFeedbacks', name: $filter('localize')('Доступ к отзывам о курсе')}
              ],
        common: {}
     };
    
    
    //================================================================================================================================================================
    // GOOGLE                                                                                                                                                   GOOGLE
    //================================================================================================================================================================
    // Load settings for google tab by type (calendar etc.)
    $scope.google.load = function(type){
        SettingsSrvc.getGoogle(type).then(
                function(data){
                    $scope.google[data.type] = data.data;
                },
                function(response){      
                    $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
    };

    // Save settings for google tab by type (calendar etc.)
    $scope.google.save = function(type, form){
        SettingsSrvc.saveGoogle($scope.google[type], type).then(
                function(data){
                    form.$setPristine();
                    $scope.google[type].alertLabel = UtilsSrvc.getAlertLabel('Сохранение завершено', 'success');
                },
                function(response){      
                    $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
    };

    // Load settings for google tab by type (calendar etc.)
    $scope.google.cancel = function(type, form){
        $scope.google.load(type);
        form.$setPristine();
    };

    // Show help dialog window
    $scope.google.showHelp = function(type){
        var msg = '';

        switch(type){
            case 'calendar':{
              msg = '<strong>Перевод строки:</strong> &lt;br&gt;<br><strong>Обязательные параметры:</strong> %1 - ссылка на программу курса, %2 - домен + порт, %3 - идентификатор обучения, %4 - место обучения, %5 - преподаватель, %6 - время, %7 - контактное лицо, %8 - примечание.';
              break;
            }
        }
    //<a href='http://%1'>Программа курса</a><br><br><a href='http://%2/stc/index.csp#/orderstudent?training=%3'>Записаться на обучение</a><br><br>Место проведения:<br>%4<br><br>Преподаватель:<br>%5<br><br>Время проведения: %6<br>%7%8
        UtilsSrvc.openCustomMessageBox('Справка', msg, [{result: '1', label: $filter('localize')('Закрыть'),  cssClass: 'btn-small', func: null}]);    
    };

    // Show preview for google tab as html
    $scope.google.showPreview = function(type){
    SettingsSrvc.getGooglePreview(type).then(
                function(data){
                  $scope.google[type].preview = data.preview;
                  $scope.google[type].previewIsVisible = true;
                },
                function(response){      
                    $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });  
    };


    //================================================================================================================================================================
    // MAIL                                                                                                                                                       MAIL
    //================================================================================================================================================================
    // Load settings for mail tab by type (reminder, feedback and etc.)
    $scope.mail.load = function(type){
        var propertyName = type;
        
        if (type != 'settings' && type != 'operators')
            propertyName = 'common';
    
    
        SettingsSrvc.getMail(type).then(
                function(data){
                    $scope.mail[propertyName] = data.data;
                    if ($scope.mail[propertyName].message){
                        $scope.mail[propertyName].message = $scope.mail[propertyName].message.replace(/<br>/g, "\n")
                    }
                },
                function(response){      
                    $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
    };
    
    // Save settings for mail tab by type (reminder, feedback and etc.)
    $scope.mail.save = function(type, form){
        var propertyName = type;
        if (type != 'settings' && type != 'operators')
            propertyName = 'common';
            
        var mailData = angular.copy($scope.mail[propertyName]);
        
        if (mailData.message){
            mailData.message = mailData.message.replace(/\n/g, "<br>");
        }
        
        SettingsSrvc.saveMail(mailData, type).then(
                function(data){
                    form.$setPristine(); 
                    $scope.mail[propertyName].alertLabel = UtilsSrvc.getAlertLabel('Сохранение завершено', 'success');
                },
                function(response){      
                    $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
    };

    // Load settings for mail tab by type (reminder, feedback and etc.)
    $scope.mail.cancel = function(type, form){
        $scope.mail.load(type);
        form.$setPristine();
    };

    $scope.mail.removeOperator = function(idx, form){
        $scope.mail.operators.items.splice(idx, 1);
        form.$setDirty();
    };
    
    $scope.mail.onTypeChanged = function(form){
        $scope.mail.load($scope.mail.typeCode);
        form.$setPristine();
    };
    
    
    
    // Show help dialog window 
    $scope.mail.showHelp = function(type){
        var getLocValue = function(key){
            return $filter('localize')(key)
        };
        
        
        var msg = getLocValue('В содержании письма можно использовать переменные(%Variable), которые впоследствии будут заменены на соответствующие значения. Список доступных переменных для данного шаблона:<br>');
        
        var trainingVariables = 
              '%DateStart, %DateEnd - ' + getLocValue('дата начала / окончания обучения') + ';<br>' +
              '%TimeStart, %TimeEnd - ' + getLocValue('время начала / окончание занятий') + ';<br>' +
              '%Course.Name - ' + getLocValue('название курса') + ';<br>' +
              '%City.Name, %Region.Name, %Country.Name - ' + getLocValue('город, регион, страна') + ';<br>' +
              '%Street, %Room - ' + getLocValue('улица и аудитория') + ';<br>' +
              '%Trainer.FullName - ' + getLocValue('фамилия и имя преподавателя') + ';<br>' +
              '%Trainer.Email, %Trainer.Phone - ' + getLocValue('email, телефон') + ';<br>' +
              '%Curator.FullName - ' + getLocValue('фамилия и имя куратора') + ';<br>' + 
              '%Curator.Email, %Curator.PhoneSecret, %Curator.PhonePublic - ' + getLocValue('email, личный | публичный телефон') + ';<br>' +
              '%OtherInfo - '  + getLocValue('дополнительная информация об обучении') + ';';
        
        switch(type){
            case 'registration':{
              msg += trainingVariables;
              break;
            }
            case 'reminder':{
              msg += trainingVariables;
              break;
            }
            case 'feedback':{
              msg += '%Course.Name - ' + getLocValue('название курса') + ';<br>' + 
                    '%SurveyUrl - ' + getLocValue('ссылка на страницу для анкетирования') + '.';
              break;
            }
            case 'teacher':{
              msg += trainingVariables + '<br>' +
                    '%ListOfAttendeesUrl - ' + getLocValue('ссылка на страницу со списком слушателей') + '.';
              break;
            }
            case 'curator':{
              msg += trainingVariables + '<br>' +
                    '%ListOfAttendeesUrl - ' + getLocValue('ссылка на страницу со списком слушателей') + '.';
              break;
            }
            case 'orders':{
              msg += trainingVariables + '<br>' +
                    '%JoinUrl - ' + getLocValue('ссылка на страницу регистрации')  + '.';
              break;
            }
            case 'orderapply':{
              msg += '%Course.Name - ' + getLocValue('название курса') + '.';
              break;
            } 
            case 'confirmsubscription':{
              msg += '%ActivationUrl - ' + getLocValue('ссылка для активации подписки') + '.';
              break;
            }
            case 'listOfFeedbacks':{
              msg += trainingVariables + '<br>' + 
                     '%NumberOfNewestSurveys - ' + getLocValue('количество новых отзывов') + ';<br>' +
                     '%ListOfSurveysUrl - ' + getLocValue('ссылка на страницу с отзывами') + '.';
              break;
            } 
        }
        
        UtilsSrvc.openCustomMessageBox('Справка', msg, [{result: '1', label: $filter('localize')('Закрыть'),  cssClass: 'btn-small', func: null}]);    
    };

    // Show preview for mail tab as html
    $scope.mail.showPreview = function(type){
        var propertyName = type;
        
        if (type != 'settings' && type != 'operators')
            propertyName = 'common';
        
        SettingsSrvc.getMailPreview(type).then(
                function(data){
                    $scope.mail[propertyName].preview = data.preview;
                    $scope.mail[propertyName].previewIsVisible = true;
                },
                function(response){      
                    $scope.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });  
    };

    
    // Load all settings
    $scope.google.load('settings');
    $scope.google.load('calendar');
    $scope.mail.load('settings');
    $scope.mail.load('operators');
});

