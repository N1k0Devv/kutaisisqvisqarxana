const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "11nikoloz11@gmail.com",
    pass: "cvvi ppkb pgup pbes",
  },
});

app.post("/send-message", async (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body;

  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).json({ message: "Fill in all required fields." });
  }

  const mailOptions = {
    from: `"${firstName} ${lastName}" <${email}>`,
    to: "11nikoloz11@gmail.com",
    subject: `Contact Form: ${subject}`,
    text: `
Email: ${email}
Phone: ${phone || "Not provided"}

Message:
${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sending failed." });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
