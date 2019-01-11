
const fs = require('fs');
const {createHash} = require('crypto');
const {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1');
const {CryptoFactory, createContext } = require('sawtooth-sdk/signing');
const {protobuf} = require('sawtooth-sdk');
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding');
const fetch = require("node-fetch");

var express = require('express');
var router = express.Router();

FAMILY_NAME="helloworldtf";

  
privateKeyHex = "66ad89d0ff29b0267fba72ea8d40ef7975e10f8acde8d50d20cdf56ba9599c5e";

function hash(v) {
    return createHash('sha512').update(v).digest('hex');
}

class HelloWorldClient{

  constructor(msg){
    
    //---------------private key from string
    const context = createContext('secp256k1');
    const secp256k1pk = Secp256k1PrivateKey.fromHex(privateKeyHex.trim());
    this.signer = new CryptoFactory(context).newSigner(secp256k1pk);
    this.publicKey = this.signer.getPublicKey().asHex();
    console.log(this.publicKey);

    //console.log(msg)
    
    /*
    var userprivkeyfile = '/home/franklin/keys/key1.priv';
    const context = createContext('secp256k1');
    const privateKeyStrBuf = fs.readFileSync(userprivkeyfile);
    const privateKeyStr = privateKeyStrBuf.toString().trim();
    const privateKey = Secp256k1PrivateKey.fromHex(privateKeyStr);
    this.signer = new CryptoFactory(context).newSigner(privateKey);
    var publicKey = this.signer.getPublicKey().asHex();
      console.log(publicKey);
    */


    /*---------------private key simplewallet style
    const privateKeyStrBuf = this.getUserPrivKey();
    const privateKeyStr = privateKeyStrBuf.toString().trim();
    const context = createContext('secp256k1');
    const privateKey = Secp256k1PrivateKey.fromHex(privateKeyStr);
    this.signer = new CryptoFactory(context).newSigner(privateKey);
    this.publicKey = this.signer.getPublicKey().asHex();
    */

    //console.log(privateKey);
    
    //console.log(this.publicKey);
    this.address = hash(FAMILY_NAME).substr(0, 6) + hash(this.publicKey).substr(0, 64);
    this.payload = msg;
    //console.log(this.payload);
    this.payloadBytes = new TextEncoder('utf8').encode(this.payload);
  }
    createTransaction(){
        const transactionHeaderBytes = protobuf.TransactionHeader.encode({
            batcherPublicKey: this.signer.getPublicKey().asHex(),
            dependencies: [],
            familyName: FAMILY_NAME,
            familyVersion: '1.0',
            inputs: [this.address],
            nonce: Math.random().toString(),
            outputs: [this.address],
            payloadSha512: hash(this.payloadBytes),
            signerPublicKey: this.signer.getPublicKey().asHex()
        }).finish();
        const transaction = protobuf.Transaction.create({
            header: transactionHeaderBytes,
            headerSignature: this.signer.sign(transactionHeaderBytes),
            payload: this.payloadBytes
        });
        const transactions = [transaction];
        const batchHeaderBytes = protobuf.BatchHeader.encode({
            signerPublicKey: this.signer.getPublicKey().asHex(),
            transactionIds: transactions.map((txn) => txn.headerSignature),
        }).finish();
        const batchSignature = this.signer.sign(batchHeaderBytes);
        const batch = protobuf.Batch.create({
            header: batchHeaderBytes,
            headerSignature: batchSignature,
            transactions: transactions
        });
        const batchListBytes = protobuf.BatchList.encode({
            batches: [batch]
        }).finish();

        this._send_to_rest_api(batchListBytes);	  
    
    }
    _send_to_rest_api(batchListBytes){
      if (batchListBytes == null) {
        var geturl = 'http://localhost:8008/state/'+this.address
        console.log("Getting from: " + geturl);
        return fetch(geturl, {
          method: 'GET',
        })
        .then((response) => response.json())
        .then((responseJson) => {
          var data = responseJson.data;
          return data;
        })
        .catch((error) => {
          console.error(error);
        })	
      }
      else{
        fetch('http://localhost:8008/batches', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/octet-stream'
          },
          body: batchListBytes
    })
    .then((response) => response.json())
    .then((responseJson) => {
          console.log(responseJson);
        })
        .catch((error) => {
       console.error(error);
        }); 	
      }
    }
  }

module.exports.HelloWorldClient = HelloWorldClient;
