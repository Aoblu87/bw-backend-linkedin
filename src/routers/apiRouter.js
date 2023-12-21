import express from "express";
import profilesRouter from "./profiles/profilesRouter.js";
import cors from "cors";
import experiencesRouter from "./experiences/experiencesRouter.js";

const apiRouter = express.Router();
apiRouter.use(express.json());

apiRouter.use(cors());

//Rotta /profile
apiRouter.use("/profiles", profilesRouter);
apiRouter.use("/experiences", experiencesRouter);

export default apiRouter;
