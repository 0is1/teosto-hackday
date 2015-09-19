// var Promise = require('bluebird');
// Promise.promisifyAll(require('./resources/echonest'));
var TeostoApi = require('./TeostoApi');
// var helpers = require('./resources/helpers');
// var testVenueId = '87a00c395c';
// var testData = [{
//   id: '8ca10a3a',
//   name: 'JAAKKO LAITINEN ',
//   startDate: '2014-03-15',
//   endDate: '2014-03-15',
//   url: 'http://api.teosto.fi/2014/event?id=8ca10a3a'
// }, {
//   id: '80a20a3a52',
//   name: 'JOOSE KESKITALO',
//   startDate: '2014-09-26',
//   endDate: '2014-09-26',
//   url: 'http://api.teosto.fi/2014/event?id=80a20a3a52'
// }, {
//   id: '81a00a3d5f',
//   name: 'MANDOLIN MOUNTAIN ',
//   startDate: '2014-05-09',
//   endDate: '2014-05-09',
//   url: 'http://api.teosto.fi/2014/event?id=81a00a3d5f'
// }, {
//   id: '8da20839',
//   name: 'SUPERJANNE',
//   startDate: '2014-04-12',
//   endDate: '2014-04-12',
//   url: 'http://api.teosto.fi/2014/event?id=8da20839'
// }];

TeostoApi.getVenueByName('tavastia', function(error, response, body) {
  if (error) console.log(error);
  console.log('status: ', response.statusCode);
  console.log(body);
});

TeostoApi.getEventById('80a4083b53', function(error, response, body) {
  if (error) console.log(error);
  console.log('status: ', response.statusCode);
  console.log(body);
});

TeostoApi.getDatesByMonth(9, 1, 3, function(error, response, body) {
  if (error) console.log(error);
  console.log('status: ', response.statusCode);
  console.log(body);
});

// helpers.getEchonestSuggestions(testVenueId, testData, function(err, result) {
//   if (err) console.log(err);
//   console.log('result: ', result);
// });