// import jwt from "jsonwebtoken";
import { decode } from "next-auth/jwt";
import { TOKEN_SECRET } from "../config.js";
export const authRequired = async (req, res, next) => {
  const token = req.cookies["next-auth.session-token"];

  console.log({ token });

  const decoded = await decode({
    token: token,
    secret: TOKEN_SECRET,
  });

  if (!decoded)
    return res.status(401).json({ message: "No token, authorization denied" });

  req.user = decoded;

  next();
};
