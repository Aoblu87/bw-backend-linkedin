import jwt from "jsonwebtoken";
import { User } from "../models/users.js";

const checkJwt = async (req, res, next) => {
  // try {
  //     const token = req.headers.authorization.split(" ")[1] // Prendo il token dagli HEADERS: Authorization sotto forma di  "Bearer <token>", lo divido in due array usando lo spazio come separatore(split) e accedo all'array di indice [1]() questo per eliminare Bearer dall'analisi
  //     const payload = jwt.verify(token, process.env.JWT_SECRET) // verifico nel TOKEN che la SIGNATURE corrisponda alla nostra JWT_SECRET
  //     req.user = await User.findById(payload.id).select("-password") //Cerco l'autore con attraverso l'id preso nel payload e restituisco in "req.author" tutti i dati del modello Author tranne la password
  //     if (!req.user) {
  //         return res.status(404).json({ message: "User not found" })
  //     }
  //     next()
  // } catch (error) {
  //     return res.status(401).json({ message: "Invalid token" })
  // }
};

export default checkJwt;
