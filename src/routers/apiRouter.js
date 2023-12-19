import express from "express";
import profilesRouter from "./profiles/profilesRouter.js";

const apiRouter = express.Router();
apiRouter.use(express.json());

//Rotta /profile
apiRouter.use("/profile", profilesRouter);

export default apiRouter;
