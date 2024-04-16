"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const error_controller_1 = __importDefault(require("./controllers/error-controller"));
const app_error_1 = __importDefault(require("./utils/app-error"));
const url_route_1 = __importDefault(require("./routes/url-route"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("<h1>WELCOME TO INDOCINA</h1>");
});
app.use("/api", url_route_1.default);
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});
app.all("*", (req, res, next) => {
    return next(new app_error_1.default(`Can't find ${req.originalUrl} on this server`, 500));
});
app.use(error_controller_1.default);
const db = process.env.DATABASE;
async function startServer() {
    const port = process.env.PORT || 8080;
    try {
        await mongoose_1.default.connect(db);
        console.log("database connection successful");
        app.listen(port, () => {
            console.log(`app running on port ${port}`);
        });
    }
    catch (error) {
        console.log(error);
    }
}
startServer();
