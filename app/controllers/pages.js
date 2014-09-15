var now = new Date();
var calendar = require('googleapis').calendar('v3');

var eventList = [];


/************************/
/** Main Function 
/************************/
var getCurrentMonthEventList = function(done){
  var timeMin = helpers.Time.getFirstDayOfMonth(now);
  var timeMax = helpers.Time.getLastDayOfMonth(now);

  calendar.events.list({
    auth: KEYS.API,
    calendarId: KEYS.CALENDAR,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString()
  }, function(err, list){
    if(err){
      console.log(err);
      done();
    }


    var statsBuilder = new helpers.StatsBuilder(list.items);
    list.stats = statsBuilder.stats;
    done(list);
  })
}


exports.index = function(req, res){
  getCurrentMonthEventList(function(eventList){
    res.render('pages/index', {eventList: eventList});
  });
}