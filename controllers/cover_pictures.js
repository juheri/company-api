"use strict";
const models = require("../models/index");
const { error, success } = require("./../config/response_api");
const image_helper = require("../libs/images");

exports.index = async () => {
    
}

exports.addCover = async (req, res) => {
    try {
        const { company_id, description } = req.body
        const image = req.file;
        let data = {
            filename: image.filename,
            company_id,
            description
        }
        await image_helper.resizeCoverPictures(image.path);
        await models.cover_pictures.create(data);
        res.status(200).json(success("OK", "success"), res.statusCode);
    } catch(err) {
        console.log(err)
        res.status(400).json(error("something went wrong", 400), res.statusCode);
    }
}

exports.deleteCover = async (req, res) => {
    try {
        const { company_id, cover_id } = req.body;
        await image_helper.deleteCoverPictures(company_id, cover_id)
        await models.cover_pictures.destroy({ where: { id: cover_id, company_id } });
        res.status(200).json(success("OK", "success"), res.statusCode);
    } catch (err){
        res.status(400).json(error("something went wrong", 400), res.statusCode);
    }
}