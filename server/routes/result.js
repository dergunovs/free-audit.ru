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
            .select("_id audit url date_created email passwordCreated")
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

router.post("/urlPrefix/", async (req, res) => {
  if (!req.body.url) {
    res.status(401).json({ message: "Нет адреса сайта" });
  } else {
    let url = req.body.url;
    let urlList = [`http://${url}`, `http://www.${url}`, `https://${url}`, `https://www.${url}`];
    try {
      let statusList = await Promise.map(urlList, async url => {
        status = await fetch(url, { redirect: "manual" })
          .then(response => {
            return response.status;
          })
          .catch(error => {
            return "Ошибка сервера";
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
  if (!req.body.url && !req.body.urlPrefix) {
    res.status(401).json({ message: "Выберите основную версию сайта" });
  } else {
    let url = req.body.url;
    let urlPrefix = req.body.urlPrefix;
    let urlList = [
      `${urlPrefix}${url}`,
      `${urlPrefix}${url}//`,
      `${urlPrefix}${url}/index`,
      `${urlPrefix}${url}/index.html`,
      `${urlPrefix}${url}/index.php`,
      `${urlPrefix}${url}/page/1`
    ];

    try {
      let statusList = await Promise.map(urlList, async url => {
        status = await fetch(url, { redirect: "manual" })
          .then(response => {
            return response.status;
          })
          .catch(error => {
            return "Ошибка сервера";
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

router.post("/check404/", async (req, res) => {
  if (!req.body.url && !req.body.urlPrefix) {
    res.status(401).json({ message: "Выберите основную версию сайта" });
  } else {
    let url = req.body.url;
    let urlPrefix = req.body.urlPrefix;
    try {
      let status = await fetch(`${urlPrefix}${url}/check404error`, { redirect: "manual" })
        .then(response => {
          return response.status;
        })
        .catch(error => {
          return "Ошибка сервера";
        });
      res.json(status);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});

router.post("/checkIndex/", async (req, res) => {
  if (!req.body.url) {
    res.status(401).json({ message: "Нет адреса сайта" });
  } else {
    let url = req.body.url;
    try {
      let yaResponse = await fetch(
        `https://yandex.ru/search/xml?user=${process.env.YANDEX_USER}&key=${process.env.YANDEX_KEY}&query=host%3A${url}&l10n=ru&sortby=tm.order%3Dascending&filter=strict&groupby=attr%3D%22%22.mode%3Dflat.groups-on-page%3D10.docs-in-group%3D1`
      )
        .then(response => {
          return response.text();
        })
        .catch(error => {
          return "Ошибка сервера";
        });

      function getSecondYandexResponse() {
        let promise = new Promise((resolve, reject) => {
          setTimeout(async () => {
            let yaResponseWWW = await fetch(
              `https://yandex.ru/search/xml?user=${process.env.YANDEX_USER}&key=${process.env.YANDEX_KEY}&query=host%3Awww.${url}&l10n=ru&sortby=tm.order%3Dascending&filter=strict&groupby=attr%3D%22%22.mode%3Dflat.groups-on-page%3D10.docs-in-group%3D1`
            )
              .then(response => {
                return response.text();
              })
              .catch(error => {
                return "Ошибка сервера";
              });
            resolve(yaResponseWWW);
          }, 1000);
        });

        let yaResponseWWW = promise;
        return yaResponseWWW;
      }

      let yaResponseWWW = await getSecondYandexResponse();

      let gResponse = await fetch(
        `https://customsearch.googleapis.com/customsearch/v1?cx=${process.env.GOOGLE_CX}&q=site%3A${url}%20-inurl%3Awww%20-inurl%3Ahttps&key=${process.env.GOOGLE_KEY}`
      )
        .then(response => {
          return response.json();
        })
        .catch(error => {
          return "Ошибка сервера";
        });

      let gResponseWWW = await fetch(
        `https://customsearch.googleapis.com/customsearch/v1?cx=${process.env.GOOGLE_CX}&q=site%3A${url}%20inurl%3Awww%20-inurl%3Ahttps&key=${process.env.GOOGLE_KEY}`
      )
        .then(response => {
          return response.json();
        })
        .catch(error => {
          return "Ошибка сервера";
        });

      let gResponseHttps = await fetch(
        `https://customsearch.googleapis.com/customsearch/v1?cx=${process.env.GOOGLE_CX}&q=site%3A${url}%20-inurl%3Awww%20inurl%3Ahttps&key=${process.env.GOOGLE_KEY}`
      )
        .then(response => {
          return response.json();
        })
        .catch(error => {
          return "Ошибка сервера";
        });

      let gResponseHttpsWWW = await fetch(
        `https://customsearch.googleapis.com/customsearch/v1?cx=${process.env.GOOGLE_CX}&q=site%3A${url}%20inurl%3Awww%20inurl%3Ahttps&key=${process.env.GOOGLE_KEY}`
      )
        .then(response => {
          return response.json();
        })
        .catch(error => {
          return "Ошибка сервера";
        });

      let startYaSplit = `all">`;
      let endYaSplit = `</`;
      let yaPagesNumber =
        yaResponse.search("error code") != -1 ? 0 : yaResponse.split(startYaSplit)[1].split(endYaSplit)[0];
      let yaPagesNumberWWW =
        yaResponseWWW.search("error code") != -1 ? 0 : yaResponseWWW.split(startYaSplit)[1].split(endYaSplit)[0];
      let gPagesNumber = gResponse.searchInformation.totalResults;
      let gPagesNumberWWW = gResponseWWW.searchInformation.totalResults;
      let gPagesNumberHttps = gResponseHttps.searchInformation.totalResults;
      let gPagesNumberHttpsWWW = gResponseHttpsWWW.searchInformation.totalResults;

      res.json({
        yaPagesNumber,
        yaPagesNumberWWW,
        gPagesNumber,
        gPagesNumberWWW,
        gPagesNumberHttps,
        gPagesNumberHttpsWWW
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});

router.post("/checkRobots/", async (req, res) => {
  if (!req.body.url && !req.body.urlPrefix) {
    res.status(401).json({ message: "Выберите основную версию сайта" });
  } else {
    let url = req.body.url;
    let urlPrefix = req.body.urlPrefix;
    try {
      let status = await fetch(`${urlPrefix}${url}/robots.txt`, { redirect: "manual" })
        .then(response => {
          return response.status;
        })
        .catch(error => {
          return "Ошибка сервера";
        });
      res.json(status);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});

router.post("/checkSitemap/", async (req, res) => {
  if (!req.body.url && !req.body.urlPrefix) {
    res.status(401).json({ message: "Выберите основную версию сайта" });
  } else {
    let url = req.body.url;
    let urlPrefix = req.body.urlPrefix;
    try {
      let status = await fetch(`${urlPrefix}${url}/sitemap.xml`, { redirect: "manual" })
        .then(response => {
          return response.status;
        })
        .catch(error => {
          return "Ошибка сервера";
        });
      res.json(status);
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
