"use strict";
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const CryptoJS = require("crypto-js");

exports.password = async (data, res) => {
  try {
    return bcrypt.hashSync(data, salt);
  } catch (err) {
    return false;
  }
};

exports.comparePassword = async (password, db_password) => {
  try {
    const validate = bcrypt.compareSync(password, db_password);
    return validate ? true : false;
  } catch (err) {
    return false;
  }
};

exports.encryptCrypto = async (datas) => {
  try {
    return CryptoJS.AES.encrypt(
      JSON.stringify(datas),
      process.env.SECRET_KEY
    ).toString();
  } catch (err) {
    return false;
  }
};
