import express from "express";
import { logincontroller, productcontroller, refcontroller, registercontroller, usercontroller } from "../controllers/index.js";
import userAuth from "../middleware/userauth.js";
import Adminmidel from "../middleware/Admin.js";


const router = express.Router();

router.post("/register", registercontroller.register);
router.post("/login", logincontroller.login);
router.post("/user", userAuth, usercontroller.me);
router.post("/ref", refcontroller.refresh);
router.post("/logout", logincontroller.logout);
router.post("/insert", [userAuth, Adminmidel], productcontroller.productstore);
router.put("/update/:id", [userAuth, Adminmidel], productcontroller.update);
router.delete("/delete/:id", [userAuth, Adminmidel], productcontroller.delete);
router.get("/show", productcontroller.show);
router.get("/showsingle/:id", productcontroller.showsingle);

// router.get("/", (req, res) => {
//    res.send("routers.....");
// });


export default router;