import { Router } from "express";
const router = Router();
router.get(
  "/",
  (request, response) => {
    response.send({ message: "Hello from routes!" });
  },
  router.get("/test", (request, response) => {
    response.send({message: "Hello from test route!"});
  }),
);

export default router;
