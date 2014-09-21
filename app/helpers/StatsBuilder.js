/************************/
/** Stat functions 
/************************/
var StatsBuilder = function(events){
  this.events = events;
  this.stats = {};
  this.STATSTOBUILD = {
    perSummary: this.setPerSummaryStats,
    todoAndDone: this.setTodoDoneStats,
    perDay: this.setPerDayStats,
    total: this.setTotalStats
  } 
  this.init();
}

StatsBuilder.prototype = {
  init: function(){
    this.setAllStats();
  },
  setAllStats: function(){
    for(var title in this.STATSTOBUILD){
      this.STATSTOBUILD[title].call(this);
    }
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
      this.setStats(day, sortedEvents[day], "Per day", true);
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
  setStats: function(title, events, group, daily){
    var subset = new Subset(events, daily);
    this.stats[group] = this.stats[group] || {};
    this.stats[group][title] = subset.stats;
  }
}





var Subset = function(events, daily){
  this.events = events;
  this.daily = daily;
  this.init();
}

Subset.prototype = {
  init: function(){
    this.sortEvents();
    this.buildStats();
  },

  /* GENERIC METHODS */
  convertMinutesToFullString: function(minutes){
      var hours = Math.floor(minutes/60)
      minutes = minutes - (hours*60)
      result = hours + "h" + minutes;
      return result;
  },
  sortEvents: function(){
    var eventsSortedPerDay = {};
    this.events.forEach(function(event){
      var start = new Date(event.start.dateTime);
      var day = start.getDate() + '-' + (start.getMonth() + 1) + '-' + start.getFullYear();

      eventsSortedPerDay[day] = eventsSortedPerDay[day] || [];
      eventsSortedPerDay[day].push(event); 
    })
    return eventsSortedPerDay;
  },
  getSplitDaysAndHours: function(sortedEvents){
    var result = { split: {} , normal: {} };
    for(var key in result){
      result[key].days = 0;
      result[key].hours = 0;
    }
    for(var day in sortedEvents){
      var key = (sortedEvents[day].length === 1) ? "normal" : "split";
      result[key].days += 1;
      sortedEvents[day].forEach(function(event){
        result[key].hours += countEventDuration(event);
      })
    }
    return result;
  },
  buildStats: function(){
    this.stats = {};
    this.stats["Total hours"] = this.countTotalHours(true);
    if(!(this.daily)){
      this.stats["Daily stats"] = this.countSplitDays();
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
  countTotalHours: function(withMinutes){
    var minutes = 0;
    var result = 0;
    countEventDuration = this.countEventDuration;
    this.events.forEach(function(event){
      minutes += countEventDuration(event);
    })
    if(withMinutes){
      result = this.convertMinutesToFullString(minutes);
    }else {
      result = (minutes/60).toFixed(2);
    }
    return result;
  }, 
  countSplitDays: function(){
    var sortedEvents = this.sortEvents();
    var splitDaysAndHours = this.getSplitDaysAndHours(sortedEvents);
    var result = [];
    for(var key in splitDaysAndHours){

      var title = key.charAt(0).toUpperCase() + key.slice(1);
      var formattedHours = this.convertMinutesToFullString(splitDaysAndHours[key].hours);
      var text = title + ": " +splitDaysAndHours[key].days + " Days (" + formattedHours + ")";
      result.push(text);
    }
    return result;
  }
} 

module.exports = StatsBuilder;