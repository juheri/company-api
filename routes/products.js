"use strict";
const Multer  = require('multer');
const product = require("../controllers/products");
const multer_config = require("../config/multer");
const validate = require("../helpers/validate");

module.exports = (app) => {
    app.route("/product").post(
        Multer({ 
            storage: multer_config.diskStorage(), 
            fileFilter: validate.imageFilter 
        }).array("image", 5),
        product.createProduct
    );
    app.route("/product").put(
        Multer({ 
            storage: multer_config.diskStorage(), 
            fileFilter: validate.imageFilter 
        }).array("image", 5), 
        product.updateProduct
    );
    app.route("/product-destroy").delete(product.deleteProduct);
}