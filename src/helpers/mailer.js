import nodemailer from "nodemailer";
import { EMAIL, PASS_EMAIL } from "../config.js";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // O el servicio de tu elección
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: PASS_EMAIL,
  },
});
