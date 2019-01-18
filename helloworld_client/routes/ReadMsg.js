const {HelloWorldClient} = require('./HelloWorldClient');
const fetch = require("node-fetch");

var express = require('express');
var router = express.Router();

var newClient = new HelloWorldClient();

var geturl = 'http://rest-api:8008/state/'+newClient.address;
router.get('/', function(req, res){
fetch(geturl)
      .then((response) => response.json())
      .then((responseJson) => {
        var data = responseJson.data;
        var datastr = JSON.stringify(data);
        var finaldata = new Buffer(datastr, 'base64').toString();
        res.send(finaldata);
        //return data;
      })
      .catch((error) => {
        console.error(error);
      })
});



module.exports = router;