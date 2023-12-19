import express from "express";

const profileRouter = express.Router();

profileRouter.use(express.json());

profileRouter.post("/", async (req, res, next) => {});

export default profileRouter;
