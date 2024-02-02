import allcustomErrorHandler from "../services/customerrhandler.js";
import jwtservicereg from "../services/jwtservicereg.js";

const userAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log(authHeader);

    // Condition Token Valid:
    if (!authHeader) {
        return next(allcustomErrorHandler.unauth());
    }
    // Token Convert to Array:
    const token = authHeader.split(' ')[1];
    // console.log(token);

    // Token Verify:
    try {
        const { _id, role } = await jwtservicereg.verify(token);

        const user = {
            _id,
            role
        }
        req.user = user;
        next();
    }
    catch (err) {
        return next(allcustomErrorHandler.unauth());
    }
}

export default userAuth;