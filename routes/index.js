
const {HelloWorldClient} = require('./HelloWorldClient');
const fetch = require("node-fetch");
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding');

var express = require('express');
var router = express.Router();

var app = express();
app.use(express.json());

var decoder = new TextDecoder('utf8');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function(req, res){

  var msg = req.body.txtinput;
  var newClient = new HelloWorldClient();
  var data = newClient.createTransaction(msg);

//console.log(data)

  fetch('http://localhost:8008/batches', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/octet-stream'
    },
    body: data
})
.then((response) => response.json())
.then((responseJson) => {
    console.log(responseJson);
    res.render('index');
  })
  .catch((error) => {
 console.error(error);
  }); 
});








/*
router.post('/', function(req, res, next) {

  var msg = req.body.txtinput;
  var newClient = new HelloWorldClient();
  newClient.createTransaction(msg);
  
  //res.redirect('/readmsg');
  res.render('index');
}); */
/*
router.get('/readmsg', function(req, res, next) {

  var newClient = new HelloWorldClient();
  var geturl = 'http://localhost:8008/state/'+newClient.address;
  res.send(geturl);
  
/*
  fetch(geturl, {
    method: 'GET',
  })
  .then((response) => response.json())
  .then((responseJson) => {
    var data = responseJson.data;
    res.send(data);
    //return data;
  })
  .catch((error) => {
    console.error(error);
  })

});
*/
module.exports = router;

