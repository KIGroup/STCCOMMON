'use strict';
//d

var StcAppSetting = StcAppSetting || {};

StcAppSetting.getLocale = function() {
    if (navigator) {
        if (navigator.language) {
            return navigator.language;
        }
        else if (navigator.browserLanguage) {
            return navigator.browserLanguage;
        }
        else if (navigator.systemLanguage) {
            return navigator.systemLanguage;
        }
        else if (navigator.userLanguage) {
            return navigator.userLanguage;
        }
    }
};


StcAppSetting.getCookie = function(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"))
    return matches ? decodeURIComponent(matches[1]) : undefined
};
        

StcAppSetting.setCookie = function(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
      var d = new Date();
      d.setTime(d.getTime() + expires*1000);
      expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for(var propName in options) {
      updatedCookie += "; " + propName;
      var propValue = options[propName];   
      if (propValue !== true) {
        updatedCookie += "=" + propValue;
       }
    }

    document.cookie = updatedCookie;
};


StcAppSetting.getLang = function(){
    var lang = StcAppSetting.getCookie('lang');

    if (lang) 
      return lang;

    /*
    switch(getLocale()){
      case 'en-US':
      case 'en':
        return 'en-US';
    }
    */
    
    return '';
}  