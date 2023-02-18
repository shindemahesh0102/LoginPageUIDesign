$(window).load(function(){
	//to override this just set window.cookieNamesAndParamsOverride in a JS include before the footer
	//array is cookie name : value to use as link param
	//REMEMBER to update the generic level "This is not me" widget hosted content if cookie names change
	var cookieNamesAndParams = window.cookieNamesAndParamsOverride || {
			"oly_anon_id" : "oly_anon_id",
			"oly_enc_id" : "oly_enc_id"
	};//3.0 params (also need to update below to find new cookie name)
	//to override this just set window.excludeLinkListOverride in a JS include before the footer
	var excludeLinkList = window.excludeLinkListOverride || "";
	generateLinks(cookieNamesAndParams,excludeLinkList.split("%%,,%%"));
});

function generateLinks(cookieNameArray,excludeLinkList) {
	var applicableLinkIDs = $("a");
	
	for (var l = 0; l < applicableLinkIDs.length; l++){
		var href = $(applicableLinkIDs[l]).attr("href");
		var skipLink = false;
		if (excludeLinkList.length>0) {
			for (var x = 0; x < excludeLinkList.length; x++) {
				if (href==excludeLinkList[x]) {
					skipLink = true; 
					break;
				}
			}
		}
		if (href && (href.indexOf('dragonforms')>-1 || href.charAt(0)=='/' || skipLink || href.indexOf('ViewCommInBrowser.jsp')>-1))
			continue;//no need to add these to omeda links, also see OPS-65188 for excludeLinkList and ViewCommInBrowser changes
		
		var hasUrlParams = false;
		if(href && href.indexOf('?') > -1)
			hasUrlParams = true;
		
		for (var c in cookieNameArray){
			var currentParam = cookieNameArray[c];
			var currentCookie = getKey(cookieNameArray, currentParam);
			var currentCookieVal = getCookie(currentCookie);

			if (currentCookie=="oly_enc_id"){				
				var encryptID = "";		
				var tempEID = getUrlParameters("r","",true); //passing an empty string as the 2nd param lets the funct use the current url
				if (tempEID!=null && tempEID!="")
					encryptID=tempEID;
				
				if (encryptID!=null && encryptID!="")
					currentCookieVal = encryptID;
				else
					currentCookieVal = trimString(currentCookieVal);
			}
			else{
				currentCookieVal = trimString(currentCookieVal);
			}
			
			if (currentCookieVal!=null && currentCookieVal!="null" && currentCookieVal!=""){
				if(!hasUrlParams){
					href += "?";
					hasUrlParams = true;
				}
				else{
					href += "&";
				}
				href += currentParam + "=" + currentCookieVal;
			}
		}
		$(applicableLinkIDs[l]).attr("href", href);
	}
}

function getUrlParameters(parameter, staticURL, decode){
   /*
    Function: getUrlParameters
    Description: Get the value of URL parameters either from current URL or static URL
    Author: Tirumal
    URL: www.code-tricks.com
   */
   var currLocation = (staticURL.length)? staticURL : window.location.search;
   if(currLocation == "")
	   return "";
   
   var parArr = currLocation.split("?")[1].split("&"),
       returnBool = true;
   
   for(var i = 0; i < parArr.length; i++){
        parr = parArr[i].split("=");
        if(parr[0] == parameter){
            return (decode) ? decodeURIComponent(parr[1]) : parr[1];
            returnBool = true;
        }else{
            returnBool = false;            
        }
   }
   
   if(!returnBool) return false;  
}

function getCookie(cookiename) {
    var name = cookiename + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function trimString(currentCookie){
	if (currentCookie.length) {
	    //remove the %22 from the front
		currentCookie = currentCookie.substring(3);
        //then trim %22 from the back
		currentCookie = currentCookie.substring(0, currentCookie.length - 3);
	}
	return currentCookie;
}

function getKey(cookieNameArray, value){
	for(var key in cookieNameArray){
	    if(cookieNameArray[key] == value){
	      return key;
	    }
	}
	return null;
}