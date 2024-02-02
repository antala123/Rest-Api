import express from "express";
import { APP_PORT, DB_URL } from "./config/index.js";
import router from "./router/router.js";
import errorHandler from "./middleware/errorHandler.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const app = express();


mongoose.set('strictQuery', false);
mongoose.connect(DB_URL, { useNewUrlParser: true });

// FileUrlPath:
const _dirname = dirname(fileURLToPath(import.meta.url));


app.use(express.json());

// const imagepath = document._doc.image;
app.use('/upload', express.static('upload'));

app.use(router);

//AppRoot:
global.AppRoot = path.resolve(_dirname);
app.use(express.urlencoded({ extended: false }));

app.use(errorHandler);
app.listen(APP_PORT, () => {
    console.log(`Server Run ${APP_PORT}`);
})

