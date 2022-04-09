var Web3 = require('web3');
var aesjs = require('aes-js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const { cpSync } = require('fs');
const stringEntropy = require('fast-password-entropy');

var web3 = new Web3(new Web3.providers.HttpProvider('http://172.20.128.1:8545'));
const privateKey = "28eb4f757ef49136c184db5d5f75bb0879f06512582fb484dfe9bb37ae095e75";
var acc = web3.eth.accounts.privateKeyToAccount(privateKey);
console.log(acc);
//web3.eth.sendTransaction({to:"0x23200B2DcA2a6446b4fA96888d62aB6261817571", from:"0x3583061f9340F24148237Ba580c58286ACa1B7Bd", value:web3.utils.toWei("5", "ether")})

// let utf8Encode = new TextEncoder();
// var z = utf8Encode.encode(privateKey);
// console.log(z);

class Wallet {
    constructor(privateKey) {
        this.privateKey = privateKey;
        this.masterKey = null;
    }

    getPrivateKey() {
        return this.privateKey;
    }

    getMasterKey() {
        if (!this.masterKey) {
            let hash = CryptoJS.SHA256(this.getPrivateKey());
            console.log(hash.toString(CryptoJS.enc.Hex))
            let buffer = Buffer.from(hash.toString(CryptoJS.enc.Hex), 'hex');
            this.masterKey = Array.from( new Uint8Array(buffer) );
        }
        return this.masterKey;
    }

    _SHA256LoopEntropy(data) {
        let entropy = stringEntropy(data);
        console.log("Entropy: %d", entropy);
        let hash = CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
        console.log(hash);
        for(var i=0; i < 5+entropy && i < 256; i++) {
            hash = CryptoJS.SHA256(hash).toString(CryptoJS.enc.Hex);
            console.log(hash);
        }
    }

    _strToByteArray(data) {
        return aesjs.utils.utf8.toBytes(data);
    }

    _byteArrayToStr(data) {
        return aesjs.utils.utf8.fromBytes(data);
    }

    _encrypt(data) {
        var bytes = this._strToByteArray(data);
        var aesCtr = new aesjs.ModeOfOperation.ctr(this.getMasterKey(), new aesjs.Counter(5+stringEntropy(this.getPrivateKey())));
        return aesCtr.encrypt(bytes);
    }

    _decrypt(data) {
        var aesCtr = new aesjs.ModeOfOperation.ctr(this.getMasterKey(), new aesjs.Counter(5+stringEntropy(this.getPrivateKey())));
        return this._byteArrayToStr(aesCtr.decrypt(data));
    }
}

var W = new Wallet(privateKey);
// W._SHA256LoopEntropy(privateKey);
// console.log(W.getMasterKey());
var E = W._encrypt("hello");
console.log(W._decrypt(E));
console.log(JSON.stringify(W))

var E = W._encrypt(JSON.stringify(W));
console.log(E.length)
console.log(W._decrypt(E));