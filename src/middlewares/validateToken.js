import { decode } from "next-auth/jwt";
import { TOKEN_SECRET } from "../config.js";
export const authRequired = async (req, res, next) => {
  const token = req.cookies["next-auth.session-token"];

  const decoded = await decode({
    token: token,
    secret: TOKEN_SECRET,
  });

  if (!decoded)
    return res.status(401).json({ message: "No token, authorization denied" });

  req.user = decoded;

  next();
};

// import jwt from "jsonwebtoken";
// import { TOKEN_SECRET } from "../config.js";

// export const authRequired = (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token)
//     return res.status(401).send({ message: "No token, authorization denied" });

//   jwt.verify(token, TOKEN_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: "Ïnvalid Token" });

//     req.user = user;

//     next();
//   });
// };
