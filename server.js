'use strict';

var logger = require('morgan');
var Promise = require('bluebird');
var compression = require('compression');
var express = require('express');
var async = require('async');
var Server = require('http').Server;
var config = require('./config.json');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var _ = require('lodash');
var TeostoApi = Promise.promisifyAll(require('./TeostoApi'));
var echonest = Promise.promisifyAll(require('./resources/echonest'));
var helpers = Promise.promisifyAll(require('./resources/helpers'));

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

// echonest.getArtistGenresById('ARZRFID11F50C4E9E1', function(err, result) {
//   if (err) console.log(err);
//   console.log(result);
// });

// echonest.getArtistSuggestData('OH LAND', function(err, result) {
//   if (err) console.log(err);
//   console.log(result);
// });

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

app.get('/tavastia', function(req, res, next) {
  TeostoApi.getVenueEvents('87a3013f58', 1, 1000, function(error, response, body) {
    if (error) console.log(error);
    console.log('status: ', response.statusCode);
    console.log(body);
    res.render('tavastia_events', {
      title: 'REKO',
      data: body
    });
  });

});

app.get('/venue/:venue_name', function(req, res, next) {
  return TeostoApi.getVenueByNameAsync(req.params.venue_name)
    .then(function(result) {
      return TeostoApi.getVenueEventsAsync(result[1].venues[0].id, 1, 1000);
    })
    .then(function(result) {
      var usedObjects = {},
        data = result[1].events,
        venueId = result[1].venue.id;
      var parsedData = _.chain(data)
        .map(function(d, key) {
          if (d.name !== '<n/a>') {
            var re = /([0-9a-öA-Ö ]{1,})/i;
            var n = re.exec(d.name);
            // Remove duplicates
            var o = JSON.stringify(n[0].toLowerCase().trim());
            if (!usedObjects[o]) {
              usedObjects[o] = true;
              return {
                id: d.id,
                name: n[0],
                startDate: d.startDate,
                endDate: d.endDate,
                url: d.url
              };
            } else return false;
          } else return false;
        })
        .compact(data)
        .value();
      res.render('events', {
        title: 'REKO',
        data: parsedData
      });
    })
    .catch(function(err) {
      console.log('error: ', err);
    });
});

// Do not use this version with venues that have a lot of events
// app.get('/venue/:venue_name', function(req, res, next) {
//   return TeostoApi.getVenueByNameAsync(req.params.venue_name)
//     .then(function(result) {
//       return TeostoApi.getVenueEventsAsync(result[1].venues[0].id, 1, 1000);
//     })
//     .then(function(result) {
//       var usedObjects = {},
//         data = result[1].events,
//         venueId = result[1].venue.id;
//       var parsedData = _.chain(data)
//         .map(function(d, key) {
//           if (d.name !== '<n/a>') {
//             var re = /([0-9a-öA-Ö ]{1,})/i;
//             var n = re.exec(d.name);
//             var o = JSON.stringify(n[0].toLowerCase().trim());
//             if (!usedObjects[o]) {
//               usedObjects[o] = true;
//               return {
//                 id: d.id,
//                 name: n[0],
//                 startDate: d.startDate,
//                 endDate: d.endDate,
//                 url: d.url
//               };
//             } else return false;
//           } else return false;
//         })
//         .compact(data)
//         .value();
//       // Get artist name suggestions from echonest
//       return helpers.getEchonestSuggestionsAsync(venueId, parsedData);
//     })
//     .then(function(result) {
//       res.render('events', {
//         title: 'REKO',
//         data: result,
//         name: req.params.venue_name
//       });
//     })
//     .catch(function(err) {
//       console.log('error: ', err);
//     });
// });


if (require.main === module) {
  server.listen(config.port || 8000, function() {
    var addr = server.address();
    console.log('Listening on  http://%s:%d', addr.address, addr.port);
  });
}