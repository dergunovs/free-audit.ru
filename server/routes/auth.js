const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
var expressJwt = require("express-jwt");
var jwt = require("jsonwebtoken");

const app = express();
app.use(cookieParser());

app.use(
  expressJwt({
    secret: process.env.SECRET,
    algorithms: ["HS256"]
  }).unless({
    path: "/api/auth/login"
  })
);

router.post("/login", (req, res) => {
  if (req.body.user === process.env.USER && req.body.password === process.env.PASSWORD) {
    jwt.sign({ user: req.body.user }, process.env.SECRET, { expiresIn: "1d" }, async function(err, token) {
      res.json({ token: token, user: req.body.user });
    });
  } else {
    res.status(403).json({ message: "Ошибка авторизации" });
  }
});

router.get("/user", (req, res) => {
  const tokenDecoded = jwt.decode(req.headers.authorization.split("Bearer ")[1]);
  res.json({ user: tokenDecoded.user });
});

router.post("/logout", (req, res) => {
  res.json("Вы успешно вышли из админки");
});

module.exports = router;
