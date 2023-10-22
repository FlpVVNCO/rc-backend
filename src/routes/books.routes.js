import { Router } from "express";
import { getBooks } from "../controllers/books.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

// ruta para ver libros
router.get("/books", authRequired, getBooks);

export default router;
