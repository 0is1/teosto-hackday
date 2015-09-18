'use strict';

var echojs = require('echojs');
var config = require('../config');

var echo = echojs({
  key: config.echonestApiKey
});

module.exports = {
  getArtistGenresById: function(id, cb) {
    echo('artist/terms').get({
      id: id,
      sort: 'weight'
    }, function(err, json) {
      if (err) cb(err, false);
      else cb(false, json.response);
    });
  },
  getArtistSuggestData: function(q, cb) {
    echo('artist/suggest').get({
      name: q,
      results: 1
    }, function(err, json) {
      if (err) cb(err, false);
      else cb(false, json.response);
    });

  }
};