import jwt from "jsonwebtoken";
import { JWT_KEY } from "../config/index.js";

class jwtservicereg {
    static sign(payload, expiry = "1d", secretkey = JWT_KEY) {
        return jwt.sign(payload, secretkey, { expiresIn: expiry })
    }

    static verify(token, secretkey = JWT_KEY) {
        return jwt.verify(token, secretkey);
    }
}

export default jwtservicereg;