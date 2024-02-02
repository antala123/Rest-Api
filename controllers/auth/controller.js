import Joi from "joi";
import user from "../../model/user.js";
import allcustomErrorHandler from "../../services/customerrhandler.js";
import bcrypt from "bcrypt";
import jwtservicereg from "../../services/jwtservicereg.js";
import { REFTOKEN_KEY } from "../../config/index.js";

const registercontroller = {
    //Insert:
    async register(req, res, next) {
        const regSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
            repeat_password: Joi.ref('password'),
            role: Joi.string()
        })

        const { error } = regSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        const { name, email, password, role } = req.body;

        // Custom Validation Email: 
        try {
            const exist = await user.exists({ email: email })
            if (exist) {
                return next(allcustomErrorHandler.alreadyExist("Email already exist..."));
            }
        }
        catch (err) {
            console.log(err);
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const ApiData = await user.create({
            name,
            email,
            password: hashPassword,
            role
        })

        let access_token;
        let ref_token;
        try {
            console.log(ApiData);

            // Jwt Token:
            access_token = jwtservicereg.sign({ _id: ApiData._id, role: ApiData.role });
            ref_token = jwtservicereg.sign({ _id: ApiData._id, role: ApiData.role }, '1y', REFTOKEN_KEY);

        }
        catch (err) {
            return next(err);
        }
        res.send({ access_token: access_token, ref_token: ref_token });
    }
}


export default registercontroller;