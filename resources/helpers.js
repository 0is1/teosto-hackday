'use strict';

var async = require('async');
var echonest = require('./echonest');
var echonestDummyCache = {};

module.exports = {
  // id = venue id from teosto api
  // TODO: get this data in background and save it to own database
  getEchonestSuggestions: function(id, parsedData, cb) {
    if (echonestDummyCache && echonestDummyCache[id]) cb(false, echonestDummyCache[id]);
    else {
      var a = [];
      async.eachSeries(parsedData, function(data, asyncCallback) {
        // echonest API limit is 20 req/min...
        setTimeout(function() {
          return echonest.getArtistSuggestDataAsync(data.name)
            .then(function(result) {
              console.log(result);
              if (result.artists.length > 0) a.push(result.artists[0]);
            })
            .catch(function(err) {
              console.log(err);
              asyncCallback(err);
            })
            .finally(function() {
              asyncCallback();
            });
        }, 2000);
      }, function(err) {
        if (err) {
          console.error('error: ', err);
          cb(err, false);
        } else if (a.length > 0) {
          echonestDummyCache[id] = a;
          cb(false, echonestDummyCache[id]);
        }
      });
    }
  }
};