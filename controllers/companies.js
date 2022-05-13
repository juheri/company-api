"use strict";
const models = require("../models/index");
const { error, success } = require("./../config/response_api");
const sequelize = require("sequelize");

exports.getDetailCompanies = async (req, res) => {
  try {
    const unique_url = req.params.unique_url;
    const result = await models.companies.findOne({
      attributes: {
        exclude: [
          "created_at",
          "updated_at",
          "avatar",
          "unique_url",
          "verification",
          "status",
        ],
      },
      where: { unique_url },
      include: [
        {
          model: models.links,
          attributes: {
            exclude: ["id", "created_at", "updated_at", "company_id"],
          },
          required: false,
        },
        {
          model: models.products,
          include: {
            model: models.product_images,
            attributes: { exclude: ["updated_at", "company_id"] },
          },
          limit: 5,
          required: false,
          order: [["created_at", "DESC"]],
        },
        {
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
          limit: 5,
          required: false,
          order: [["created_at", "DESC"]],
        },
        {
          model: models.cover_pictures,
          attributes: ["id", "filename", "description"],
          required: false,
          order: [["created_at", "DESC"]],
        },
      ],
    });
    if (!result) return success("data not found", {}, 200, res);
    const data = {
      name: result.dataValues.name,
      logo: result.dataValues.logo,
      address: result.dataValues.address,
      description: result.dataValues.description,
      phone: result.dataValues.phone,
      email: result.dataValues.email,
      links: result.dataValues.links,
      products: result.dataValues.products,
      contents: result.dataValues.contents,
      cover_pictures: result.dataValues.cover_pictures,
    };
    return success("OK", data, 200, res);
  } catch (err) {
    console.log(err);
    return error("ops something went wrong", 400, res);
  }
};

exports.getDetail = async (id) => {
  try {
    const result = await models.companies.findOne({
      where: { id },
    });
    return { data: result };
  } catch (err) {
    return { error: true };
  }
};
