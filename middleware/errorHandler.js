import { DEBUG_MODE } from "../config/index.js";
import Joi from "joi";
import allcustomErrorHandler from "../services/customerrhandler.js";
const { ValidationError } = Joi;


const errorHandler = (err, req, res, next) => {

    let statuscode = 500;
    let errdata = {
        mess: "Internal Server Error",

        //Debug Condition:
        ...(DEBUG_MODE === true && { originalerror: err.message })
    }

    if (err instanceof ValidationError) {
        statuscode = 421;
        errdata = {
            mess: err.message
        }
    }

    if (err instanceof allcustomErrorHandler) {
        statuscode = err.status;
        errdata = {
            mess: err.message
        }
    }

    res.status(statuscode).json(errdata)
}

export default errorHandler;
