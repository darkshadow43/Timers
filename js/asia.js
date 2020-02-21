timeZoneList = [
	"Asia/Tokyo",
	"Asia/Seoul",
	"Asia/Taipei",
	"Asia/Singapore",
	"Asia/Jakarta",
	"Asia/Kolkata",
	"Asia/Dubai",
	"Asia/Qatar"
]

var eventDate = [2020, 02, 22];

var startTimeNorth = "2020-02-22 11:00:00";
var endTimeNorth = "2020-02-22 14:00:00";
var startTimeSouth = "2020-02-22 15:00:00";
var endTimeSouth = "2020-02-22 18:00:00";

tippy('.btn', {
  content: "Copied!",
  placement: 'right',
  arrow: 'true',
  animation: 'scale-with-inertia',
  theme: 'dark',
  trigger: 'click',
  delay: [0,100],
});

var clipboard = new ClipboardJS('.btn');

clipboard.on('success', function(e) {
    e.clearSelection();
});

clipboard.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});

getAsiaTimeZones();
getAsiaEventStatus();

function getAsiaTimeZones() {
	var asiaJSON;
	$.getJSON("./assets/timezone/asia.json", function(json){
		asiaJSON = json;
	})
	.done(function(){
		for (var index = 0; index < timeZoneList.length; index++) {
			var hourOffset = ("0" + parseInt(moment(eventDate).tz(timeZoneList[index]).utcOffset()/60)).slice(-2);
			var sign;
			var timeZoneAbbr;
			var timeZoneHemisphere;
			if (hourOffset > 0) {
				sign = "UTC +";
			}
			else {
				sign = "UTC -";
				hourOffset *= -1;
			}
			var minOffset = ("0" + parseInt(moment(eventDate).tz(timeZoneList[index]).utcOffset()%60)).slice(-2);
			if (moment(eventDate).tz(timeZoneList[index]).isDST() == true) {
				timeZoneAbbr = asiaJSON[timeZoneList[index]]["active"]["abbr"];
			}
			else {
				timeZoneAbbr = asiaJSON[timeZoneList[index]]["inactive"]["abbr"];
			}
			timeZoneHemisphere = asiaJSON[timeZoneList[index]]["hemisphere"];
			document.getElementById("tz_asia_" + index).innerHTML = "<strong>" + timeZoneAbbr + "</strong> [" + sign + hourOffset + ":" + minOffset + "] - " + timeZoneHemisphere + "ern HS";
		}
	});	
}

function getAsiaEventStatus() {
	var asiaJSON;
	var eventStartTime;
	var eventEndTime;
	$.getJSON("./assets/timezone/asia.json", function(json){
		asiaJSON = json;
	})
	.done(function(){
		for(var index = 0; index < timeZoneList.length; index++) {
			if (asiaJSON[timeZoneList[index]]["hemisphere"] == "North") {
				eventStartTime = moment.tz(startTimeNorth, timeZoneList[index]);
				eventEndTime = moment.tz(endTimeNorth, timeZoneList[index]);
			}
			else{
				eventStartTime = moment.tz(startTimeSouth, timeZoneList[index]);
				eventEndTime = moment.tz(endTimeSouth, timeZoneList[index]);
			}
			document.getElementById("start_asia_" + index).innerHTML = "Event starts at: " + eventStartTime.local().format("YYYY-MM-DD HH:mm:ss") + " " + moment.tz(moment.tz.guess()).zoneAbbr();
			document.getElementById("end_asia_" + index).innerHTML = "Event ends at: " + eventEndTime.local().format("YYYY-MM-DD HH:mm:ss") + " " + moment.tz(moment.tz.guess()).zoneAbbr();
		}
		runAsiaTimers();
		function runAsiaTimers() {
			now = moment();
			for (var index = 0; index < timeZoneList.length; index++) {
				if (asiaJSON[timeZoneList[index]]["hemisphere"] == "North") {
					eventStartTime = moment.tz(startTimeNorth, timeZoneList[index]);
					eventEndTime = moment.tz(endTimeNorth, timeZoneList[index]);
				}
				else{
					eventStartTime = moment.tz(startTimeSouth, timeZoneList[index]);
					eventEndTime = moment.tz(endTimeSouth, timeZoneList[index]);
				}
				distance = eventStartTime.unix() - now.unix();
				if (distance >= 0) {
					days = Math.floor(distance / (60 * 60 * 24));
					hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
					minutes = Math.floor((distance % (60 * 60)) / (60));
					seconds = Math.floor((distance % (60)) / 1);
					document.getElementById("timer_asia_" + index).innerHTML = "Event begins in: <span style=\"color:#00C0FF\"><strong>" + ("0" + days).slice(-2) + "d " + ("0" + hours).slice(-2) + "h " + ("0" + minutes).slice(-2) + "m " + ("0" + seconds).slice(-2) + "s </strong></span>";		
				}
				if (distance < 0 && distance >= eventStartTime.unix() - eventEndTime.unix()) {
					distance = eventEndTime.unix() - now.unix();
					days = Math.floor(distance / (60 * 60 * 24));
					hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
					minutes = Math.floor((distance % (60 * 60)) / (60));
					seconds = Math.floor((distance % (60)) / 1);
					document.getElementById("timer_asia_" + index).innerHTML = "Event in progress<br> Event ends in: <span style=\"color:#00FF40\"><strong>" + ("0" + days).slice(-2) + "d " + ("0" + hours).slice(-2) + "h " + ("0" + minutes).slice(-2) + "m " + ("0" + seconds).slice(-2) + "s </strong></span>";
				}
				if (distance < eventStartTime.unix() - eventEndTime.unix()) {
					document.getElementById("timer_asia_" + index).innerHTML = "<span style=\"color:#FF0000\"><strong>Event has ended</strong></span>";
				}
			}
			setTimeout(runAsiaTimers, 1000);
		}
	});
	
}