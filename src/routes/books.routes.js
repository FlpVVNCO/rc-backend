import { Router } from "express";
import {
  createBookList,
  getBooks,
  getBookList,
  insertBook,
} from "../controllers/books.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

// ruta de libros
router.get("/books", authRequired, getBooks);
router.post("/bookList", authRequired, createBookList);
router.get("/bookList", authRequired, getBookList);
router.post("/book", authRequired, insertBook);

export default router;
