'use strict';

var logger = require('morgan');
var Promise = require('bluebird');
var compression = require('compression');
var express = require('express');
var Server = require('http').Server;
var config = require('./config.json');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var TeostoApi = require('./TeostoApi');

var expressHandlebars = require('express-handlebars'); // https://github.com/ericf/express-handlebars
var hbs = expressHandlebars.create({
  defaultLayout: 'main',
  partialsDir: [
    'views/partials/'
  ],
  extname: '.hbs'
});

var app = express();
var server = Server(app);
app.use(compression());

app.use(logger('short'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('views', './views');
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(require('serve-static')(__dirname + '/public'));

app.get('/', function(req, res, next) {
  TeostoApi.getRoot(function(error, response, body) {
    if (error) console.log(error);
    console.log('status: ', response.statusCode);
    console.log(body);
    res.render('home', {
      title: 'REKO',
      data: body
    });
  });

});

if (require.main === module) {
  server.listen(config.port || 8000, function() {
    var addr = server.address();
    console.log('Listening on  http://%s:%d', addr.address, addr.port);
  });
}