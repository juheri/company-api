"use strict";
const models = require("../models/index");

exports.createTagsContent = async (datas, content_id) => {
    try {
        let tag_data = datas.map( data => {
            return {
                content_id,
                tag: data.replace(/\s/g, '')
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
                tag: data.replace(/\s/g, '')
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
                tag: data.replace(/\s/g, '')
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
                tag: data.replace(/\s/g, '')
            }
        });
        await models.tags.bulkCreate(tag_data);
        return true
    } catch (err) {
        return false
    }
}