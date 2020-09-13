const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Question = require("../model/question");

const multer = require("multer");
const imageMimeTypes = ["image/jpeg", "image/png"];
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "static/uploads/question");
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
    const questions = await Question.find()
      .select("_id name introtext level")
      .sort("name")
      .lean()
      .exec();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", getQuestion, (req, res) => {
  res.json({
    _id: res.question._id,
    name: res.question.name,
    introtext: res.question.introtext,
    level: res.question.level,
    feature: res.question.feature,
    date_created: res.question.date_created,
    answers: res.question.answers
  });
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
        const question = new Question({
          name: req.body.name,
          introtext: req.body.introtext,
          level: req.body.level,
          feature: req.body.feature
        });
        try {
          await question.save();
          res.status(201).json({ message: "Создано" });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
    });
  }
});

router.patch("/:id", getQuestion, async (req, res) => {
  if (req.headers.authorization === undefined) {
    res.status(403).json({ message: "Токен не распознан" });
  } else {
    const token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.SECRET, async function(err, decoded) {
      if (err) {
        res.status(403).json({ message: "Токен неправильный" });
      } else {
        res.question.name = req.body.name;
        res.question.introtext = req.body.introtext;
        res.question.level = req.body.level;
        res.question.feature = req.body.feature;
        try {
          await res.question.save();
          res.status(200).json({
            name: res.question.name,
            introtext: res.question.introtext,
            level: res.question.level,
            feature: res.question.feature
          });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
    });
  }
});

router.post("/:id/answer", async (req, res) => {
  if (req.headers.authorization === undefined) {
    res.status(403).json({ message: "Токен не распознан" });
  } else {
    const token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.SECRET, async function(err, decoded) {
      if (err) {
        res.status(403).json({ message: "Токен неправильный" });
      } else {
        const newAnswer = {
          name: req.body.name,
          recomendation: req.body.recomendation
        };
        res.question = await Question.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { answers: newAnswer } },
          { returnOriginal: false }
        );
        try {
          await res.question.save();
          res.status(201).json({ answers: res.question.answers });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
    });
  }
});

router.patch("/:id/answer", async (req, res) => {
  if (req.headers.authorization === undefined) {
    res.status(403).json({ message: "Токен не распознан" });
  } else {
    const token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.SECRET, async function(err, decoded) {
      if (err) {
        res.status(403).json({ message: "Токен неправильный" });
      } else {
        res.question = await Question.findOneAndUpdate(
          { _id: req.params.id, "answers._id": req.body.answerId },
          {
            $set: {
              "answers.$.name": req.body.answerName,
              "answers.$.recomendation": req.body.answerRecomendation
            }
          },
          { returnOriginal: false }
        );
        try {
          await res.question.save();
          res.status(201).json({ answers: res.question.answers });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
    });
  }
});

router.delete("/:id/answer", async (req, res) => {
  if (req.headers.authorization === undefined) {
    res.status(403).json({ message: "Токен не распознан" });
  } else {
    const token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.SECRET, async function(err, decoded) {
      if (err) {
        res.status(403).json({ message: "Токен неправильный" });
      } else {
        let deletedAnswer = { _id: req.headers.answerid };
        res.question = await Question.findOneAndUpdate(
          { _id: req.params.id },
          { $pull: { answers: deletedAnswer } },
          { returnOriginal: false }
        );
        try {
          await res.question.save();
          res.status(200).json({ answers: res.question.answers });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
    });
  }
});

router.delete("/:id", getQuestion, async (req, res) => {
  if (req.headers.authorization === undefined) {
    res.status(403).json({ message: "Токен не распознан" });
  } else {
    const token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.SECRET, async function(err, decoded) {
      if (err) {
        res.status(403).json({ message: "Токен неправильный" });
      } else {
        try {
          await res.question.remove();
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

async function getQuestion(req, res, next) {
  let question;
  try {
    question = await Question.findOne({ _id: req.params.id });
    if (question == null) {
      return res.status(404).json({ message: "Нет такой страницы" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.question = question;
  next();
}

module.exports = router;
