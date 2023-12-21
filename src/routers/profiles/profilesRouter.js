import bcrypt from "bcrypt";
import express from "express";
import checkJwt from "../../middlewares/checkJwt.js";
import jwt from "jsonwebtoken";

import cloudinaryUploader from "../../middlewares/uploadFile.js";
import { User } from "../../models/users.js";
import { Experience } from "../../models/experiences.js";

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
// NON FUNZIONA FINCHE NON SI INSERISCE NEGLI HEADERS IL TOKEN
profilesRouter.get("/me", checkJwt, async (req, res) => {
  try {
    const user = await User.findById(req.params.me).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
});

//GET - ritorna utente specifico

profilesRouter.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// NON FUNZIONA FINCHE NON SI INSERISCE NEGLI HEADERS IL TOKEN
// profilesRouter.get("/me", checkJwt, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.me).select("-password");
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     res.status(200).json(req.user);
//   } catch (error) {
//     next(error);
//   }
// });

//GET UTENTE LOGGATO
//SERVE
profilesRouter.get("/me", checkJwt, async (req, res) => {
  res.status(200).json(req.user);
});

//POST-----Aggiungi un utente e fai HASHING della password
// PROBLEMA NELLA RESTITUZIONE DEL DATO: MANCA TITLE
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
      title: newUser.title,
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
// FUNZIONA
profilesRouter.patch(
  "/:id/photo",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nessun file avatar caricato." });
      }
      console.log(req.file);
      let updatedImage = await User.findByIdAndUpdate(
        req.params.id,
        { photo: req.file.path },
        { new: true }
      ).select("-password");
      if (!updatedImage) {
        return res.status(404).json({ error: "Autore non trovato." });
      } else {
        res.json(updatedImage);
      }
    } catch (error) {
      next(error);
    }
  }
);

//PUT - modifica un utente specifico
// FUNZIONA; MA DOBBIAMO CONSIDERARE SE DAVVERO UTILE NEL ProcessingInstruction; POICHé PER UTILIZZARLA TUTTI I CAMPI DEVONO ESSERE CAMBIATI O CONFERMATI
profilesRouter.put("/:id", async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    if (!updatedUser) {
      return res.status(404).send();
    } else {
      res.json(updatedUser);
    }
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
//Logout;

//DELETE - cancella un utente specifico
profilesRouter
  .delete("/:id", async (req, res, next) => {
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
  })

  //-------------------------ROTTE EXPERIENCES ----------------------------------

  /* GET - ritorna tutte le esperienze di un utente specifico*/
  .get("/:userId/experiences", async (req, res) => {
    try {
      // const { userId } = req.params;
      // const user = await User.findById(userId);
      // if (!user) {
      //   return res.status(404).send();
      // }
      const experience = await Experience.find({ user: req.params.userId });
      if (!experience) {
        return res.status(404).send();
      }

      res.json(experience);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })

  /* GET - ritorna le esperienze dell'utente loggato */
  .get("/:me/experiences", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ messaggio: "Autore non trovato" });
      }
      const experience = await Experience.find({ "user._id": id });
      res.json(experience);
    } catch (error) {
      next(error);
    }
  })

  //GET di un'esperienza specifica
  // FUNZIONA
  .get("/experiences/:id", async (req, res) => {
    try {
      const experience = await Experience.findById(req.params.id);
      if (!experience) {
        res.status(404).send();
      }

      res.json(experience);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })

  //POST - aggiunge una nuova esperienza
  // FUNZIONA
  .post("/experiences", async (req, res, next) => {
    try {
      const newExperience = new Experience(req.body);

      await newExperience.save();
      if (newExperience) {
        res.status(201).send(newExperience);
      } else {
        next(error);
      }
    } catch (error) {
      next(error);
    }
  })

  //PATCH - aggiunge un'immagine all'esperienza
  .patch(
    "/experiences/:expId/image",
    cloudinaryUploader,
    async (req, res, next) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "Nessuna immagine caricata." });
        }
        console.log(req.file);
        if (!req.file) {
          return res
            .status(400)
            .json({ error: "Nessun file avatar caricato." });
        }
        let updatedImage = await Experience.findByIdAndUpdate(
          req.params.expId,
          { photo: req.file.path },
          { new: true }
        );
        if (!updatedImage) {
          return res.status(404).json({ error: "Esperienza non trovata." });
        } else {
          res.json(updatedImage);
        }
      } catch (error) {
        next(error);
      }
    }
  )

  //PUT - modifica un'esperienza specifica
  //FUNZIONA
  .put("/experiences/:expId", async (req, res, next) => {
    try {
      const updatedExperience = await Experience.findByIdAndUpdate(
        req.params.expId,
        req.body,
        {
          new: true,
        }
      );
      if (!updatedExperience) {
        return res.status(404).send();
      }
      res.json(updatedExperience);
    } catch (error) {
      next(error);
    }
  })

  //DELETE - elimina un'esperienza specifica
  //FUNZIONA
  .delete("/experiences/:expId", async (req, res, next) => {
    try {
      const deletedExperience = await Experience.findByIdAndDelete(
        req.params.expId
      );

      if (!deletedExperience) {
        res.status(404).send();
      } else {
        res.status(204).send();
      }
    } catch (error) {
      next(error);
    }
  });

export default profilesRouter;
