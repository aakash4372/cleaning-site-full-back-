require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "https://clening-site-front.vercel.app/" })); // Allow all origins (adjust as needed)
app.use(express.json()); // Parse JSON requests

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Cleaning Server!");
});

// Email sending route
app.post("/send-email", async (req, res) => {
  try {
    const { name, phone, email, type, location } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !type || !location) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL, // Send to Website Owner
      subject: "New Enquiry Received",
      html: `
        <h1>New Enquiry</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Location:</strong> ${location}</p>
        <br/>
        <p>Please contact the user for further details.</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Enquiry sent successfully!" });

  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: "Failed to send enquiry email.", error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
