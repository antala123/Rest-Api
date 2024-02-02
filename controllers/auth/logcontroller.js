import Joi from "joi";
import user from "../../model/user.js";
import allcustomErrorHandler from "../../services/customerrhandler.js";
import bcrypt from "bcrypt";
import jwtservicereg from "../../services/jwtservicereg.js";
import { REFTOKEN_KEY } from "../../config/index.js";
import refreshtoken from '../../model/refreshtoken.js'

const logincontroller = {
    //Login:
    async login(req, res, next) {
        const logSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required()
        })

        const { error } = logSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        //Custom Validation Email:

        try {
            // Email Check:
            const LoData = await user.findOne({ email: req.body.email });
            // console.log(LoData);

            if (!LoData) {
                return next(allcustomErrorHandler.wrongDetail());
            }

            // Password Compare:
            const matchpass = await bcrypt.compare(req.body.password, LoData.password);

            if (!matchpass) {
                return next(allcustomErrorHandler.wrongDetail());
            }

            // JWT Token Login:
            const access_token = jwtservicereg.sign({ _id: LoData._id, role: LoData.role });
            const ref_token = jwtservicereg.sign({ _id: LoData._id, role: LoData.role }, '1y', REFTOKEN_KEY);

            // Database List:   
            await refreshtoken.create({ token: ref_token })

            res.json({ access_token: access_token, ref_token: ref_token });
        }
        catch (err) {
            return next(err);
        }
    },
    // Logout:
    async logout(req, res, next) {
        // Validation:
        const logoutSchema = Joi.object({
            token: Joi.string().required()

        })

        const { error } = logoutSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            await refreshtoken.deleteOne({ token: req.body.token });
        }
        catch (error) {
            return next(new Error());
        }
        res.json("user delete success... !")
    }
}

export default logincontroller;