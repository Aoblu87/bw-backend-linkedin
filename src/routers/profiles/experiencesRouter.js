import express from "express";

const experienceRouter = express.Router();

/* GET - ritorna l'esperienze di tutti gli utenti */
experienceRouter.get('/:userid', async (req, res) => {
    try {
        const authors = await experience.findByUserId(req.params.userid);
        res.json(authors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* GET - ritorna le esperienze dell'utente loggato */
experienceRouter.get('/loggato', async (req, res) => {
    try {
        
        res.json({ message: 'utente loggato.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default experienceRouter;
