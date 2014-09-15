/************************/
/** Stat functions 
/************************/
var StatsBuilder = function(events){
  this.events = events;
  this.stats = {};
  this.init();
}

StatsBuilder.prototype = {
  init: function(){
    this.events = new Subset(this.events);
    this.stats["Total"] = this.events.stats;
  }
}





var Subset = function(events){
  this.events = events;
  this.eventsSortedPerDay = {};
  this.init();
}

Subset.prototype = {
  init: function(){
    this.sortEvents();
    this.buildStats();
  },

  /* GENERIC METHODS */
  sortEvents: function(){
    var eventsSortedPerDay = this.eventsSortedPerDay;
    this.events.forEach(function(event){
      var start = new Date(event.start.dateTime);
      var day = start.getDate() + '-' + (start.getMonth() + 1) + '-' + start.getFullYear();

      eventsSortedPerDay[day] = eventsSortedPerDay[day] || [];
      eventsSortedPerDay[day].push(event); 
    })
  },
  buildStats: function(){
    this.stats = {
      "Total hours": this.countTotalHours(this.events),
      "Per Day": this.getDailyStats(this.eventsSortedPerDay)
    }
  },

  /* TOOLS */
  countEventDuration: function(event){
    var start = new Date(event.start.dateTime).getHours();
    var end = new Date(event.end.dateTime).getHours();
    return end - start;
  },
  countTotalHours: function(events){
    var hours = 0;
    countEventDuration = this.countEventDuration;
    events.forEach(function(event){
      hours += countEventDuration(event);
    })
    return hours;
  },

  /* STATS GATHERING */
  getDailyStats: function(sortedEvents){
    var maxHours = 0;
    var minHours = 24;
    for(var day in sortedEvents){
      var events = sortedEvents[day];
      var hours = this.countTotalHours(events);
      if (hours > maxHours) maxHours = hours;
      if (hours < minHours) minHours = hours;
    }
    return {
      maxHours: maxHours,
      minHours: minHours
    }
  }
} 

module.exports = StatsBuilder;