import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const passHash = await bcrypt.hash(password, 10);

    const [rows] = await pool.query(
      "INSERT INTO users (name,email,password) VALUES (?, ? ,?)",
      [name, email, passHash]
    );
    const token = await createAccessToken({ id: rows.insertId });

    res.cookie("token", token);
    res.json({
      id: rows.insertId,
      name,
      email,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [userFound] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!userFound.length)
      return res.status(400).json({ message: "Credentials do not match" });
    const storedPasswordHash = userFound[0].password;

    const isMatch = await bcrypt.compare(password, storedPasswordHash);

    if (!isMatch)
      return res.status(400).json({ message: "Credentials do not match" });

    console.log({ id: userFound[0].user_id });
    const token = await createAccessToken({ id: userFound[0].user_id });
    res.cookie("token", token);
    res.json({
      id: userFound[0].user_id,
      name: userFound[0].name,
      email: userFound[0].email,
      user_avatar: userFound[0].user_avatar,
      created_at: userFound[0].created_at,
      update_at: userFound[0].update_at,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.cookie("token", "", {
      expires: new Date(0),
    });
    return res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const profile = async (req, res) => {
  try {
    const [userFound] = await pool.query(
      "SELECT * FROM users WHERE user_id = ?",
      [req.user.id]
    );

    if (!userFound.length)
      return res.status(400).json({ message: "User not found" });

    return res.json({
      id: userFound[0].user_id,
      name: userFound[0].name,
      email: userFound[0].email,
      user_avatar: userFound[0].user_avatar,
      created_at: userFound[0].created_at,
      update_at: userFound[0].update_at,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
