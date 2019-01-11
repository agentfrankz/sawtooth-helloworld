
const {HelloWorldClient} = require('./HelloWorldClient');

var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function(req, res, next) {

  var msg = req.body.txtinput;

  var newClient = new HelloWorldClient(msg);
  newClient.createTransaction();
  res.send(newClient.batchListBytes);
});

module.exports = router;

