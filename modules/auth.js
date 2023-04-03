const CryptoJS = require("crypto-js");

module.exports = {
  masterKey: "7d60febfd9c79bf45ec6126f14dfe69a57444099",

  encrypt(token) {
    return CryptoJS.AES.encrypt(token, this.masterKey).toString();
  },

  decrypt(cipher) {
    return CryptoJS.AES.decrypt(cipher, this.masterKey).toString(CryptoJS.enc.Utf8);
  }
}