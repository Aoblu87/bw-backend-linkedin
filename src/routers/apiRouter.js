import express from "express";
import profileRouter from "./profile/profileRouter.js";

const apiRouter = express.Router();
apiRouter.use(express.json());

//Rotta /profile
apiRouter.use("/profile", profileRouter);

export default apiRouter;
