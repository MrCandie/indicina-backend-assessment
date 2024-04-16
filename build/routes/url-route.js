"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const url_controller_1 = require("../controllers/url-controller");
const router = express_1.default.Router();
router.post("/encode", url_controller_1.createUrl);
router.get("/decode/:urlId", url_controller_1.decodeUrl);
router.get("/:urlId", url_controller_1.decodeUrl);
router.get("/statistic/:urlId", url_controller_1.getUrlStats);
exports.default = router;
