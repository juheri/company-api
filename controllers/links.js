"use strict";
const models = require("../models/index");
const { error, success } = require("./../config/response_api");
const validation = require("./../helpers/validate");


exports.addLinks = async (req, res) => {
    try {
        const { data, name, link } = req.body;
        const token = req.headers.token;
        const validate = await validation.verifyToken(token);
        if(validate.error) return error(validate.error, 400, res);
        if (data) {
            let datas = data.map((data) => {
                return {
                    company_id: validate.id,
                    name: data.name,
                    link: data.link
                }
            });
            await models.links.bulkCreate(datas)
            return success("OK", "success", 200, res);
        }
        await models.links.create({
            company_id: validate.id,
            name,
            link
        });
        return success("OK", "success", 200, res);
    } catch (err) {
        return error("ops something went wrong", 400, res);
    }
}

exports.updateLinks = async (req, res) => {
    try {
        const { id, name, link } = req.body;
        const token = req.headers.token;
        const validate = await validation.verifyToken(token);
        if(validate.error) return error(validate.error, 400, res);

        await models.links.update({
            name,
            link
        },{
            where: { id, company_id: validate.id }
        })
        return success("OK", "success", 200, res);
    } catch (err) {
        return error("ops something went wrong", 400, res);
    }
}

exports.getLinks = async (req, res) => {
    try {
        const company_id = req.params.company_id;
        const result = await models.links.findAll({
            attributes: { exclude: ['created_at', 'updated_at', "company_id"]},
            where: {
                company_id
            }
        })
        return success("OK", result, 200, res);
    } catch (err) { 
        return error("ops something went wrong", 401, res);
    }
}

exports.getLinksDetail = async (req, res) => {
    try {
        const id = req.params.id
        const result = await models.links.findOne({ 
            where: { id },
            attributes: { exclude: ['created_at', 'updated_at', "company_id"]},
        });
        return success("OK", result, 200, res);
    } catch (err) {
        return error("ops something went wrong", 401, res);
    }
}

exports.deleteLinks = async (req, res) => {
    try {
        const id = req.body.id;
        const token = req.headers.token;
        const validate = await validation.verifyToken(token);
        if(validate.error) return error(validate.error, 400, res);

        await models.links.destroy({ where: { id, company_id: validate.id } });
        return success("OK", "success", 200, res);
    } catch (err) {
        return error("ops something went wrong", 401, res);
    }
}