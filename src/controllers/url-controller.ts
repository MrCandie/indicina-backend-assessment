import AppError from "../utils/app-error";
import catchAsync from "../utils/catch-async";
import { Request, Response, NextFunction } from "express";
import validator from "validator";
import URL from "../models/url-model";
import ShortUniqueId from "short-unique-id";

const { randomUUID } = new ShortUniqueId({ length: 5 });

export const createUrl = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // extract url from request body
    const { url } = req.body;

    if (!url) {
      return next(new AppError("Kindly provide a valid url", 400));
    }

    // validate url
    const isExist = validator.isURL(url);
    if (!isExist) {
      return next(new AppError("Invalid URL", 400));
    }

    // store urll in database together with a unique identifier
    const data = await URL.create({ url, urlId: randomUUID() });

    return res.status(200).json({
      status: "Success",
      data,
    });
  }
);
