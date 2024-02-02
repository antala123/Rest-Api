import user from "../../model/user.js";
import allcustomErrorHandler from "../../services/customerrhandler.js";

const usercontroller = {
    async me(req, res, next) {
        try {
            const usercon = await user.findOne({ _id: req.user._id });

            console.log(usercon);
            if (!usercon) {
                return next(allcustomErrorHandler.notfound());
            }

            res.json(usercon);
        }
        catch (err) {
            return next(err);
        }
    }
}

export default usercontroller;