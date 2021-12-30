"use strict";
const models = require("../models/index");
const { error, success } = require("./../config/response_api");

exports.getDetailCompanies = async (req, res) => {
    try {
        const unique_url = req.params.unique_url
        const result = await models.companies.findOne({
            attributes: { exclude: ['created_at', 'updated_at', 'avatar', 'phone', 'unique_url', 'verification', 'status'] },
            where: { unique_url },
            include: [
                {
                    model: models.links,
                    attributes: { exclude: ['created_at', 'updated_at']}
                },
                {
                    model: models.products,
                    include: {
                        model: models.product_images,
                        attributes: { exclude: ['created_at', 'updated_at']}
                    },
                    limit: 5
                }
            ]
        })
        res.status(200).json(success("OK", result, res.statusCode));
    } catch (err) {
        res.status(400).json(error("ops something went wrong", 400), res.statusCode)
    }
}

exports.getDetail = async (id) => {
    try {
        const result = await models.companies.findOne({
            where: { id }
        })
        return { data: result }
    } catch (err) {
        return { error: true }
    }
}