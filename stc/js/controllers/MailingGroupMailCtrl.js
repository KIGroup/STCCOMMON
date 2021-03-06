'use strict';
//

/*===========================================================================================
Письмо группе рассылки
===========================================================================================*/

controllersModule.controller('MailingGroupMailCtrl', function($scope, $filter, $window, $routeParams, MailingSrvc, UtilsSrvc){
    if ($scope.menu.admin){
        $scope.menu.brandCaption = 'Система учёта курсов';
        $scope.menu.appTitle = 'Система учёта курсов';
    }
    
    $scope.mailForm = {};
    $scope.mailForm.contacts = [];
    $scope.mailForm.contactsStyle = {};
    
    // Загрузить группу
    $scope.mailForm.loadGroup = function(){
        MailingSrvc.getGroup($routeParams.id).then(
            function(data){
                data.mailSubject = '';
                data.mailMessage = "" + $filter('localize')("Чтобы отписаться от почтовых уведомлений перейдите по <a target='_blank' href='%UnsubscribeUrl'>ссылке</a>.");
                $scope.mailForm.group = data;
            },
            function(response){
                $scope.mailForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Загрузить всех получателей
    $scope.mailForm.loadItems = function(){
        MailingSrvc.getGroupContacts($routeParams.id).then(
            function(data){
                if (data.length > 40){
                    $scope.mailForm.contactsStyle = {
                        height: '150px', 
                        overflowX: 'auto',
                        border: '1px dashed rgb(158, 158, 158)',
                        padding: '4px'
                    };
                }
                
                for (var i=0; i < data.length; i++){
                    if (data[i].name.length > 20){
                        data[i].nameShort = data[i].name.substring(0, 17) + '...'
                    }
                    else{
                        data[i].nameShort = data[i].name;
                    }
                }
                $scope.mailForm.contacts = data;  
            },
            function(response){
                $scope.mailForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };
    
    // Delete email from recipient field
    $scope.mailForm.deleteEmailContact = function(contact){
        var idx = UtilsSrvc.getIndexes($scope.mailForm.contacts, 'id', contact.id);
                
        if (idx.length != 0)
            $scope.mailForm.contacts.splice(idx[0], 1);
    };
    
    // Загрузить превью
    $scope.mailForm.loadPreview = function(){
        $scope.mailForm.previewVisible = true;
        $scope.mailForm.preview = $scope.mailForm.group.mailSubject + '<br><br>' + $scope.mailForm.group.mailMessage.replace(/\n/g, "<br>");
        return;
        
        MailingSrvc.getGroupMail($routeParams.id).then(
            function(data){
                $scope.mailForm.preview = data.subject + '<br><br>' + data.message;
                $scope.mailForm.previewVisible = true;  
            },
            function(response){
                $scope.mailForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Отправить письмо
    $scope.mailForm.sendMail = function(){
        if ($scope.mailForm.contacts.length == 0)
            return;

        var resultContacts = $filter('filter')($scope.mailForm.contacts, { city: $scope.mailForm.cityFilter, companyTypeCode: $scope.companyTypeFilterFunc()});
        
        MailingSrvc.sendEMail({
                    contacts: resultContacts, 
                    subject: $scope.mailForm.group.mailSubject, 
                    message: $scope.mailForm.group.mailMessage.replace(/\n/g, "<br>")
                }).then(
            function(data){
                $scope.form_mail.$setPristine();
                $scope.mailForm.alert = UtilsSrvc.getAlert('Готово!', 'Письма добавлены в очередь, проверьте журнал рассылок', 'success', true);  
            },
            function(response){
                $scope.mailForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };
    
    // Назад
    $scope.mailForm.back = function(){
        $window.history.back();
    };


    $scope.companyTypeFilterFunc = function () { 
        if ($scope.mailForm.companyTypeUniverFilter && $scope.mailForm.companyTypePartnerFilter){
            return '';            
        }
        
        if ($scope.mailForm.companyTypePartnerFilter){
            return 'Partner';      
        }
        
        if ($scope.mailForm.companyTypeUniverFilter){
            return 'Univer'           
        }
        
        return 'UnknownCompanyType';
    };
    
    $scope.mailForm.loadGroup();
    $scope.mailForm.loadItems();
});
    

