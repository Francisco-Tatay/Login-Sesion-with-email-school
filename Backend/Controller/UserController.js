import { pool } from "../Data/Db.js";
import bcrypt from "bcrypt";
//Test for get all users
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Users");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};
// For login with email and password 
export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM Users WHERE email=?", [email]);
    let passwordMatch=false;
  if (rows.length > 0) {
    let user = rows[0];
    passwordMatch=bcrypt.compareSync(password,user.password);
    if(passwordMatch){
      user.password = null;
      res.json({message: "Login successful", user});
    }else{
      res.status(401).json({ message: "Usuario incorrecto o contraseña incorrecta" });
    }
  }else{
    res.status(404).json({ message: "Usuario no encontrado" });
  }
  } catch (error) {
    console.error("error " + error.message);
    return res.status(500).json({ message: "Error al iniciar sesión" + error.message });
  }
};
// for register new user with email and password 
export const Register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let hashedPassword=bcrypt.hashSync(password,10);
    const result = await pool.query("INSERT INTO Users (name,email,password) VALUES (?,?,?)", [name, email, hashedPassword]);
    res.json({ message: "Usuario registrado exitosamente", userId: result[0].insertId });
  } catch (error) {
    return res.status(500).json({ message: "Error al registrar usuario" + error.message });
  }
};



