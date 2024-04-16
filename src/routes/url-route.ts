import express from "express";
import { createUrl } from "../controllers/url-controller";

const router = express.Router();

router.post("/encode", createUrl);

export default router;
