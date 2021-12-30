"use strict";
const models = require("../models/index");
const { error, success } = require("./../config/response_api");


exports.addLinks = async (req, res) => {
    try {
        const { company_id, data, name, link } = req.body
        if (data) {
            let datas = []
            for (let i = 0; i < data.length; i++) {
                datas.push({
                    company_id,
                    name: data[i].name,
                    link: data[i].link
                })
            }
            await models.links.bulkCreate(datas)
            res.status(200).json(success("OK", "success", res.statusCode));
        } else {
            await models.links.create({
                company_id,
                name,
                link
            })
            res.status(200).json(success("OK", "success", res.statusCode));
        }
    } catch (err) {
        res.status(400).json(error("ops something went wrong", 400), res.statusCode)
    }
}

exports.updateLinks = async (req, res) => {
    try {
        const { id, name, link, company_id } = req.body
        await models.links.update({
            name,
            link
        },{
            where: { id, company_id }
        })
        res.status(200).json(success("OK", "update success", res.statusCode));
    } catch (err) {
        res.status(400).json(error("ops something went wrong", 400), res.statusCode)
    }
}

exports.getLinks = async (req, res) => {
    try {
        const company_id = req.params.company_id
        const result = await models.links.findAll({
            attributes: { exclude: ['created_at', 'updated_at']},
            where: {
                company_id
            }
        })
        res.status(200).json(success("OK", result, res.statusCode));
    } catch (err) { 
        res.status(400).json(error("ops something went wrong", 400), res.statusCode)
    }
}

exports.getLinksDetail = async (req, res) => {
    try {
        const id = req.params.id
        const result = await models.links.findOne({ where: { id } })
        res.status(200).json(success("OK", result, res.statusCode));
    } catch (err) {
        res.status(400).json(error("ops something went wrong", 400), res.statusCode)
    }
}

exports.deleteLinks = async () => {
    try {
        const id = req.body.id
        await models.links.destroy({ where: {id} })
        res.status(200).json(success("OK", "success", res.statusCode));
    } catch (err) {
        res.status(400).json(error("ops something went wrong", 400), res.statusCode)
    }
}