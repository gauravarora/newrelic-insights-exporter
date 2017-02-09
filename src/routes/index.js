var express = require('express');
var rp = require('request-promise');
var yaml = require('js-yaml');
var logger = require('../logger');
var fs = require('fs');
var _ = require('lodash');
var q = require('q');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({message: 'ok'});
});
var config = yaml.load(fs.readFileSync('./metrics.yml', 'utf8'));
console.log(config);

router.get('/metrics', (req, res) => {
  var promises _.map(config.metrics, metric =>  {
    var options = {
      uri: 'https://insights-api.newrelic.com/v1/accounts/' + process.env.ACCOUNT_ID + '/query',
      qs: {
          nrql: config.metrics[0].nrql
      },
      headers: {
          'X-Query-Key': process.env.API_KEY
      },
      json: true // Automatically parses the JSON string in the response
  };
return  rp(options)
      .then(function (response) {
          // logger.log(response);
          return {
            name: metric.name,
            type: metric.type,
            value: response.results[0].result
          }
      })
      .catch(function (err) {
          logger.warn('failed');
      });
    });
q.all(promises).then(values => {
  logger.debug(values);
});


});
module.exports = router;
