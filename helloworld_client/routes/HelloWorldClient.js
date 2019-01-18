
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
NAMESPACE="";

  
privateKeyHex = "66ad89d0ff29b0267fba72ea8d40ef7975e10f8acde8d50d20cdf56ba9599c5e";

function hash(v) {
    return createHash('sha512').update(v).digest('hex');
}

class HelloWorldClient{

  constructor(){
    
    //---------------private key from string
    const context = createContext('secp256k1');
    const secp256k1pk = Secp256k1PrivateKey.fromHex(privateKeyHex.trim());
    this.signer = new CryptoFactory(context).newSigner(secp256k1pk);
    this.publicKey = this.signer.getPublicKey().asHex();

    NAMESPACE = hash(FAMILY_NAME).substr(0, 6);
    this.address = NAMESPACE + hash(this.publicKey).substr(0, 64);    
  }
    createTransaction(msg){
      this.payload = msg;
      this.payloadBytes = new TextEncoder('utf8').encode(this.payload);
        const transactionHeaderBytes = protobuf.TransactionHeader.encode({
            batcherPublicKey: this.signer.getPublicKey().asHex(),
            dependencies: [],
            familyName: FAMILY_NAME,
            familyVersion: '1.0',
            inputs: [NAMESPACE],
            nonce: Math.random().toString(),
            outputs: [NAMESPACE],
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
return batchListBytes;
    
    }

  }

module.exports.HelloWorldClient = HelloWorldClient;
