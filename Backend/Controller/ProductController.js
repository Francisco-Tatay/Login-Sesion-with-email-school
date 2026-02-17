import { pool } from "../Data/DbSingleton";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email || "pacotorrestatay8@gmail.com",
    pass: process.env.emailpassword,
  },
});

export const getAllProducts=async (req,res)=>{
  try{
    const Products=await pool.query("SELECT * FROM Products");
    res.json(Products);
  }catch(error){
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
}