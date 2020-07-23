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

router.get("/:id", getAudit, (req, res) => {
  if (req.headers.authorization === undefined) {
    res.status(403).json({ message: "Токен не распознан" });
  } else {
    const token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.SECRET, async function(err, decoded) {
      if (err) {
        res.status(403).json({ message: "Токен неправильный" });
      } else {
        res.json({
          _id: res.audit._id,
          name: res.audit.name,
          introtext: res.audit.introtext,
          conclusion: res.audit.conclusion,
          date_created: res.audit.date_created
        });
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

router.patch("/:id", getAudit, async (req, res) => {
  if (req.headers.authorization === undefined) {
    res.status(403).json({ message: "Токен не распознан" });
  } else {
    const token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.SECRET, async function(err, decoded) {
      if (err) {
        res.status(403).json({ message: "Токен неправильный" });
      } else {
        res.audit.name = req.body.name;
        res.audit.introtext = req.body.introtext;
        res.audit.conclusion = req.body.conclusion;
        try {
          await res.audit.save();
          res.status(200).json({
            name: res.audit.name,
            introtext: res.audit.introtext,
            conclusion: res.audit.conclusion
          });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
    });
  }
});

router.delete("/:id", getAudit, async (req, res) => {
  if (req.headers.authorization === undefined) {
    res.status(403).json({ message: "Токен не распознан" });
  } else {
    const token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.SECRET, async function(err, decoded) {
      if (err) {
        res.status(403).json({ message: "Токен неправильный" });
      } else {
        try {
          await res.audit.remove();
          res.status(200).json({ message: "Удалено" });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
    });
  }
});

async function getAudit(req, res, next) {
  let audit;
  try {
    audit = await Audit.findOne({ _id: req.params.id });
    if (audit == null) {
      return res.status(404).json({ message: "Нет такой страницы" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.audit = audit;
  next();
}

module.exports = router;
