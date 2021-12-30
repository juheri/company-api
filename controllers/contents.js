"use strict";
const models = require("../models/index");
const tag_controller = require("../controllers/tags");
const { error, success } = require("./../config/response_api");
const image_helper = require("../libs/images");

exports.Content = async (req, res) => {
    try {
        const { user_id, title, content, tags } = req.body
        const image = req.file.filename;
        await image_helper.resizeContent(req.file.path)
        const result = await models.contents.create({
            user_id,
            title,
            content,
            image
        });
        tags && tags.length > 0 ? await tag_controller.createTagsContent(tags, result.id) : null  
        res.status(200).json(success("OK", "success"), res.statusCode)
    } catch (err) {
        await image_helper.deleteImageError(req.file.filename)
        res.status(400).json(error("ops something went wrong", 400), res.statusCode);
    }
}

exports.updateContent = async (req, res) => {
    try {
        const { id, title, content, user_id, tags } = req.body
        // const validate = await models.contents.findOne({ where: { id, user_id } })
        if (!req.file) {
            await models.contents.update({
                title, 
                content
            }, { where: { id, user_id } })
            tags && tags.length > 0 ? await tag_controller.updateTagsContent(id, tags) : null
            res.status(200).json(success("OK", "success"), res.statusCode)
        } else {
            await image_helper.deleteImageContent(id)
            await image_helper.resizeContent(req.file.path)
            await models.contents.update({
                title, 
                content,
                image: req.file.filename
            }, { where: { id, user_id } })
            tags && tags.length > 0 ? await tag_controller.updateTagsContent(id, tags) : null
            res.status(200).json(success("OK", "success"), res.statusCode)
        }
    } catch (err) {
        req.file ? await image_helper.deleteImageError(req.file.filename) : null
        res.status(400).json(error("ops something went wrong", 400), res.statusCode);
    }
}

exports.deleteContent = async (req, res) => {
    try {
        const { id } = req.body;
        await image_helper.deleteImageContent(id);
        await models.contents.destroy({ where: { id } });
        await models.tags.destroy({ where: { content_id: id } });
        res.status(200).json(success("OK", "success"), res.statusCode);
    } catch (err) {
        res.status(400).json(error("ops something went wrong", 400), res.statusCode);
    }
}

exports.getContent = async (req, res) => {
    try {
        let data_final = [];
        const result = await models.contents.findAll({
            attributes: { exclude: ["updated_at", "user_id"]},
            include: [
                {
                    model: models.tags,
                    attributes: { exclude: ["created_at", "updated_at", "product_id", "content_id"]}
                },
                {
                    model: models.users,
                    attributes: ["username"]
                }
            ]
        });
        result.map(data => {
            data_final.push({
                id: data.id,
                title: data.title,
                url: data.title.replace(/\s/g, '-'),
                content: data.content,
                created_at: data.created_at,
                tags: data.tags,
                user: data.user
            })
        })
        res.status(200).json(success("OK", data_final), res.statusCode);
    } catch (err) {
        res.status(400).json(error("ops something went wrong", 400), res.statusCode);
    }
}