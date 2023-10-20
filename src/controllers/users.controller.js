import { pool } from "../db.js";

export const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [
      req.params.id,
    ]);

    if (rows.length <= 0)
      return res.status(404).json({
        message: "User not found",
      });

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
    });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE users SET name = IFNULL(?, name), email = IFNULL(?, email), password = IFNULL(?, password) WHERE user_id = ?",
      [name, email, password, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });

    const [rows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [
      id,
    ]);

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM users WHERE user_id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows <= 0)
      return res.status(404).json({
        message: "User not found",
      });

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
    });
  }
};
