"use strict";
const models = require("../models/index");
const { error, success } = require("./../config/response_api");
const image_helper = require("../helpers/images");
const tag_controller = require("../controllers/tags");
const validation = require("../helpers/validate");
const sequelize = require("sequelize");

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
        if (
            images && 
            images.length > 0
        ) {
            let data_images = [];
            images.map(async (data) => {
                data_images.push({
                    product_id,
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
                company_id: validate.id 
            } 
        }).then(async() => {
            await image_helper.deleteImageProduct(product_id).then(async() => {
                await models.tags.destroy({ where: { product_id }});
            });
        });
        return success("OK", "delete success", 200, res);
    } catch (err) {
        return error("something went wrong", 400, res);
    }
}

exports.getProduct = async (req, res) => {
    try {
        const unique_url = req.params.unique_url;
        const { page, per_page } = req.query;
        const result = await models.companies.findOne({
            where: { unique_url },
            attributes: ["name", "description", "address", "unique_url",
                [
                    sequelize.literal(
                        "(SELECT COUNT(products.id) FROM products WHERE products.company_id = companies.id)"
                    ), "total"
                ]
            ],
            include: {
                model: models.products,
                attributes: ["id","name", "description", "code", "created_at"],
                include: {
                    model: models.product_images,
                    attributes: ["id", "filename"],
                    required: true
                },
                offset: [ page ? parseInt((page - 1) * per_page) : 0],
                limit: [ parseInt(per_page) ? parseInt(per_page) : 10 ],
                order: [
                    ["created_at", "DESC"]
                ]
            }
        });
        const data = {
            name: result.dataValues.name,
            description: result.dataValues.description,
            address: result.dataValues.address,
            total: result.dataValues.total,
            products: result.dataValues.products
        }
        return success("OK", data, 200, res);
    } catch (err) {
        return error("can't get data", 400, res);
    }
}

exports.getProductDetail = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await models.products.findOne({
            where: { id },
            attributes: ["id","name", "description", "code", "created_at"],
            include: [
                {
                    model: models.product_images,
                    attributes: ["id", "filename"],
                    required: true
                },
                {
                    model: models.tags,
                    attributes: { exclude: ["created_at", "updated_at", "product_id", "content_id"] },
                },
                {
                    model: models.companies,
                    attributes: ["name", "description", "address", "unique_url"],
                    required: true
                }
            ]
        });
        return success("OK", result, 200, res);
    } catch (err) {
        return error("invalid params", 400, res);
    }
}

exports.getProductCompany = async (req, res) => {
    try {
        const { page, per_page } = req.query;
        const token = req.headers.token;
        const validate = await validation.verifyToken(token);
        if(validate.error) return error(validate.error, 400, res);
        
        const result = await models.products.findAndCountAll({
            where: {
                company_id: validate.id
            },
            attributes: ["id","name", "description", "code", "created_at"],
            distinct: true,
            include: [
                {
                    model: models.product_images,
                    attributes: ["id", "filename"],
                    required: true
                },
                {
                    model: models.tags,
                    attributes: ["id", "tag"],
                    required: false
                }
            ],
            offset: [ page ? parseInt((page - 1) * per_page) : 0],
            limit: [ parseInt(per_page) ? parseInt(per_page) : 10 ],
            order: [
                ["created_at", "DESC"]
            ]
        });
        return success("OK", result, 200, res);
    } catch (err) {
        return error("something went wrong", 400, res);
    }
}

exports.deleteProductImage = async (req, res) => {
    try {
        const { id } = req.body;
        const token = req.headers.token;
        const validate = await validation.verifyToken(token);
        if(validate.error) return error(validate.error, 400, res);

        await models.product_images.findOne({
            where: { id }
        }).then(async(data) => {
            await image_helper.deleteImageError(data.filename).then(async() => {
                await models.product_images.destroy({
                    where: { id }
                });
            });
        });
        return success("OK", "delete success", 200, res);
    } catch (err) {
        return error("something went wrong", 400, res);
    }
}