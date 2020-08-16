const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Promise = require("bluebird");
const Result = require("../model/result");
const Question = require("../model/question");

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
              path: "audit._id",
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

router.get("/:id", getResult, (req, res) => {
  res.json({
    _id: res.result._id,
    audit: res.result.audit,
    url: res.result.url,
    date_created: res.result.date_created,
    passwordCreated: res.result.passwordCreated
  });
});

router.patch("/:id", getResult, async (req, res) => {
  const valid = await bcrypt.compare(req.body.passwordCheck, res.result.password);
  if (!valid) {
    res.status(401).json({ message: "Неправильный пароль" });
  } else {
    res.result.audit.questions = req.body.questions;
    try {
      await res.result.save();
      res.status(200).json({
        questions: res.result.audit.questions
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});

router.patch("/:id/password", getResult, async (req, res) => {
  if (res.result.passwordCreated != false) {
    res.status(401).json({ message: "Пароль уже установлен" });
  }
  if (!req.body.email && !req.body.password) {
    res.status(401).json({ message: "Заполните почту и пароль" });
  } else {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    res.result.email = req.body.email;
    res.result.password = hashedPassword;
    res.result.passwordCreated = req.body.passwordCreated;
    try {
      await res.result.save();
      res.status(200).json({
        password: res.result.password,
        passwordCreated: res.result.passwordCreated
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});

router.post("/", async (req, res) => {
  if (!req.body.audit && !req.body.url) {
    res.status(401).json({ message: "Нет данных для создания аудита" });
  } else {
    const result = new Result({
      audit: req.body.audit,
      url: req.body.url
    });
    try {
      await result.save();
      res.status(201).json({ urlToRedirect: result._id });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});

router.post("/mainVersion/", async (req, res) => {
  if (!req.body.url) {
    res.status(401).json({ message: "Введите адрес сайта" });
  } else {
    let url = req.body.url;
    let urlList = [`http://${url}`, `https://${url}`, `http://www.${url}`, `https://www.${url}`];
    try {
      let statusList = await Promise.map(urlList, async url => {
        status = await fetch(url, { redirect: "manual" }).then(response => {
          return response.status;
        });
        return status;
      });
      const mergedList = urlList.reduce((obj, key, index) => [...obj, { [key]: statusList[index] }], []);
      res.json(mergedList);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});

router.post("/serverResponse/", async (req, res) => {
  if (!req.body.url && !req.body.mainVersion) {
    res.status(401).json({ message: "Выберите основную версию сайта" });
  } else {
    let url = req.body.url;
    let mainVersion = req.body.mainVersion;
    let urlList = [
      `${mainVersion}${url}`,
      `${mainVersion}${url}//`,
      `${mainVersion}${url}/index`,
      `${mainVersion}${url}/index.html`,
      `${mainVersion}${url}/index.php`,
      `${mainVersion}${url}/page/1`
    ];

    try {
      let statusList = await Promise.map(urlList, async url => {
        status = await fetch(url, { redirect: "manual" }).then(response => {
          return response.status;
        });
        return status;
      });
      const mergedList = urlList.reduce((obj, key, index) => [...obj, { [key]: statusList[index] }], []);
      res.json(mergedList);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});

router.delete("/:id", getResult, async (req, res) => {
  if (req.headers.authorization === undefined) {
    res.status(403).json({ message: "Токен не распознан" });
  } else {
    const token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.SECRET, async function(err, decoded) {
      if (err) {
        res.status(403).json({ message: "Токен неправильный" });
      } else {
        try {
          await res.result.remove();
          res.status(200).json({ message: "Удалено" });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
    });
  }
});

async function getResult(req, res, next) {
  let result;
  try {
    result = await Result.findOne({ _id: req.params.id })
      .populate({
        path: "audit._id",
        select: "name introtext conclusion questions",
        populate: {
          path: "questions",
          select: "name introtext level answers feature"
        }
      })
      .exec();
    if (result == null) {
      return res.status(404).json({ message: "Нет такой страницы" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  let questionsDefault = result.audit._id.questions;
  let questionsAnswered = result.audit.questions;

  questionsDefault.map(x => {
    return questionsAnswered.map(y => {
      if (y.id === x.id) {
        x.answer_picked = y.answer_picked;
        x.comment = y.comment;
        return x;
      }
    });
  });

  res.result = result;
  next();
}

module.exports = router;
