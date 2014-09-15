var now = new Date();

function getFirstDayOfMonth(date, increment){
  var month = increment ? date.getMonth() + 1 : date.getMonth();
  var year = date.getFullYear();

  return new Date(year, month, '1');
}

function getLastDayOfMonth(date){
  var lastDay = getFirstDayOfMonth(date, true);
  lastDay.setDate(lastDay.getDate() - 1);

  return lastDay;
}

exports.index = function(req, res){
  res.render('pages/index');
}