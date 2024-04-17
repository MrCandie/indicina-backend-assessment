"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlStats = exports.decodeUrl = exports.createUrl = void 0;
const app_error_1 = __importDefault(require("../utils/app-error"));
const catch_async_1 = __importDefault(require("../utils/catch-async"));
const validator_1 = __importDefault(require("validator"));
const url_model_1 = __importDefault(require("../models/url-model"));
const path_1 = __importDefault(require("path"));
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const { randomUUID } = new short_unique_id_1.default({ length: 5 });
const dirname = path_1.default.resolve();
exports.createUrl = (0, catch_async_1.default)(async (req, res, next) => {
    // extract url from request body
    const { url } = req.body;
    if (!url) {
        return next(new app_error_1.default("Kindly provide a valid url", 400));
    }
    // validate url
    const isExist = validator_1.default.isURL(url);
    if (!isExist) {
        return next(new app_error_1.default("Invalid URL", 400));
    }
    // store urll in database together with a unique identifier
    const data = await url_model_1.default.create({ url, urlId: randomUUID() });
    // shortened url
    const shortenedUrl = `https://shortner-l4qc.onrender.com/${data.urlId}`;
    return res.status(200).json({
        status: "Success",
        data: { data, url: shortenedUrl },
    });
});
exports.decodeUrl = (0, catch_async_1.default)(async (req, res, next) => {
    // get url id from request url
    const { urlId } = req.params;
    // check if urlId was passed
    if (!urlId) {
        return next(new app_error_1.default("Invalid url identifier", 400));
    }
    // query for url in the database and select the url
    const url = await url_model_1.default.findOne({ urlId }).select("url");
    // if there is no url, redirect to 404 page
    if (!url) {
        return res.sendFile(dirname + "/public/404.html");
    }
    // redirect user to the url
    res.redirect(url.url);
});
exports.getUrlStats = (0, catch_async_1.default)(async (req, res, next) => {
    // get url id from request url
    const { urlId } = req.params;
    // check if urlId was passed
    if (!urlId) {
        return next(new app_error_1.default("Invalid url identifier", 400));
    }
    // query for url in the database and select the url
    const url = await url_model_1.default.findOne({ urlId }).select("url");
    // if there is no url, redirect to 404 page
    if (!url) {
        return res.sendFile(dirname + "/public/404.html");
    }
    return res.send(`Original URL: <a href=${url.url}>${url.url}</a>`);
});
