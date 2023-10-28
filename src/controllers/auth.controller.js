import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import { transporter } from "../helpers/mailer.js";
import { EMAIL } from "../config.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Verifica si el correo electrónico ya existe en la base de datos
    const [userFound] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (userFound.length > 0) {
      // Si el correo electrónico ya existe, devuelve un error
      return res.status(400).json({ message: "Email is already in use" });
    }

    const passHash = await bcrypt.hash(password, 10);

    // Registra al usuario en la base de datos
    const [rows] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, passHash]
    );

    // Genera un token de verificación con nombre, correo electrónico y fecha de creación
    const sessionToken = await createAccessToken({
      id: rows.insertId,
      name: name,
      email: email, // Puedes personalizar la fecha de creación como sea necesario
      confirmed: 0, // Puedes personalizar la imagen del usuario según tus necesidades
    });

    await pool.query(
      "UPDATE users SET confirmation_token = ? WHERE user_id = ?",
      [sessionToken, rows.insertId]
    );

    // Envia el correo de confirmación
    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Confirm Your Account",
      text: `Hello ${name}! Thank you for registering. Please click the following link to confirm your account: https://rc-backend-production.up.railway.app/api/confirm/${sessionToken}`,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending confirmation email:", error);
        return res
          .status(500)
          .json({ message: "Error sending confirmation email" });
      }

      // Set an authentication cookie
      res.cookie("sessionToken", sessionToken);

      // Respond with user information
      res.json({
        id: rows.insertId,
        name,
        email,
        message:
          "Registration successful. Please check your email to confirm your account.",
      });
    });
  } catch (error) {
    console.error("Error registering the user:", error);
    res.status(500).json({
      message: "Error registering the user",
    });
  }
};

export const confirmUser = async (req, res) => {
  const sessionToken = req.params.token;
  try {
    const [results] = await pool.query(
      "SELECT * FROM users WHERE confirmation_token = ?",
      [sessionToken]
    );

    if (results.length === 1) {
      await pool.query(
        "UPDATE users SET confirmed = 1, confirmation_token = NULL WHERE user_id = ?",
        [results[0].user_id]
      );

      await pool.query(
        "INSERT INTO book_list (name_list, user_id) VALUES (?,?)",
        ["Leídos", [results[0].user_id]]
      );

      await pool.query(
        "INSERT INTO book_list (name_list, user_id) VALUES (?,?)",
        ["Por leer", [results[0].user_id]]
      );

      res.send({ message: "Successful confirmation! You can now log in." });
      res.redirect("https://readconnect.vercel.app/login");
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

    const token = await createAccessToken({
      id: userFound[0].user_id,
      name: userFound[0].name,
      email: userFound[0].email,
      user_avatar: userFound[0].user_avatar,
      created_at: userFound[0].created_at,
      update_at: userFound[0].update_at,
      confirmation_token: userFound[0].confirmation_token,
      confirmed: userFound[0].confirmed,
    });
    res.cookie("token", token);
    res.json({
      id: userFound[0].user_id,
      name: userFound[0].name,
      email: userFound[0].email,
      user_avatar: userFound[0].user_avatar,
      created_at: userFound[0].created_at,
      update_at: userFound[0].update_at,
      confirmation_token: userFound[0].confirmation_token,
      confirmed: userFound[0].confirmed,
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
