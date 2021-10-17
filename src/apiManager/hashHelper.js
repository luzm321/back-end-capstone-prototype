//Marvel Comic API requires a timestamp, and hashed public and private key to be passed in the query string to make fetch calls:

var CryptoJS = require("crypto-js");

export const generateTimestamp = () => {
  return + new Date();
};

export const hashKey = (publicKey, privateKey) => {
    let timeStamp = generateTimestamp();
    let message = timeStamp+publicKey+privateKey;
    let hash = CryptoJS.MD5(message);
    return hash;
};