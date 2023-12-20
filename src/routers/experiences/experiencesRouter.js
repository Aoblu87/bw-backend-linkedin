import express from "express";
import { Experience } from "../../models/experiences.js";

const experiencesRouter = express.Router();

//POST - aggiunge una nuova esperienza
experiencesRouter.post("/", async (req, res, next) => {
  try {
    const newExperience = new Experience(req.body);

    await Experience.save();

    res.status(201).json(newExperience);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

//PATCH - aggiunge un'immagine all'esperienza
experiencesRouter.patch(
  "/:id/image",
  uploadFile.single("image"),
  async (req, res, next) => {
    try {
      console.log(req.file);
      let updatedImage = await Experience.findByIdAndUpdate(
        req.params.id,
        { cover: req.file.path },
        { new: true }
      );
      if (!updatedImage) {
        return res.status(404).json({ error: "Immagine non trovata." });
      } else {
        res.json(updatedImage);
      }
    } catch (error) {
      next(error);
    }
  }
);

//PUT - modifica un'esperienza specifica
experiencesRouter.put("/:id", async (req, res, next) => {
  try {
    const updatedExperience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedExperience);
  } catch (error) {
    next(error);
  }
});

//DELETE - elimina un'esperienza specifica
experiencesRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedExperience = await Experience.findByIdAndDelete(req.params.id);

    if (!deletedExperience) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

export default experiencesRouter;
