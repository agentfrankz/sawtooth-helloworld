const {HelloWorldClient} = require('./HelloWorldClient');
const fetch = require("node-fetch");
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding');

var express = require('express');
var router = express.Router();

var newClient = new HelloWorldClient();
var decoder = new TextDecoder('utf8');
var x = decoder.decode("Y2FzaA==");


var geturl = 'http://localhost:8008/state/'+newClient.address;
router.get('/', function(req, res){
   

    //var data = newClient._send_to_rest_api(null);
    //res.send(newClient.address);

     // resp = await fetch()

    fetch(geturl, {
        method: 'GET',
      })
      .then((response) => response.json())
      .then((responseJson) => {
        var data = responseJson.data;
        var datastr = JSON.stringify(data);
        console.log("############### " + datastr);
        var finaldata = new Buffer(datastr, 'base64');
        res.send(finaldata.toString());
        //return data;
      })
      .catch((error) => {
        console.error(error);
      });
});



module.exports = router;