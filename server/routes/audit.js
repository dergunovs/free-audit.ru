const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Audit = require("../model/audit");

router.get("/", async (req, res) => {
  if (req.headers.authorization === undefined) {
    res.status(403).json({ message: "Токен не распознан" });
  } else {
    const token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.SECRET, async function(err, decoded) {
      if (err) {
        res.status(403).json({ message: "Токен неправильный" });
      } else {
        try {
          const audits = await Audit.find()
            .select("_id name introtext")
            .sort("name")
            .lean()
            .exec();
          res.json(audits);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
    });
  }
});

router.post("/", async (req, res) => {
  if (req.headers.authorization === undefined) {
    res.status(403).json({ message: "Токен не распознан" });
  } else {
    const token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.SECRET, async function(err, decoded) {
      if (err) {
        res.status(403).json({ message: "Токен неправильный" });
      } else {
        const audit = new Audit({
          name: req.body.name,
          introtext: req.body.introtext,
          conclusion: req.body.conclusion
        });
        try {
          await audit.save();
          res.status(201).json({ message: "Создано" });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
    });
  }
});

module.exports = router;
