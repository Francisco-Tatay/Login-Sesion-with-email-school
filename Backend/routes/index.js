import { Router } from "express";
import { getAllUsers, Login } from "../Controller/UserController.js";

const router = Router();

router.get("/", (request, response) => {
  response.send({ message: "Hello from routes!" });
});

router.get("/users/all", getAllUsers);
router.post("/login", Login);
export default router;
