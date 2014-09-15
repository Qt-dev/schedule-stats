var express = require('express');

// Config
var config = {
  port: 3000
}

var app = express();

// Express components initialization
// Router
var router = require(__dirname + '/config/routes');
app.use('/', router);

// Views
app.set('view engine', 'jade')
app.set('views', __dirname + '/app/views');

if(!module.parent){
  app.set('port', process.env.PORT || config.port);
  var server = app.listen(app.get('port'), function(){
    console.log('Listening on port %d', server.address().port);
  });
}

module.exports = app;