import express from "express";
import mongoose from "mongoose";
import apiRouter from "./routers/apiRouter.js";
import list from "express-list-endpoints";
import { genericError } from "./middlewares/genericError.js";
import passport from "passport";
import googleStrategy from "./middlewares/google.js";

const server = express();

const port = 3025;

passport.use(googleStrategy);

//Router API per tutte le rotte
server.use("/api", apiRouter);
//MIDDLEWARES
server.use(genericError);

server.get("/health", function (req, res) {
  res.status(200).send();
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(port, () => {
      console.log("Server listening to port: " + port);
      console.table(list(server));
    });
  })
  .catch(() => {
    console.log("Errore nella connessione al DB");
  });
