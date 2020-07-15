require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const consola = require("consola");
const { Nuxt, Builder } = require("nuxt");
const app = express();
const mongoose = require("mongoose");
mongoose.Schema.Types.Boolean.convertToFalse.add("");
const bodyParser = require("body-parser");

app.use(helmet());

mongoose.connect("mongodb://localhost/api", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to database"));

app.use(bodyParser.json());
app.use(express.json());

const config = require("../nuxt.config.js");
config.dev = process.env.NODE_ENV !== "production";

async function start() {
  const nuxt = new Nuxt(config);
  const { host, port } = nuxt.options.server;
  await nuxt.ready();
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  app.use(nuxt.render);
  app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
  app.use(function(err, req, res, next) {
    console.log("This is the invalid field ->", err.field);
    next(err);
  });

  app.listen(port, host);
  consola.ready({
    message: `Server listening http://${host}:${port}`,
    badge: true
  });
}
start();
