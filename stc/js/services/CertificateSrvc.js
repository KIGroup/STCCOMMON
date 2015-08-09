'use strict';
//dddddddвdd

/*===========================================================================================
Сертификаты
===========================================================================================*/

servicesModule.factory('CertificateSrvc', function(DALSrvc) {
    
    return {
          /* Все сертификаты */
        getAllForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, isPrinted){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       isPrinted: isPrinted};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/certificate/grid', obj);
        },
        remove: function(number){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/certificate/' + number, null);
        },
        print: function(number){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/certificate/' + number + '/print', null);
        },
        sendToOffice: function(trainingId){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/traiing/' + trainingId + '/certificate/sendToOffice', null);
        }    
    }
});
  
