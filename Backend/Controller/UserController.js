import { pool } from "../Data/Db.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { User } from "../Model/User.js";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email || "pacotorrestatay8@gmail.com",
    pass: process.env.emailpassword,
  },
});

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
    //    console.log(req.body);
    const [rows] = await pool.query("SELECT * FROM Users WHERE email=?", [email]);

    let passwordMatch = false;
    if (rows.length > 0) {
      let user = rows[0];
      passwordMatch = bcrypt.compareSync(password, user.password);
      if (passwordMatch) {
        user.password = null;
        res.json({ message: "Login successful", user });
      } else {
        res.status(401).json({ message: "Usuario incorrecto o contraseña incorrecta" });
      }
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("error " + error.message);
    return res.status(500).json({ message: "Error al iniciar sesión" + error.message });
  }
};
// for register new user with email and password
export const Register = async (req, res) => {
  const { email, password, role_id } = req.body;

  try {
    console.time("register");
    //console.table(req.body);
    const hashedPassword = await bcrypt.hash(password, 5);
    const emailExists = await checkEmailExists(email);

    if (emailExists) {
      return res.status(409).json({ message: "El correo ya existe" });
    }

    const [result] = await pool.query("INSERT INTO Users (email, password, role_id) VALUES (?, ?, ?)", [
      email,
      hashedPassword,
      role_id,
    ]);

    console.timeEnd("register");

    res.json({
      message: "Usuario registrado",
      userId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al registrar: " + error.message,
    });
  }
};

export const SendPasswordResetEmail = async (request, response) => {
  const { email } = request.body;

  if (!email) {
    return response.status(400).json({ message: "Email is required" });
  }

  try {
    const [rows] = await pool.query("SELECT email FROM Users WHERE email=?", [email]);
    if (rows.length === 0) {
      return response.status(404).json({ message: "Usuario no encontrado" });
    }
    // Generar nueva contraseña
    const newPassword = User.generateNewPassword();
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await pool.query("UPDATE Users SET password=? WHERE email=?", [hashedPassword, email]);
    await transporter.sendMail({
      from: "pacotorrestatay8@gmail.com",
      to: email,
      subject: "Restablecer contraseña",
      text: `Tu nueva contraseña  es: ${newPassword}`,
    });

    return response.json({ message: "Correo enviado" });
  } catch (error) {
    console.error("Error en reset password:", error);
    return response.status(500).json({ message: "Error al restablecer contraseña" });
  }
};

const checkEmailExists = async (email) => {
  try {
    const [rows] = await pool.query("SELECT email FROM Users WHERE email=?", [email]);
    return rows.length > 0;
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw error;
  }
};
/* const { email } = request.body;

await transporter.sendMail({
  from: "pacotorrestatay8@gmail.com",
  to: email,
  subject: "Prueba",
  text: "Hola desde NodeMailer",
});
 */
