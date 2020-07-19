const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
var expressJwt = require("express-jwt");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/user");

const app = express();
app.use(cookieParser());

app.use(
  expressJwt({
    secret: process.env.TOKEN,
    algorithms: ["HS256"]
  }).unless({
    path: "/api/auth/login"
  })
);

router.post("/login", async (req, res, next) => {
  let login = req.body.user;
  let password = req.body.password;

  const loggedUser = await User.findOne({ login: login }, "name password _id", function(err, user) {});

  try {
    const valid = await bcrypt.compare(password, loggedUser.password);
    if (!valid) {
      res.status(403).json({ message: "Ошибка авторизации" });
    } else {
      const accessToken = jwt.sign(
        {
          name: loggedUser.name,
          _id: loggedUser._id
        },
        process.env.TOKEN,
        { expiresIn: "1d" }
      );
      res.json({
        token: { accessToken }
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/user", (req, res) => {
  const tokenDecoded = jwt.decode(req.headers.authorization.split("Bearer ")[1]);
  res.json({
    name: tokenDecoded.name,
    _id: tokenDecoded._id
  });
});

router.post("/logout", (req, res) => {
  res.json("Вы успешно вышли из админки");
});

module.exports = router;
