"use strict";
const models = require("../models/index");
const bcrypt = require("bcryptjs");
const validation = require("../libs/validate");
const { error, success } = require("./../config/response_api");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const regex = require("../libs/regex");
const image_helper = require("../libs/images");
var CryptoJS = require("crypto-js");

exports.Register = async (req ,res) => {
    try {
        const { name, address, phone, email, unique_url, password, username } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const encrypted = await bcrypt.hashSync(password, salt);
        const phone_number = regex.regexPhone(phone);
        const result_validate = await validation.validate(phone_number, email, unique_url);

        if (result_validate.error == false) {
            const result_company = await models.companies.create({
                name,
                address,
                email,
                phone: phone_number,
                unique_url,
                status: 'FREE',
                verification: 0
            });
            const token = await validation.generateToken({ email, company_id: result_company.id, phone_number })
            await models.users.create({
                company_id: result_company.id,
                username,
                email,
                phone: phone_number,
                password: encrypted,
                role: 'OWNER',
                token: token.data ? token.data : null
            });
            res.status(200).json(success("OK", "success", res.statusCode));
        } else {
            res.status(400).json(error("your data has been used", 400), res.statusCode)
        }
    } catch (err) {
        res.status(400).json(error("something went wrong", 400), res.statusCode)
    }
}

exports.Login = async (req, res) => {
    try {
        const { password, key } = req.body
        const result = await models.users.findOne({ where: { [Op.or]: [{ email: key }, { phone: key }] } })
        if (result != null) {
            const db_password = result.password
            const check_password = bcrypt.compareSync(password, db_password)
            if (check_password) {
                // const token = await validation.generateToken(
                //     { email: result.email, company_id: result.company_id, phone_number: result.phone })
                // await models.users.update({ token: token.data }, { where: { id: result.id } })
                const datas = { 
                    user_email: result.email, 
                    company_id: result.company_id, 
                    user_phone: result.phone,
                    user_id: result.id
                }
                let encrypted = CryptoJS.AES.encrypt(JSON.stringify(datas), process.env.SECRET_KEY).toString()
                res.status(200).json(success("OK", encrypted, res.statusCode))
            } else {
                res.status(400).json(error("your password is wrong", 400), res.statusCode)
            }
        } else {
            res.status(400).json(error("data not found", 400), res.statusCode)
        }
    } catch (err) {
        console.log(err)
        res.status(400).json(error("something went wrong", 400), res.statusCode)
    }
}

exports.Description = async (req, res) => {
    try {
        const { company_id, description } = req.body
        await models.companies.update({ description }, { where: { id: company_id } })
        res.status(200).json(success("OK", "success", res.statusCode));
    } catch (err) {
        res.status(400).json(error("failed update description", 400), res.statusCode)
    }
}

exports.Logo = async (req, res) => {
    try {
        await image_helper.DeleteImageCompany(req.body.company_id, "logo");
        await image_helper.resize(req.file.path)
        await models.companies.update({ logo: req.file.filename }, {
                where: { id: req.body.company_id }
            })
        res.status(200).json(success("OK", "update success"), res.statusCode)
    } catch (err) {
        await image_helper.deleteImageError(req.file.filename)
        res.status(400).json(error("failed update", 400), res.statusCode)
    }
}

exports.Avatar = async (req, res) => {
    try {
        await image_helper.DeleteImageCompany(req.body.company_id, "avatar");
        await image_helper.resize(req.file.path)
        await models.companies.update({ avatar: req.file.filename }, {
            where: { id: req.body.company_id }
        });
        res.status(200).json(success("OK", "update success"), res.statusCode)
    } catch (err) {
        await image_helper.deleteImageError(req.file.filename)
        res.status(400).json(error("failed update", 400), res.statusCode)
    }
}
