import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

import globalErrorController from "./controllers/error-controller";
import AppError from "./utils/app-error";
import urlRoute from "./routes/url-route";

const app = express();
const dirname = path.resolve();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(dirname + "/public/index.html");
});

app.use("/", urlRoute);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.all("*", (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server`, 500)
  );
});

app.use(globalErrorController);

const db: any = process.env.DATABASE;

async function startServer() {
  const port = process.env.PORT || 8080;
  try {
    await mongoose.connect(db);
    console.log("database connection successful");

    app.listen(port, () => {
      console.log(`app running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
startServer();
