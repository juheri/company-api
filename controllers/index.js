"use strict";
const { error, success } = require("./../config/response_api");

exports.index = (req, res) => {
    try {
        return success("OK", "welcome to my project", 200, res);
    } catch (err) {
        return error("ops something went wrong", 400, res);
    }
}