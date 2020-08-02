const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

router.post("/", (req, res) => {
  if (req.body.email && req.body.password && req.headers.referer) {
    email = req.body.email;
    password = req.body.password;
    url = req.headers.referer;

    sendMail(email, password, url);
    res.status(200).json("Сообщение отправлено");
  } else {
    res.status(500).json({ message: "Не хватает данных для отправки почты" });
  }
});

const sendMail = (email, password, url) => {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Доступы к аудиту на free-audit.ru",
    text: "Пароль: " + password + ". Страница: " + url
  });
};

module.exports = router;
