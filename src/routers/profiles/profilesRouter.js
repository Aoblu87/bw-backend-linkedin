import bcrypt from "bcrypt";
import express from "express";
import checkJwt from "../../middlewares/checkJwt.js";
import cloudinaryUploader from "../../middlewares/uploadFile.js";
import { User } from "../../models/users.js";

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

//PUT - modifica un utente specifico
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

// Authentication - Autenticazione
// il processo di verifica dell'identità di un utente
profilesRouter.post("/session", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = { id: user._id };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.status(200).json({ userId: user._id, token });
});

profilesRouter.delete("/session", async (req, res) => {});
// Logout

//DELETE - cancella un utente specifico
profilesRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

export default profilesRouter;
