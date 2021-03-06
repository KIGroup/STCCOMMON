'use strict';
//

/*===========================================================================================
Персоны
===========================================================================================*/

servicesModule.factory('PersonSrvc', function(DALSrvc) {
    return {
        save: function(person){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/person', person);
        },
        getById: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/person/' + id, null);
        },
        getByEmail: function(email){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/person/email/' + email, null);
        },
        deleteById: function(id){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/person/' + id, null);
        },
        getAllForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, type){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       type: type};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/person/grid', obj);
        },
        getBySearchParameters: function(word){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/person/search/' + word, null);
        },
        getFreeTrainingStudents: function(trainingId, word){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/person/free/training/' + trainingId + '/student/' + word, null);
        },
        getFreeCourseTeachers: function(courseId, word){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/person/free/course/' + courseId + '/teacher/' + word, null);
        },
        getTeacherStatistics: function(teachId, dateFrom, dateTo){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/teacher/' + teachId + '/statistics/datefrom/' + (dateFrom ? dateFrom : '0') + '/dateto/' + (dateTo ? dateTo : '0'), null);
        },
        getTrainings: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/person/' + id + '/training', null);
        },
        getCourses: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/person/' + id + '/course', null);
        },
        getCompanies: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/person/' + id + '/company', null);
        },
        getCertificates: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/person/' + id + '/certificate', null);
        }
    }
});
  
