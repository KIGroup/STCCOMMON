'use strict';
//dddв

/*===========================================================================================
Компании
===========================================================================================*/

servicesModule.factory('CompanySrvc', function(DALSrvc) {
	
	return {
	    /* Получить короткую информацию о компаниях */
        getAll: function(){
            return DALSrvc.getPromise('get', StcAppSetting.user + '/json/company', null);
        },
        /* Получить короткую информацию о компаниях */
        getAllForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, status){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       status: status};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/company/grid', obj);
        },
        /* Получить короткую информацию о компаниях */
        get: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/company/' + id, null);
        },
        /* Сохранить компанию из заявки */
        saveFromOrder: function(company, orderId){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/company/order', {company: company, orderId: orderId, isOrder: true});
        },
        /* Сохранить компанию из заявки от слушателя*/
        saveFromOrderNewStudent: function(company, orderId){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/company/order', {company: company, orderId: orderId, isOrder: false});
        },
        /* Сохранить данные компании | создать*/
        save: function(company){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/company', company);
        },
        /* Удалить компанию*/
        remove: function(id){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/company/' + id, null);
        },
        changeContact: function(data){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/company/contact/change', data);
        }

    }
});
  
