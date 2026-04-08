import { pool } from '../Data/Db.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { User } from '../Model/User.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
dotenv.config();
const secretKey = process.env.JWT_SECRET;
const bcryptSaltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || process.env.email,
    pass: process.env.EMAIL_PASSWORD || process.env.emailpassword,
  },
});

//Test for get all users
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Users');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};
// For login with email and password
export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!secretKey) {
      return res.status(500).json({ message: 'JWT secret no configurado' });
    }

    const [rows] = await pool.query('SELECT * FROM Users WHERE email=?', [
      email,
    ]);

    let passwordMatch = false;
    if (rows.length > 0) {
      let user = rows[0];
      passwordMatch = bcrypt.compareSync(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'password incorrect' });
      }
      const tokenData = {
        id: user.id,
        email: user.email,
        role_id: user.role_id,
      };
      const token = jwt.sign(tokenData, secretKey, { expiresIn: '1h' });
      return res.json({ message: 'Login successful', token });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('error ' + error.message);
    return res
      .status(500)
      .json({ message: 'Error al iniciar sesión' + error.message });
  }
};
// for register new user with email and password
export const Register = async (req, res) => {
  const { email, password, role_id } = req.body;

  try {
    console.time('register');
    const hashedPassword = await bcrypt.hash(password, bcryptSaltRounds);
    const emailExists = await checkEmailExists(email);

    if (emailExists) {
      return res.status(409).json({ message: 'El correo ya existe' });
    }

    const [result] = await pool.query(
      'INSERT INTO Users (email, password, role_id) VALUES (?, ?, ?)',
      [email, hashedPassword, role_id]
    );

    console.timeEnd('register');

    res.json({
      message: 'Usuario registrado',
      userId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al registrar: ' + error.message,
    });
  }
};

export const SendPasswordResetEmail = async (request, response) => {
  const { email } = request.body;

  if (!email) {
    return response.status(400).json({ message: 'Email is required' });
  }

  try {
    const [rows] = await pool.query('SELECT email FROM Users WHERE email=?', [
      email,
    ]);
    if (rows.length === 0) {
      return response.status(404).json({ message: 'Usuario no encontrado' });
    }
    // Generar nueva contraseña
    const newPassword = User.generateNewPassword();
    const hashedPassword = await bcrypt.hash(newPassword, bcryptSaltRounds);
    await pool.query('UPDATE Users SET password=? WHERE email=?', [
      hashedPassword,
      email,
    ]);
    await transporter.sendMail({
      from: 'pacotorrestatay8@gmail.com',
      to: email,
      subject: 'Restablecer contraseña',
      text: `Tu nueva contraseña  es: ${newPassword}`,
    });

    return response.json({ message: 'Correo enviado' });
  } catch (error) {
    console.error('Error en reset password:', error);
    return response
      .status(500)
      .json({ message: 'Error al restablecer contraseña' });
  }
};

const checkEmailExists = async (email) => {
  try {
    const [rows] = await pool.query('SELECT email FROM Users WHERE email=?', [
      email,
    ]);
    return rows.length > 0;
  } catch (error) {
    console.error('Error checking email existence:', error);
    throw error;
  }
};

export const deleteUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email es requerido' });
  }

  try {
    const emailCheck = await checkEmailExists(email);

    if (!emailCheck) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await pool.query('DELETE FROM Users WHERE email=?', [email]);
    return res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email requerido' });

  const [rows] = await pool.query('SELECT id FROM Users WHERE email = ?', [
    email,
  ]);

  // Respuesta genérica para evitar enumeración
  if (rows.length === 0) {
    return res.json({
      message: 'Si el correo existe, te enviamos instrucciones',
    });
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await pool.query(
    'INSERT INTO PasswordResetTokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
    [rows[0].id, tokenHash, expiresAt]
  );

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
  await transporter.sendMail({
    to: email,
    subject: 'Restablecer contraseña',
    text: `Restablece tu contraseña aquí: ${resetLink}`,
  });

  return res.json({
    message: 'Si el correo existe, te enviamos instrucciones',
  });
};
