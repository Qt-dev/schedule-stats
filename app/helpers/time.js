module.exports = {
  getFirstDayOfMonth: function(date, increment){
    var month = increment ? date.getMonth() + 1 : date.getMonth();
    var year = date.getFullYear();

    return new Date(year, month, '1');
  },

  getLastDayOfMonth: function(date){
    var lastDay = this.getFirstDayOfMonth(date, true);
    lastDay.setDate(lastDay.getDate() - 1);

    return lastDay;
  }
}

