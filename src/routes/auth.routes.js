import { Router } from "express";
import {
  confirmUser,
  loginUser,
  logoutUser,
  profile,
  registerUser,
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { updateProfile } from "../controllers/users.controller.js";

const router = Router();

router.post("/login", validateSchema(loginSchema), loginUser);
router.post("/logout",  logoutUser);
// si quieres probar el authrequired que valida si está logeado con nextauth 
// debes descomentar la linea y ejecutar el login de la aplicación
// ***en local***
// router.post("/login", authrequired, validateSchema(loginSchema), loginUser);
router.post("/register", validateSchema(registerSchema), registerUser);
router.patch("/users/:id", updateProfile);
router.get("/confirm/:token", confirmUser);

export default router;
