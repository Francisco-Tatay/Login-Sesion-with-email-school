import { Router } from "express";
import { getAllUsers, Login, Register, SendPasswordResetEmail } from "../Controller/UserController.js";
import { verificationToken } from "../middlewares/verificationToken.js";

const router = Router();

router.get("/", (request, response) => {
  response.send({ message: "Hello from routes!" });
});

//#region User routes
router.get("/users/all", getAllUsers);
router.post("/login", Login);
router.post("/register", Register);
router.post("/users/resetPassword", SendPasswordResetEmail);

router.get("/test/test",(req,res)=>{res.send({message:"Test route works!"})});
export default router;
