'use strict';
//ddвddddв

/*===========================================================================================
Utils
===========================================================================================*/

servicesModule.factory('UtilsSrvc', function($dialog, $filter, DALSrvc) {
    
    return {
        openMessageBox: function(title, msg, func){
            var btns = [{result: true, label: 'Ок', cssClass: 'btn-primary btn-small'}, 
                        {result: false, label: $filter('localize')('Отмена'), cssClass: 'btn-small'}];

            $dialog.messageBox($filter('localize')(title), $filter('localize')(msg), btns).open().then(function(result){
                if (result && func)
                    func(); 
             });
        },
        openCustomMessageBox: function(title, msg, btns){
            $dialog.messageBox($filter('localize')(title), $filter('localize')(msg), btns).open().then(function(result){
                for (var i=0; i < btns.length; i++){
                    if (result == btns[i].result && btns[i].func)
                        btns[i].func();
                }
             });
        },
        getAlert: function(title, msg, eventType, visible){
            return {title: $filter('localize')(title),
                    msg: $filter('localize')(msg),
                    cssClass: 'alert alert-' + eventType,
                    visible: visible};
        },
        getAlertLabel: function(msg, eventType){
            return {msg: $filter('localize')(msg),
                    cssClass: eventType,
                    visible: true};
        },
        getIndexes: function(array, objField, valueField){
            var indexes = [];
            
            if (!array) return indexes;
            
            for (var i = 0; i < array.length; i++) {
                if (array[i][objField] == valueField)
                    indexes.push(i);
            };
            return indexes;
        },
        getValidDate: function(str){
            var date = new Date(str);
            if (isNaN(date))
                return "";
                
            //return $filter('date')(date, 'dd-MM-y');
            return $filter('date')(date, 'y-MM-dd');
        },
        getTwoDate: function(start, finish){
            var startText = $filter('convertCacheDate')(start, $filter('localize')('d MMMM y'));
            var finishText = $filter('convertCacheDate')(finish, $filter('localize')('d MMMM y'));
            var partsDate = startText.split(",");

            if (partsDate.length == 1){
                // На тот случай если startText == "17 октября 2015"
                partsDate = startText.split(" ");
                startText = partsDate[0] + ' ' + partsDate[1];
            }
            else if (partsDate.length == 2){
                // На тот случай если startText == "october 17, 2015"
                startText = partsDate[0];
            }
     
            return startText + ' - ' +  finishText;
        },
        getMailPattern: function(type){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/mail/pattern/' + type, null);
        },
        sendEmail: function(data){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/mail/send', data);
        },
        getAllLogsForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/log/grid', obj);
        },
        getFullNameForCurLang: function(lastName, firstName, middleName){
            // У русских - фамилия имя, а у англичан - имя фамилия
            
            if (StcAppSetting.lang == 'ru-RU' || StcAppSetting.lang == 'ru'){
                return lastName + ' ' + firstName + (middleName ? ' ' + middleName : '');
            }
            else {
                return firstName + (middleName ? ' ' + middleName : '') + ' ' + lastName;
            }
        },
        getPropertyValue: function (item, propertyStr, defaultValue){
            var value;
            defaultValue = defaultValue ? defaultValue : '';

            try{
                var properties = propertyStr.split('.');
                
                switch(properties.length){
                    case 1:
                        value = item[properties[0]];
                        break;
                    case 2:
                        value = item[properties[0]][properties[1]];
                        break;
                    case 3:
                        value = item[properties[0]][properties[1]][properties[2]];
                        break;
                    case 4:
                        value = item[properties[0]][properties[1]][properties[2]][properties[3]];
                        break;
                    case 5:
                        value = item[properties[0]][properties[1]][properties[2]][properties[3]][properties[4]];
                        break;
                }
            }
            catch(ex){
                //console.log('Cвойства не существует ' + propertyStr);
            }

            return value == undefined ? defaultValue : value;
        }
    }
});
  
