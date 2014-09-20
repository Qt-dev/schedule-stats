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
    this.setAllStats();
  },
  setAllStats: function(){
    this.setPerSummaryStats();
    this.setTodoDoneStats();
    this.setPerDayStats();
    this.setTotalStats();
  },
  setTotalStats: function(){
    this.setStats("Total", this.events, "Others");
  },
  setTodoDoneStats: function(){
    var sortedEvents = this.sortTodoDone();
    this.setStats("Passed hours", sortedEvents.doneEvents, "Per Time");
    this.setStats("Hours to come", sortedEvents.todoEvents, "Per Time");
  },
  setPerSummaryStats: function(){
    var sortedEvents = this.sortPerSummary();
    for(var summary in sortedEvents){
      this.setStats(summary, sortedEvents[summary], "Per title");
    }
  },
  setPerDayStats: function(){
    var sortedEvents = this.sortPerDay();
    for(var day in sortedEvents){
      this.setStats(day, sortedEvents[day], "Per day");
    }
  },

  /* SORTING METHODS */
  sortTodoDone: function(){
    var now = new Date();
    var todoEvents = [];
    var doneEvents = [];
    this.events.forEach(function(event){
      var start = new Date(event.start.dateTime);
      var end = new Date(event.end.dateTime);
      if(start < now) {
        doneEvents.push(event);
      } else if (end > now){
        todoEvents.push(event);
      }
    })
    return {doneEvents: doneEvents, todoEvents: todoEvents};
  },
  sortPerSummary: function(){
    var sorted = {};
    this.events.forEach(function(event){
      sorted[event.summary] = sorted[event.summary] || [];
      sorted[event.summary].push(event);
    })
    return sorted
  },
  sortPerDay: function(){
    var sorted = {};
    this.events.forEach(function(event){
      var day = new Date(event.start.dateTime).getDate();
      sorted[day] = sorted[day] || [];
      sorted[day].push(event);
    })
    return sorted;
  },

  /* STATS BUILDING */
  setStats: function(title, events, group){
    var subset = new Subset(events);
    this.stats[group] = this.stats[group] || {};
    this.stats[group][title] = subset.stats;
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
      "Total hours": this.countTotalHours(this.events, true)
    }
  },

  /* TOOLS */
  countEventDuration: function(event){
    var start = new Date(event.start.dateTime).valueOf();
    var end = new Date(event.end.dateTime).valueOf();
    var duration = end - start;

    duration = duration / (1000*60)
    return duration;
  },
  countTotalHours: function(events, withMinutes){
    var minutes = 0;
    var result = 0;
    countEventDuration = this.countEventDuration;
    events.forEach(function(event){
      minutes += countEventDuration(event);
    })
    if(withMinutes){
      var hours = Math.floor(minutes/60)
      minutes = minutes - (hours*60)
      result = hours + "h" + minutes;
    }else {
      result = (minutes/60).toFixed(2);
    }
    return result;
  }
} 

module.exports = StatsBuilder;