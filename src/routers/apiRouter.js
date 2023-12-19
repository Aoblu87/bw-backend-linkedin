import express from "express";

const apiRouter = express.Router();
apiRouter.use(express.json());

export default apiRouter;
