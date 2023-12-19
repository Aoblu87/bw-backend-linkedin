import express from "express";
import { User } from "../models/users.js";

const profileRouter = express.Router();

profileRouter.use(express.json());

//POST-----Aggiungi un utentee fai HASHING della password

profileRouter.post("/", async (req, res) => {
  // try {
  //     const { email } = req.body
  //     //cercao se esiste già un utente con la stessa email
  //     const user = await User.findOne({ email })
  //     if (user) {
  //         return res.status(400).send({ message: "Email already exists" })
  //     }
  //     const password = await bcrypt.hash(req.body.password, 10) // fai hashing della password inserita nella nel body della richiesta del form
  //     //Crea autore, sovrascrivendo il campo della password con quella criptata
  //     const newUser = await User.create({
  //         ...req.body,
  //         password,
  //     })
  //     // Rimuov0 il campo 'password' prima di inviarlo nella risposta
  //     const userWithoutPassword = {
  //         _id: newUser._id,
  //         firstName: newUser.firstName,
  //         lastName: newUser.lastName,
  //         email: newUser.email,
  //     }
  //     await newUser.save()
  //     if (newUser) {
  //         res.status(201).send(userWithoutPassword)
  //     } else {
  //         next(error)
  //     }
  // } catch (error) {
  //     console.log(error)
  //     res.status(500).send(error)
  // }
});

export default profileRouter;
