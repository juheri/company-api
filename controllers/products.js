"use strict";
const models = require("../models/index");
const { error, success } = require("./../config/response_api");
const image_helper = require("../libs/images");
const tag_controller = require("../controllers/tags");

exports.createProduct = async (req, res) => {
    try {
        const { company_id, name, description, code, tags } = req.body;
        const images = req.files;
        const result = await models.products.create({
            company_id,
            name,
            description, 
            code
        });
        let data_images = []
        images.map(async (data) => {
            data_images.push({
                product_id: result.id,
                filename: data.filename,
            })
            await image_helper.resizeProduct(data.path);
        })
        await models.product_images.bulkCreate(data_images);
        tags && tags.length > 0 ? await tag_controller.createProduct(result.id, tags) : null

        res.status(200).json(success("OK", "success"), res.statusCode);
    } catch (err) {
        req.files.map(async (data) => { await image_helper.resizeProduct(data.path) })
        res.status(400).json(error("something went wrong", 400), res.statusCode);
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { company_id, name, description, code, product_id, tags } = req.body;
        const images = req.files;
        if (images && images.length > 0) {
            await image_helper.deleteImageProduct(product_id)
            let data_images = []
            images.map(async (data) => {
                data_images.push({
                    product_id: product_id,
                    filename: data.filename,
                })
                await image_helper.resizeProduct(data.path);
            })
            await models.product_images.bulkCreate(data_images);
        }
        await models.products.update({
            name,
            description,
            code
        }, {
            where: { id: product_id, company_id }
        });
        tags && tags.length > 0 ? await tag_controller.updateTagsProduct(product_id, tags) : null
        res.status(200).json(success("OK", "update success"), res.statusCode);
    } catch (err) {
        res.status(400).json(error("something went wrong", 400), res.statusCode);
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { product_id, company_id } = req.body;
        await models.products.destroy({ where: { id: product_id, company_id } })
        await models.tags.destroy({ where: { product_id }})
        const result = await models.product_images.findAll({ where: { product_id }})
        result.map(async (data) => { await image_helper.deleteImageError(data.filename) })
        await models.product_images.destroy({ where: { product_id }})
        res.status(200).json(success("OK", "delete success"), res.statusCode);
    } catch (err) {
        res.status(400).json(error("something went wrong", 400), res.statusCode);
    }
}