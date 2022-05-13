"use strict";
const models = require("../models/index");
const tag_controller = require("../controllers/tags");
const { error, success } = require("./../config/response_api");
const image_helper = require("../helpers/images");
const validation = require("./../helpers/validate");
const sequelize = require("sequelize");

exports.Content = async (req, res) => {
  try {
    const { user_id, title, content, tags } = req.body;
    const image = req.file.filename;
    const token = req.headers.token;
    const validate = await validation.verifyToken(token);
    if (token && validate.error) {
      await image_helper.deleteImageError(req.file.filename);
      return error(validate.error, 400, res);
    }

    await image_helper.resizeContent(req.file.path);
    const result = await models.contents.create({
      company_id: validate.id,
      user_id,
      title,
      content,
      image,
    });
    tags &&
      tags.length > 0 &&
      (await tag_controller.createTagsContent(tags, result.id));
    return success("OK", "success", 200, res);
  } catch (err) {
    await image_helper.deleteImageError(req.file.filename);
    return error("ops something went wrong", 400, res);
  }
};

exports.updateContent = async (req, res) => {
  try {
    const { id, title, content, user_id, tags } = req.body;
    const token = req.headers.token;
    const validate = await validation.verifyToken(token);
    if (validate.error) {
      req.file && (await image_helper.deleteImageError(req.file.filename));
      return error(validate.error, 400, res);
    }

    if (!req.file) {
      await models.contents.update(
        {
          title,
          content,
          user_id,
        },
        { where: { id, company_id: validate.id } }
      );
      tags &&
        tags.length > 0 &&
        (await tag_controller.updateTagsContent(id, tags));
      return success("OK", "success", 200, res);
    } else {
      await image_helper.deleteImageContent(id);
      await image_helper.resizeContent(req.file.path);
      await models.contents.update(
        {
          user_id,
          title,
          content,
          image: req.file.filename,
        },
        { where: { id, company_id: validate.id } }
      );
      tags &&
        tags.length > 0 &&
        (await tag_controller.updateTagsContent(id, tags));
      return success("OK", "success", 200, res);
    }
  } catch (err) {
    req.file && (await image_helper.deleteImageError(req.file.filename));
    return error("ops something went wrong", 400, res);
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.body;
    const token = req.headers.token;
    const validate = await validation.verifyToken(token);
    if (validate.error) return error(validate.error, 400, res);

    await image_helper.deleteImageContent(id);
    await models.contents.destroy({ where: { id, company_id: validate.id } });
    await models.tags.destroy({ where: { content_id: id } });
    return success("OK", "success", 200, res);
  } catch (err) {
    return error("ops something went wrong", 400, res);
  }
};

exports.getContent = async (req, res) => {
  try {
    const unique_url = req.params.unique_url;
    const { page, per_page } = req.query;
    const result = await models.companies.findOne({
      where: { unique_url },
      attributes: [
        "name",
        "description",
        "address",
        "created_at",
        "unique_url",
        [
          sequelize.literal(
            "(SELECT COUNT(contents.id) FROM contents WHERE contents.company_id = companies.id)"
          ),
          "total",
        ],
      ],
      include: {
        model: models.contents,
        attributes: [
          "id",
          "title",
          "content",
          "image",
          "created_at",
          [
            sequelize.literal("(SELECT LOWER(REPLACE(title, ' ', '-' )))"),
            "url",
          ],
        ],
        include: [
          {
            model: models.tags,
            attributes: {
              exclude: ["created_at", "updated_at", "product_id", "content_id"],
            },
            required: true,
          },
          {
            model: models.users,
            attributes: ["username"],
            required: true,
          },
        ],
        offset: [page ? parseInt((page - 1) * per_page) : 0],
        limit: [parseInt(per_page) ? parseInt(per_page) : 10],
        order: [["created_at", "DESC"]],
      },
    });
    const data = {
      name: result.dataValues.name,
      description: result.dataValues.description,
      address: result.dataValues.address,
      total: result.dataValues.total,
      contents: result.dataValues.contents,
    };
    return success("OK", data, 200, res);
  } catch (err) {
    return error("ops something went wrong", 400, res);
  }
};

exports.getContentDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await models.contents.findOne({
      where: { id },
      attributes: [
        "id",
        "title",
        "content",
        "image",
        "created_at",
        [sequelize.literal("(SELECT LOWER(REPLACE(title, ' ', '-' )))"), "url"],
      ],
      include: [
        {
          model: models.tags,
          attributes: {
            exclude: ["created_at", "updated_at", "product_id", "content_id"],
          },
        },
        {
          model: models.users,
          attributes: ["username"],
          required: true,
        },
        {
          model: models.companies,
          attributes: ["name", "description", "address", "unique_url"],
        },
      ],
    });
    return success("OK", result, 200, res);
  } catch (err) {
    return error("ops something went wrong", 400, res);
  }
};
