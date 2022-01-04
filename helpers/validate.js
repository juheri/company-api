"use strict";

const models = require("../models/index");
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const Op = Sequelize.Op

exports.validate = async (phone, email, unique_url) => {
    try {
        const validate = await models.companies.findOne({
            attributes:["phone", "email", "unique_url"],
            where: {
                [Op.or]: [{ email }, { phone }, { unique_url }]
            },
            include: {
                model: models.users,
                attributes:["phone", "email"],
                where: {
                    [Op.or]: [{ email }, { phone }]
                }
            }
        });
        return validate ? false : true
    } catch (err) {
        return false
    }
}

exports.imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|jfif)$/)) {
        req.fileValidationError = "Only image files are allowed!";
        return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
}

exports.generateToken = async (data, status, id) => {
    try {
        const expired = process.env.TOKEN_EXPIRED;
        const token = await jwt.sign(data, process.env.SECRET_KEY, { expiresIn: expired });
        if (status) {
            await models.users.update({ token },
                { where: { id } }
            );
        }
        return token
    } catch (err) {
        return false;
    }
}

exports.verifyToken = async (token) => {
    try {
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        const find = await models.users.findOne({ 
            attributes: ["id"],
            where: { token },
            include: {
                model: models.companies,
                attributes: ["id"],
                where: {
                    id: decoded.id
                }
            }
        });
        if (!find) return { error: "session expired or not valid" }
        return decoded;
    } catch (err) {
        return { error: "session expired or not valid" }
    }
}