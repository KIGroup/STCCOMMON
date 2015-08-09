//d

filterModule.filter('convertCacheDate', function($filter) {
    return function(input, filterParams, isUTC) {
        var result;

        try{
	        //if (isUTC){
	        	
	        //}
	        
            var dateTime = input.split(' ');
            var date = dateTime[0].split('-');
            
            if (dateTime.length == 1){
            	result = $filter('date')(new Date(date[0], date[1]-1, date[2]), filterParams);
            }
            else{
                //var time = dateTime[1].split(':');
                //result = $filter('date')(new Date(date[0], date[1]-1, date[2], time[0], time[1], time[2]), filterParams);
            	return $filter('date')(new Date(input.replace(/-/g,"/")+' UTC'), filterParams)
            }
        }
        catch (ex){
            result = input;
        }

        return result;
    }
});