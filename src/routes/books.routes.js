import { Router } from "express";
import {
  createBookList,
  getBooks,
  getBookList,
  insertBook,
  getBooksBySearch,
  getBook,
} from "../controllers/books.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

// ruta de libros
router.get("/books", getBooks);
router.get("/searchBook", getBooksBySearch);
router.post("/bookList", createBookList);
router.get("/bookList", getBookList);
router.post("/book", insertBook);

export default router;
