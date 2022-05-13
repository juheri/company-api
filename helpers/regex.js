"use strict";

exports.regexPhone = (phone) => {
  return "+62" + phone.substring(phone.indexOf("8"));
};
