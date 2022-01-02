const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require('helmet');
const publicDir = require("path").join(__dirname, "/uploads");
const { error } = require("./config/response_api");
// routes
const company_routes = require("./routes/companies");
const link_routes = require("./routes/links");
const product_routes = require("./routes/products");
const user_routes = require("./routes/users");
const contents = require("./routes/contents");
const tags = require("./routes/tags");
const cover_pictures = require("./routes/cover_pictures");
const index = require("./routes/index");
require("dotenv").config();

app.use(helmet());
app.use(express.static(publicDir));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    const bearerToken = process.env.TOKEN;
    if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] == "Bearer"
    ) {
        const setBearer = req.headers.authorization.split(" ")[1];
        return setBearer != bearerToken ?
            error("Permission Denied", 500, res) :
            next()
    } else {
        return error("Permission Denied", 500, res)
    }
});
index(app);
company_routes(app);
link_routes(app);
product_routes(app);
user_routes(app);
contents(app);
tags(app);
cover_pictures(app);

app.listen(process.env.PORT, () => {
    console.log(`myproject API running on port ${process.env.PORT}`);
});
