const express = require("express");
const { join } = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.static(join(__dirname, "public")));

app.get("/auth_config.json", (req, res) => {
  res.sendFile(join(__dirname, "auth_config.json"));
});


app.get("css/styles.css", (_, res) => {
  res.sendFile(join(__dirname, "./css/styles.css"));
});

app.get("css/main.css", (_, res) => {
  res.sendFile(join(__dirname, "./css/main.css"));
});


app.get("/*", (_, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

process.on("SIGINT", function() {
  process.exit();
});

module.exports = app;
