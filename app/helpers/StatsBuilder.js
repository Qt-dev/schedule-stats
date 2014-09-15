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
    this.setPerSummaryStats();
    this.setTodoDoneStats();
    this.setStats("Total", this.events);
  },
  setTodoDoneStats: function(){
    var sortedEvents = this.sortTodoDone();
    this.setStats("Passed hours", sortedEvents.doneEvents);
    this.setStats("Hours to come", sortedEvents.todoEvents);
  },
  setPerSummaryStats: function(){
    var sortedEvents = this.sortPerSummary();
    for(var summary in sortedEvents){
      this.setStats(summary, sortedEvents[summary]);
    }
  },
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
    var sorted = {}
    this.events.forEach(function(event){
      sorted[event.summary] = sorted[event.summary] || [];
      sorted[event.summary].push(event);
    })
    return sorted
  },
  setStats: function(title, events){
    var subset = new Subset(events);
    this.stats[title] = subset.stats;
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
      "Maximum number of hours": maxHours,
      "Minimum number of hours": minHours
    }
  }
} 

module.exports = StatsBuilder;