
const {HelloWorldClient} = require('./HelloWorldClient');
const fetch = require("node-fetch");
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/',function(req, res){
  var msg = req.body.txtinput;
  var newClient = new HelloWorldClient();
  var data = newClient.createTransaction(msg);
  console.log(data);

fetch('http://rest-api:8008/batches', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/octet-stream'
    },
    body: data
})
.then((response) => response.json())
.then((responseJson) => {
    res.render('index');
  })
  .catch((error) => {
 console.error(error);
  })

});

module.exports = router;