import AppError from "../utils/app-error";
import catchAsync from "../utils/catch-async";
import { Request, Response, NextFunction } from "express";
import validator from "validator";
import URL from "../models/url-model";
import path from "path";
import ShortUniqueId from "short-unique-id";

const { randomUUID } = new ShortUniqueId({ length: 5 });
const dirname = path.resolve();

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

    // get current url path
    const shortenedUrl = `${req.protocol}://${req.get("host")}/${data.urlId}`;

    return res.status(200).json({
      status: "Success",
      data: { data, url: shortenedUrl },
    });
  }
);

export const decodeUrl = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get url id from request url

    const { urlId } = req.params;

    // check if urlId was passed
    if (!urlId) {
      return next(new AppError("Invalid url identifier", 400));
    }

    // query for url in the database and select the url
    const url = await URL.findOne({ urlId }).select("url");

    // if there is no url, redirect to 404 page
    if (!url) {
      return res.sendFile(dirname + "/public/404.html");
    }

    // redirect user to the url
    res.redirect(url.url);
  }
);

export const getUrlStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get url id from request url

    const { urlId } = req.params;

    // check if urlId was passed
    if (!urlId) {
      return next(new AppError("Invalid url identifier", 400));
    }

    // query for url in the database and select the url
    const url = await URL.findOne({ urlId }).select("url");

    // if there is no url, redirect to 404 page
    if (!url) {
      return res.sendFile(dirname + "/public/404.html");
    }

    return res.send(`Original URL: <a href=${url.url}>${url.url}</a>`);
  }
);
