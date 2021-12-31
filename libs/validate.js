"use strict";

const models = require("../models/index");
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const Op = Sequelize.Op

exports.validate = async (phone_number, email, unique_url) => {
    try {
        const validate_url = await models.companies.findOne({ where: { unique_url } })
        const validate = await models.companies.findOne({
            attributes:['phone', 'email', 'unique_url'],
            where: {
                [Op.or]: [{ email }, { phone: phone_number }],
            },
            include: {
                model: models.users,
                attributes:['phone', 'email'],
                where: {
                    [Op.or]: [{ email: email }, { phone: phone_number }]
                }
            }
        });
        return !validate_url && !validate ? { error : false } : { error: true }
    } catch (err) {
        return { error: true }
    }
}

exports.imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
}

exports.generateToken = async (data) => {
    try {
        const token = jwt.sign(data, process.env.SECRET_KEY, { expiresIn: '0'})
        return { data: token }
    } catch (err) {
        return { error: true }
    }
}

exports.verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        return { data: decoded }
    } catch (err) {
        return { error: "token expire or token not valid" }
    }
}