var now = new Date();
var calendar = require('googleapis').calendar('v3');

var eventList = [];

var getCurrentMonthEventList = function(done){
  var timeMin = helpers.time.getFirstDayOfMonth(now);
  var timeMax = helpers.time.getLastDayOfMonth(now);

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

    done(list.items);
  })
}

exports.index = function(req, res){
  getCurrentMonthEventList(function(events){
    res.render('pages/index', {events: events});
  });
}