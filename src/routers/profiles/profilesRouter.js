import bcrypt from "bcrypt";
import express from "express";
import { User } from "../../models/users.js";
import { v2 as cloudinary } from "cloudinary";
import cloudinaryUploader from "./configUserImage.js";
import checkJwt from "../../middlewares/checkJwt.js";

const profilesRouter = express.Router();

//GET - ritorna tutti gli utenti

profilesRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
});

//GET - ritorna l'utente autenticato

profilesRouter.get("/:id", checkJwt, async (req, res) => {
  res.status(200).json(req.author);
});

//POST-----Aggiungi un utente e fai HASHING della password

profilesRouter.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    //cerca se esiste già un utente con la stessa email
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({ message: "Email already exists" });
    }
    const password = await bcrypt.hash(req.body.password, 10); // fai hashing della password inserita nella nel body della richiesta del form
    //Crea autore, sovrascrivendo il campo della password con quella criptata
    const newUser = await User.create({
      ...req.body,
      password,
    });
    // Rimuovo il campo 'password' prima di inviarlo nella risposta
    const userWithoutPassword = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    };
    await newUser.save();
    if (newUser) {
      res.status(201).send(userWithoutPassword);
    } else {
      next(error);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//PATCH - aggiunge l'immagine di un utente specifico
profilesRouter.patch(
  "/:id/photo",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      console.log(req.file);
      let updatedImage = await User.findByIdAndUpdate(
        req.params.id,
        { photo: req.file.path },
        { new: true }
      );
      res.send(updatedImage);
    } catch (error) {
      next(error);
    }
  }
);

//PUT - modifica un autore specifico
profilesRouter.put("/:id", async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

export default profilesRouter;
