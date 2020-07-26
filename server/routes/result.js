const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Result = require("../model/result");

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
          const results = await Result.find()
            .select("_id audit url date_created")
            .populate({
              path: "audit",
              select: "name"
            })
            .sort("-date_created")
            .lean()
            .exec();
          res.json(results);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
    });
  }
});

router.post("/", async (req, res) => {
  const result = new Result({
    audit: req.body.audit,
    url: req.body.url
  });
  try {
    await result.save();
    res.status(201).json({ message: "Создано" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
