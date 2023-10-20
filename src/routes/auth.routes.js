import { Router } from "express";
import {
  loginUser,
  logoutUser,
  profile,
  registerUser,
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/register", registerUser);
router.get("/profile", authRequired, profile);

export default router;
