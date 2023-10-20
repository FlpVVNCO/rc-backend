import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import { transporter } from "../helpers/mailer.js";
import { EMAIL } from "../config.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const passHash = await bcrypt.hash(password, 10);

    // Registra al usuario en la base de datos
    const [rows] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, passHash]
    );

    // Genera un token de verificación
    const token = await createAccessToken({ id: rows.insertId });

    await pool.query(
      "UPDATE users SET confirmation_token = ? WHERE user_id = ?",
      [token, rows.insertId]
    );

    // Envia el correo de confirmación
    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Confirma tu cuenta",
      text: `Hola ${name} ¡Gracias por registrarte! Haz clic en el siguiente enlace para confirmar tu cuenta: http://localhost:3000/api/confirm/${token}`,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar el correo de confirmación:", error);
        return res
          .status(500)
          .json({ message: "Error al enviar el correo de confirmación" });
      }

      // Establece una cookie de autenticación
      res.cookie("token", token);

      // Responde con la información del usuario
      res.json({
        id: rows.insertId,
        name,
        email,
        message:
          "Registro exitoso. Por favor, verifica tu correo electrónico para confirmar tu cuenta.",
      });
    });
  } catch (error) {
    console.error("Error al registrar al usuario:", error);
    res.status(500).json({
      message: "Error al registrar al usuario",
    });
  }
};

export const confirmUser = async (req, res) => {
  const token = req.params.token;
  try {
    const [results] = await pool.query(
      "SELECT * FROM users WHERE confirmation_token = ?",
      [token]
    );

    if (results.length === 1) {
      await pool.query(
        "UPDATE users SET confirmed = 1, confirmation_token = NULL WHERE user_id = ?",
        [results[0].user_id]
      );

      res.send({ message: "Successful confirmation! You can now log in." });
    } else {
      res
        .status(400)
        .send({ message: "Invalid token or already confirmed token" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Confirmation error" });
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
