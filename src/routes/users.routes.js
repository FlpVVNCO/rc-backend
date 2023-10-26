import { Router } from "express";
import {
  getUsers,
  getUser,
  deleteUser,
} from "../controllers/users.controller.js";

const router = Router();

// rutas para el crud de usuarios
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.delete("/users/:id", deleteUser);

export default router;
