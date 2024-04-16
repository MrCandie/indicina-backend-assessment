import express from "express";
import {
  createUrl,
  decodeUrl,
  getUrlStats,
} from "../controllers/url-controller";

const router = express.Router();

router.post("/encode", createUrl);
router.get("/decode/:urlId", decodeUrl);
router.get("/:urlId", decodeUrl);
router.get("/statistic/:urlId", getUrlStats);

export default router;
