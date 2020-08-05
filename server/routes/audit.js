const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Audit = require("../model/audit");

const multer = require("multer");
const imageMimeTypes = ["image/jpeg", "image/png"];
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "static/uploads/audit");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, imageMimeTypes.includes(file.mimetype));
  }
});

router.get("/", async (req, res) => {
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
});

router.get("/:id", getAudit, (req, res) => {
  res.json({
    _id: res.audit._id,
    name: res.audit.name,
    introtext: res.audit.introtext,
    conclusion: res.audit.conclusion,
    questions: res.audit.questions,
    date_created: res.audit.date_created
  });
});

router.get("/question/:id", async (req, res) => {
  try {
    const audits = await Audit.find({ questions: req.params.id })
      .select("_id name")
      .sort("name")
      .lean()
      .exec();
    res.json(audits);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
        res.audit.questions = req.body.questions;
        try {
          await res.audit.save();
          res.status(200).json({
            name: res.audit.name,
            introtext: res.audit.introtext,
            conclusion: res.audit.conclusion,
            questions: res.audit.questions
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

router.post("/addFile", upload.single("file"), async (req, res) => {
  if (req.headers.authorization === undefined) {
    res.status(403).json({ message: "Токен не распознан" });
  } else {
    const token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.SECRET, async function(err, decoded) {
      if (err) {
        res.status(403).json({ message: "Токен неправильный" });
      } else {
        const newFileName = req.file != null ? req.file : null;
        try {
          await res.json(newFileName);
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
    audit = await Audit.findOne({ _id: req.params.id }).populate({
      path: "questions",
      select: "_id name level introtext"
    });
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
