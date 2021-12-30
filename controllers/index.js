"use strict";
const { error, success } = require("./../config/response_api");

exports.index = (req, res) => {
    try {
        res.status(200).json(success("OK", "welcome to my project", res.statusCode));
    } catch (err) {
        res.status(400).json(error("ops something went wrong", 400), res.statusCode)
    }
}