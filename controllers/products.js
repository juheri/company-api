"use strict";
const models = require("../models/index");
const { error, success } = require("./../config/response_api");
const image_helper = require("../helpers/images");
const tag_controller = require("../controllers/tags");
const validation = require("../helpers/validate");

exports.createProduct = async (req, res) => {
    try {
        const { name, description, code, tags } = req.body;
        const token = req.headers.token;
        const validate = await validation.verifyToken(token);
        if(validate.error) return error(validate.error, 400, res);

        const images = req.files;
        const result = await models.products.create({
            company_id: validate.id,
            name,
            description, 
            code
        });
        let data_images = [];
        images.map(async (data) => {
            data_images.push({
                product_id: result.id,
                filename: data.filename,
            })
            await image_helper.resizeProduct(data.path);
        });
        await models.product_images.bulkCreate(data_images);
        tags && tags.length > 0 && await tag_controller.createProduct(result.id, tags);

        return success("OK", "success", 200, res);
    } catch (err) {
        req.files.map(async (data) => { await image_helper.resizeProduct(data.path) });
        return error("something went wrong", 400, res);
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { name, description, code, product_id, tags } = req.body;
        const token = req.headers.token;
        const validate = await validation.verifyToken(token);
        if(validate.error) return error(validate.error, 400, res);

        const images = req.files;
        if (images && images.length > 0) {
            await image_helper.deleteImageProduct(product_id);
            let data_images = [];
            images.map(async (data) => {
                data_images.push({
                    product_id: product_id,
                    filename: data.filename,
                })
                await image_helper.resizeProduct(data.path);
            });
            await models.product_images.bulkCreate(data_images);
        }
        await models.products.update({
            name,
            description,
            code
        }, {
            where: { 
                id: product_id, 
                company_id: validate.id 
            }
        });
        tags && tags.length > 0 && await tag_controller.updateTagsProduct(product_id, tags);
        return success("OK", "update success", 200, res);
    } catch (err) {
        return error("something went wrong", 400, res);
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { product_id } = req.body;
        const token = req.headers.token;
        const validate = await validation.verifyToken(token);
        if(validate.error) return error(validate.error, 400, res);

        await models.products.destroy({ 
            where: { 
                id: product_id, 
                company_id: validate.id } 
            });
        await models.tags.destroy({ where: { product_id }});

        const result = await models.product_images.findAll({ where: { product_id }});
        result.map(async (data) => { await image_helper.deleteImageError(data.filename) });

        await models.product_images.destroy({ where: { product_id }});
        return success("OK", "delete success", 200, res);
    } catch (err) {
        return error("something went wrong", 400, res);
    }
}