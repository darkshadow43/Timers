getUserTimezone();
getUserLocation();

function getUserTimezone(){
	var timezoneSpan = document.getElementById("userTimezone");
	var hourOffset = parseInt(moment().utcOffset()/60);
	var sign;
	if (hourOffset > 0){
		sign = "UTC +";
	}
	else{
		sign = "UTC -";
		hourOffset *= -1;
	}
	var minOffset = parseInt(moment().utcOffset()%60);
	timezoneSpan.innerHTML = "<strong>" + moment.tz(moment.tz.guess()).zoneAbbr() + "</strong> [" + sign + hourOffset + ":" + minOffset + "]";
}

function getUserLocation(){
	var locationSpan = document.getElementById("userLocation");
	var locationErrorSpan = document.getElementById("errorLocation");
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(getCoordinates, getError);
	}
	else{
		locationErrorSpan.innerHTML = "Your browser does not support geolocation";
	}
	function getCoordinates(position){
		var lat = position.coords.latitude;
		var lon = position.coords.longitude; 
		var reverseGeocode = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon + '&zoom=10';
		$.getJSON(reverseGeocode, function(data) {
			locationSpan.innerHTML = "<strong>" + data['display_name'].split(",")[0] + "</strong> <span class=\"flag-icon flag-icon-" + data['address']['country_code'] + "\"></span>";
		});
	}
	function getError(error) {
		switch(error.code) {
		    case error.PERMISSION_DENIED:
		    	locationErrorSpan.innerHTML = "User denied the request for Geolocation."
		    	break;
		    case error.POSITION_UNAVAILABLE:
		    	locationErrorSpan.innerHTML = "Location information is unavailable."
		    	break;
		    case error.TIMEOUT:
		    	locationErrorSpan.innerHTML = "The request to get user location timed out."
		    	break;
		    case error.UNKNOWN_ERROR:
		    	locationErrorSpan.innerHTML = "An unknown error occurred."
		    	break;
		}
	}
}

