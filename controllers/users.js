"use strict";
const models = require("../models/index");
const validation = require("../helpers/validate");
const { error, success } = require("./../config/response_api");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const regex = require("../helpers/regex");
const image_helper = require("../helpers/images");
const secret = require("../helpers/secret");

exports.Register = async (req, res) => {
    try {
        let { name, address, phone, email, unique_url, password, username } = req.body;
        phone = regex.regexPhone(phone);
        password = await secret.password(password, res);
        const validate = await validation.validate(
            phone,
            email,
            unique_url
        );
        if (!validate) return error("your data has been used", 400, res);

        const result_company = await models.companies.create({
            name,
            address,
            email,
            phone,
            unique_url,
            status: "FREE",
            verification: "0",
        });
        const token = await validation.generateToken({
            id: result_company.id
        });
        await models.users.create({
            company_id: result_company.id,
            username,
            email,
            phone,
            password,
            role: "OWNER",
            token
        });
        return success("OK", "success", 200, res);
    } catch (err) {
        return error("something went wrong", 400, res);
    }
};

exports.Login = async (req, res) => {
    try {
        const { password, key } = req.body;
        const result = await models.users.findOne({
            where: {
                [Op.or]: [{ email: key }, { phone: key }],
            }
        });
        if (!result) return error("data not found", 400, res);
        
        const validate = await secret.comparePassword(password, result.password);
        if(!validate) return error("your password is wrong", 400, res);

        const token = await validation.generateToken({
            id: result.company_id
        }, "update", result.id);
        const encrypted = await secret.encryptCrypto({
            user_email: result.email,
            user_phone: result.phone,
            username: result.username,
            id: result.id,
            token
        });
        return success("OK", encrypted, 200, res);
    } catch (err) {
        return error("something went wrong", 400, res);
    }
};

exports.Description = async (req, res) => {
    try {
        const description = req.body.description;
        const token = req.headers.token;
        const validate = await validation.verifyToken(token);
        if(validate.error) return error(validate.error, 400, res);

        await models.companies.update(
            { description },
            { where: { id: validate.id } }
        );
        return success("OK", "success", 200, res);
    } catch (err) {
        return error("something went wrong", 400, res);
    }
};

exports.Logo = async (req, res) => {
    try {
        const token = req.headers.token;
        const validate = await validation.verifyToken(token);
        if(validate.error) return error(validate.error, 400, res);

        await image_helper.DeleteImageCompany(validate.id, "logo").then(async() => {
            await image_helper.resize(req.file.path).then(async () => {
                await models.companies.update(
                    { logo: req.file.filename },
                    {
                        where: { id: validate.id }
                    }
                );
            });
        });
        return success("OK", "success", 200, res);
    } catch (err) {
        await image_helper.deleteImageError(req.file.filename);
        return error("failed", 400, res);
    }
};

exports.Avatar = async (req, res) => {
    try {
        const token = req.headers.token;
        const validate = await validation.verifyToken(token);
        if(validate.error) return error(validate.error, 400, res);

        await image_helper.DeleteImageCompany(validate.id, "avatar").then( async () => {
            await image_helper.resize(req.file.path).then(async () => {
                await models.companies.update(
                    { avatar: req.file.filename },
                    {
                        where: { id: validate.id }
                    }
                );
            });
        });
        return success("OK","success", 200, res);
    } catch (err) {
        await image_helper.deleteImageError(req.file.filename);
        return error("failed", 400, res);
    }
};

exports.addUser = async (req, res) => {
    try {
        const token = req.headers.token;
        let { email, phone, password, role, username } = req.body;
        phone = regex.regexPhone(phone);
        password = await secret.password(password, res);

        const validate = await validation.verifyToken(token);
        if(validate.error) return error(validate.error, 400, res);
        
        const result = await models.users.findOne({
            where: { phone, email }
        });
        if (result) return error("your data has been used", 400, res);

        const user_token = await validation.generateToken({
            id: validate.id
        });
        await models.users.create({
            company_id: validate.id,
            username,
            email,
            phone,
            password,
            role,
            token: user_token
        });
        return success("OK", "create data success", 200, res);
    } catch (err){
        return error("can't create data", 400, res);
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const token = req.headers.token;
        const { id } = req.body;
        const validate = await validation.verifyToken(token);
        if(validate.error) return error(validate.error, 400, res);

        const result = await models.users.findOne({
            where: { id }
        });
        if(
            !result || 
            result.role === "OWNER"
        ) return error("your data is wrong", 400, res);
        
        await models.users.destroy({
            where: { id }
        });
        return success("OK", "success", 200, res);
    } catch (err) {
        return error("something went wrong", 400, res);
    }
}