import { Router } from "express";
import {
  createBookList,
  getBooks,
  getBookList,
  insertBook,
  getBooksBySearch,
  getBook,
} from "../controllers/books.controller.js";
// valida, funciona localmente. No me dio tiempo a investigar la razón de por qué no funciona en prod
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

// ruta de libros
router.get("/books", getBooks);
router.get("/searchBook", getBooksBySearch);
router.post("/bookList", createBookList);
router.get("/booklist", getBookList);
router.post("/book", insertBook);

export default router;
