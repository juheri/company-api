"use strict";

const models = require("../models/index");
const fs = require("fs");
const publicDir = require("path").join(__dirname, "../uploads/");
const sharp = require('sharp');
const e = require("express");


exports.DeleteImageCompany = async (id, type) => {
    try {
        const result = await models.companies.findOne({ where: { id } })
        if (result && type == "logo") {
            validation(result.logo)
            return { error: false }
        } else if (result && type == "avatar"){
            validation(result.avatar)
            return { error: false }
        } else {
            return { error: true }
        }
    } catch (err) {
        return { error : true }
    }
}

const validation = (image) => {
    fs.existsSync(publicDir + image) ? 
        fs.unlinkSync(publicDir + image) : null
    return true
}

exports.deleteImageError = async (image) => {
    try {
        fs.existsSync(publicDir + image) ? 
        fs.unlinkSync(publicDir + image) : null
        return true
    } catch (err) {
        return { error: true }
    }
}

exports.deleteImageContent = async (id) => {
    try {
        const result = await models.contents.findOne({ where: { id } })
        if (result) {
            fs.existsSync(publicDir + result.image) ? 
                fs.unlinkSync(publicDir + result.image) : null
            return true
        } else {
            return { error : true }
        }
    } catch (err){
        return { error: true }
    }
}

exports.deleteImageProduct = async (product_id) => {
    try {
        const result = await models.product_images.findAll({ where: { product_id }})
        if ( result.length > 0 ) {
            result.map(data => {
                fs.existsSync(publicDir + data.filename) ? 
                    fs.unlinkSync(publicDir + data.filename) : null
            })
            await models.product_images.destroy({ where: { product_id } })
            return { error: false }
        }
    } catch (err) {
        return { error : true }
    }
}

exports.resize = async (path_file) => {
    try {
        const resize = await sharp(path_file).resize({
            width: 100,
            height: 100
        }).toBuffer();
        await sharp(resize).toFile(path_file);
        return { error: false}
    } catch (err) {
        return { error: true }
    }
}

exports.resizeProduct = async (path_file) => {
    try {
        const resize = await sharp(path_file).resize({
            width: 500,
            height: 500
        }).toBuffer();
        await sharp(resize).toFile(path_file);
        return { error: false}
    } catch (err) {
        return { error: true }
    }
}

exports.resizeContent = async (path_file) => {
    try {
        const resize = await sharp(path_file).resize({
            width: 750,
            height: 400
        }).toBuffer();
        await sharp(resize).toFile(path_file);
        return { error: false}
    } catch (err) {
        return { error: true }
    }
}

exports.resizeCoverPictures = async (path_file) => {
    try {
        const resize = await sharp(path_file).resize({
            width: 800,
            height: 450
        }).toBuffer();
        await sharp(resize).toFile(path_file);
        return { error: false}
    } catch (err){
        return { error: true }
    }
}

exports.deleteCoverPictures = async (company_id, id) => {
    try{
        const result = await models.cover_pictures.findOne({
            where: { id, company_id }
        })
        if(result){
            fs.existsSync(publicDir + result.filename) ? 
                fs.unlinkSync(publicDir + result.filename) : null
            return { error: false }
        }
        return { error: true }
    } catch (err) {
        return { error: true }
    }
}