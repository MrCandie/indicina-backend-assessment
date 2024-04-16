import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import globalErrorController from "./controllers/error-controller";
import AppError from "./utils/app-error";
import urlRoute from "./routes/url-route";

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>WELCOME TO INDOCINA</h1>");
});

app.use("/api", urlRoute);

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