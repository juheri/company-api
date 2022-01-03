"use strict";
const models = require("../models/index");
const { error, success } = require("./../config/response_api");
const image_helper = require("../helpers/images");
const validation = require("../helpers/validate");

exports.addCover = async (req, res) => {
    try {
        const { description } = req.body;
        const image = req.file;
        const token = req.headers.token;
        const validate = await validation.verifyToken(token);
        if(validate.error) return error(validate.error, 400, res);

        await image_helper.resizeCoverPictures(image.path);
        await models.cover_pictures.create({
            filename: image.filename,
            company_id: validate.id,
            description
        });
        return success("OK", "success", 200, res);
    } catch(err) {
        await image_helper.deleteImageError(req.file.filename);
        return error("something went wrong", 400, res);
    }
}

exports.deleteCover = async (req, res) => {
    try {
        const { cover_id } = req.body;
        const token = req.headers.token;
        const validate = await validation.verifyToken(token);
        if(validate.error) return error(validate.error, 400, res);

        await image_helper.deleteCoverPictures(validate.id, cover_id);
        await models.cover_pictures.destroy({ where: { id: cover_id, company_id: validate.id } });
        return success("OK", "success", 200, res);
    } catch (err){
        return error("something went wrong", 400, res);
    }
}

exports.getCover = async (req, res) => {
    try {
        const unique_url = req.params.unique_url;
        const result = await models.companies.findOne({
            where: { unique_url },
            attributes: ["name", "description", "address", "unique_url"],
            include: {
                model: models.cover_pictures,
                attributes: { exclude: ["company_id"] }
            }
        });
        return success("OK", result, 200, res);
    } catch (err) {
        return error("something went wrong", 400, res);
    }
}

exports.getCoverDetail = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await models.cover_pictures.findOne({
            where: { id },
            attributes: { exclude: ["company_id"] }
        });
        return success("OK", result, 200, res);
    } catch (err) {
        return error("something went wrong", 400, res);
    }
}