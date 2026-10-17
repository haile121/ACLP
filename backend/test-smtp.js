require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "haileag8@gmail.com",
    pass: "dafe wued ybkc hkpo",
  },
});

async function main() {
  try {
    const info = await transporter.verify();
    console.log("Verify successful:", info);
  } catch (err) {
    console.error("SMTP Error:", err);
  }
}

main();
