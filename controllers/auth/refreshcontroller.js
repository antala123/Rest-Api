import Joi from "joi";
import allcustomErrorHandler from "../../services/customerrhandler.js";
import jwtservicereg from "../../services/jwtservicereg.js";
import { REFTOKEN_KEY } from "../../config/index.js";
import refreshtoken from '../../model/refreshtoken.js'
import user from "../../model/user.js";


const refcontroller = {

    async refresh(req, res, next) {
        const refSchema = Joi.object({
            token: Joi.string().required()
        })

        // console.log(req.body);
        const { error } = refSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        // Check Database Token:
        let ref_token;
        try {
            ref_token = await refreshtoken.findOne({ token: req.body.token })

            if (!ref_token) {
                return next(allcustomErrorHandler.unauth('Invalid Refresh Token.....!'))
            }

            // Token Verify:
            let userid;
            try {
                const { _id } = await jwtservicereg.verify(ref_token.token, REFTOKEN_KEY)

                userid = _id;
            }
            catch (err) {
                return next(allcustomErrorHandler.unauth('Invalid Refresh Token.....!'))
            }

            const us = await user.findOne({ _id: userid });
            if (!us) {
                return next(allcustomErrorHandler.unauth('No User Found.....!'))
            }

            // JWT Token Login:
            const access_token = jwtservicereg.sign({ _id: us._id, role: us.role });
            const refresh_token = jwtservicereg.sign({ _id: us._id, role: us.role }, '1y', REFTOKEN_KEY);

            // Database list:

            await refreshtoken.create({ token: ref_token });

            res.json({ access_token: access_token, refresh_token: refresh_token });

        }
        catch (err) {
            return next(new Error('Something went Wrong.....' + err.message))
        }
    }
}

export default refcontroller;