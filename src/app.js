if (process.env.NODE_ENV=='dev') {
  require('dotenv').config();
}
var logger = require('./logger');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var http = require('http');
var app = express();
console.log('abcd')
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/', index);
app.use('/users', users);

const port = process.env.PORT || 5000;
http.createServer(app).listen(port, function(err) {
  if (err) {
    logger.error(err);
  } else {
    logger.info('listening in http://localhost:' + port);
  }
});
module.exports = app;
