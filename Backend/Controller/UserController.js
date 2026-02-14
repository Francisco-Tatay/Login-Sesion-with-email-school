import { pool } from "../Data/Db.js";

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Users");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM Users WHERE email=? AND password=?", [email, password]);
    if (rows.length > 0) {
      let user = rows[0];
      user.password = null;
      res.json("Login successful", user);
    }
  } catch (error) {
    console.error("error " + error.message);
    return res.status(500).json({ message: "Error al iniciar sesión" + error.message });
  }
};
export const Register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const result = await pool.query("INSERT INTO Users (name,email,password) VALUES (?,?,?)", [name, email, password]);
    res.json({ message: "Usuario registrado exitosamente", userId: result[0].insertId });
  } catch (error) {
    return res.status(500).json({ message: "Error al registrar usuario" + error.message });
  }
};
