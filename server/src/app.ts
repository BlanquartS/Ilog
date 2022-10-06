import * as express from "express";
import * as cors from "cors";
import * as fs from "node:fs";
import HTTP from "./httpcodes";
const app = express(); // obtient l'application ExpressJS
const path = require("path");
const bp = require("body-parser");

app.use(cors());
app.use(bp.json());
app.options("*", cors); // enable pre-flight

app.get("/getAll", function (req, res) {
  var data = fs.readFileSync(
    path.join(__dirname, "../assets/ilogd.json"),
    "utf8"
  );
  var json = JSON.parse(data);
  res.status(HTTP.OK);
  res.json(json);
});

app.post("/setAll", function (req, res) {
  var newJson: string = req.body;
  fs.writeFileSync(
    path.join(__dirname, "../assets/ilogd.json"),
    JSON.stringify(newJson)
  );
  res.sendStatus(HTTP.OK);
});

app.listen(8081, () => {
  // lancement du serveur sur le port 8081
  console.log("listening on port 8081");
});
