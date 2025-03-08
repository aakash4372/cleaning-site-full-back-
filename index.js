require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send-email", async (req, res) => {
  const { name, phone, email, type, location } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL, // Send to Website Owner
    subject: "New Enquiry Received",
    html: `
      <h1>New Enquiry</h1>
      <h6><strong>Name:</strong> ${name}</h6>
      <h6><strong>Phone:</strong> ${phone}</h6>
      <h6><strong>Email:</strong> ${email}</h6>
      <h6><strong>Type:</strong> ${type}</h6>
      <h6><strong>Location:</strong> ${location}</h6>
      <br/>
      <p>Please contact the user for further details.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Enquiry sent successfully!" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: "Failed to send enquiry email." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
