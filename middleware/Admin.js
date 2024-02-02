import user from "../model/user.js"
import allcustomErrorHandler from "../services/customerrhandler.js"

const Adminmidel = async (req, res, next) => {
    try {
        const userid = await user.findOne({ _id: req.user._id });
        if (userid.role === "ceo") {
            next();
        }
        else {
            return next(allcustomErrorHandler.unauth("User Not Unauthorized..."))
        }
    }
    catch (err) {
        return next(allcustomErrorHandler.unauth())
    }


}

export default Adminmidel;