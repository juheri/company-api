"use strict";

const models = require("../models/index");
const { error, success } = require("./../config/response_api");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const validation = require("../helpers/validate");

exports.createTagsContent = async (datas, content_id) => {
    try {
        let tag_data = datas.map( data => {
            return {
                content_id,
                tag: data.startsWith("#") ? data.replace(/\s/g, '') : "#" + data.replace(/\s/g, '')
            }
        });
        await models.tags.bulkCreate(tag_data);
        return true
    } catch (err) {
        return false
    }
}

exports.updateTagsContent = async (content_id, datas) => {
    try {
        await models.tags.destroy({ where: { content_id }});
        let tag_data = datas.map((data) => {
            return {
                content_id,
                tag: data.startsWith("#") ? data.replace(/\s/g, '') : "#" + data.replace(/\s/g, '')
            }
        });
        await models.tags.bulkCreate(tag_data);
        return true
    } catch (err) {
        return false
    }
}

exports.createProduct = async (product_id, datas) => {
    try {
        let tag_data = datas.map( data => {
            return {
                product_id,
                tag: data.startsWith("#") ? data.replace(/\s/g, '') : "#" + data.replace(/\s/g, '')
            }
        });
        await models.tags.bulkCreate(tag_data);
        return true
    } catch (err) {
        return false
    }
}

exports.updateTagsProduct = async (product_id, datas) => {
    try {
        await models.tags.destroy({ where: { product_id }});
        let tag_data = datas.map((data) => {
            return {
                product_id,
                tag: data.startsWith("#") ? data.replace(/\s/g, '') : "#" + data.replace(/\s/g, '')
            }
        });
        await models.tags.bulkCreate(tag_data);
        return true
    } catch (err) {
        return false
    }
}

exports.findByTag = async (req, res) => {
    try {
        const { unique_url, tag } = req.params;
        const { page, per_page } = req.query;
        const result = await models.tags.findAll({
            where: {
                tag: {
                    [Op.like]: "%"+tag+"%"
                }
            },
            attributes: ["id", "tag"],
            include: [
                {
                    model: models.products,
                    attributes: ["id", "name", "description", "code", "created_at",
                        [Sequelize.literal("(SELECT LOWER(REPLACE(product.name, ' ', '-' )))"), "url"]
                    ],
                    required: false,
                    include: [
                        {
                            model: models.product_images,
                            attributes: ["id", "filename"],
                            required: false
                        },
                        {
                            model: models.companies,
                            where: { unique_url },
                            attributes: ["name", "address", "description", "unique_url"],
                            required: false
                        }
                    ]
                },
                {
                    model: models.contents,
                    attributes: ["id", "title", "content", "image", "created_at",
                        [Sequelize.literal("(SELECT LOWER(REPLACE(title, ' ', '-' )))"), "url"]
                    ],
                    required: false,
                    include: {
                        model: models.companies,
                        where: { unique_url },
                        attributes: ["name", "address", "description", "unique_url"],
                        required: false
                    }
                }
            ],
            order: [
                [models.contents,"created_at", "DESC"]
            ],
            offset: [ page ? parseInt((page - 1) * per_page) : 0],
            limit: [ parseInt(per_page) ? parseInt(per_page) : 10 ]
        });
        return success("OK", result, 200, res);
    } catch (err) {
        return error("something went wrong", 400, res);
    }
}

exports.destroy = async (req, res) => {
    try {
        const token = req.headers.token;
        const { id } = req.body;
        const validate = await validation.verifyToken(token);
        if(validate.error) return error(validate.error, 400, res);

        await models.tags.destroy({
            where: { id }
        });
        return success("OK", "success", 200, res);
    } catch (err) {
        return error("something went wrong", 400, res);
    }
}