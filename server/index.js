require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const app = express();
app.use(express.json());

app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

const mongoose = require("mongoose");
mongoose.Schema.Types.Boolean.convertToFalse.add("");
mongoose.connect("mongodb://localhost/api", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const authRoutes = require("./routes/auth");
const emailRoutes = require("./routes/email");
const auditRoutes = require("./routes/audit");
const questionRoutes = require("./routes/question");
const resultRoutes = require("./routes/result");
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/result", resultRoutes);

const { loadNuxt, build } = require("nuxt");
const isDev = process.env.NODE_ENV !== "production";
async function start() {
  const nuxt = await loadNuxt(isDev ? "dev" : "start");
  app.use(nuxt.render);
  if (isDev) {
    build(nuxt);
  }
  app.listen("5000");
}

start();
