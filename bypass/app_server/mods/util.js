//============================================================
//Secure
const crypto = require("crypto");
const algorithm = "aes-128-cbc";
var key = "mynameisrealwedrive";
var iv = "ealwedrivemynameisr";

key = key.substr(0, 16);
iv = iv.substr(0, 16);

const salt = "_wrd20190903";

//============================================================
//SMS
const request = require("request");
const accesskeyID = "xm1Sc1R2UwnH5CpDgl0W";
const secretkey = "bffb39a0c77243d09ec899b108014d69";
const serviceID = "ncp:sms:kr:114626936:novelux";

var util = {
  decrypt: function (text) {
    var decipher = crypto.createDecipheriv(algorithm, key, iv);
    var dec = decipher.update(text, "base64", "utf-8");
    dec += decipher.final();
    return dec.replace(salt, "");
  },
  encrypt: function (text) {
    var cipher = crypto.createCipheriv(algorithm, key, iv);
    let result = cipher.update(salt + text, "utf8", "base64"); // 'HbMtmFdroLU0arLpMflQ'
    result += cipher.final("base64"); // 'HbMtmFdroLU0arLpMflQYtt8xEf4lrPn5tX5k+a8Nzw='
    return result;
  },
  decryptHex: function (text) {
    var decipher = crypto.createDecipheriv(algorithm, key, iv);
    var dec = decipher.update(text, "hex", "utf-8");
    dec += decipher.final();
    return dec.replace(salt, "");
  },
  encryptHex: function (text) {
    var cipher = crypto.createCipheriv(algorithm, key, iv);
    let result = cipher.update(salt + text, "utf8", "hex");
    result += cipher.final("hex");
    return result;
  },
  sendSMS: (recv, comment, callback) => {
    var option = {
      url: `https://api-sens.ncloud.com/v1/sms/services/${serviceID}/messages`,
      method: "post",
      json: true,
      headers: {
        "Content-Type": "application/json",
        "x-ncp-auth-key": accesskeyID,
        "x-ncp-service-secret": secretkey,
      },
      body: {
        type: "SMS",
        contentType: "COMM",
        countryCode: "82",
        from: "0325650165",
        to: [recv],
        content: comment,
      },
    };

    request.post(option, (err, response, body) => {
      if (err) {
        throw err;
      } else {
        callback(body);
      }
    });
  },
  //GPS 거리
  getDistance: (lat1, lon1, lat2, lon2, unit) => {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") {
        dist = dist * 1.609344;
      }
      if (unit == "N") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  },
};

module.exports = util;
