import express from "express";
import profilesRouter from "./profiles/profilesRouter.js";
import cors from "cors";

const apiRouter = express.Router();
apiRouter.use(express.json());

apiRouter.use(cors());

apiRouter.use(function (req, res, next) {
  console.log(req.url);
  next();
});
//Rotta /profile
apiRouter.use("/profiles", profilesRouter);

export default apiRouter;
