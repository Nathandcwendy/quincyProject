const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const express = require("express");

const serviceAccount = "./serviceAccount.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quincy-393920.firebaseio.com",
});
// admin.initializeApp();

const db = admin.firestore();
const app = express();
exports.message = onRequest(app);

app.get("/api", async (req, res) => {
  res
    .status(200)
    .send({ "status": 200, "message": "Ok", result: "Hello World" });
});

app.get("/api/inventory/:letter", async (req, res) => {
  const { letter } = req.params;
  let alphabetsArr = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  let arr = [];
  if (letter.length === 1 && alphabetsArr.includes(letter.toLowerCase())) {
    try {
      const snapShot = await db
        .collection(`index_${letter.toUpperCase()}`)
        .get();
      if (!snapShot.empty) {
        snapShot.forEach((i) => arr.push(i.data()));
        let obj = {
          "status": 200,
          "message": "Ok",
          results: arr,
        };
        res.send(obj);
      } else {
        res.status(404).send({ "status": 404, "message": "Data Not Found" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        "status": res.statusCode,
        "message": res.statusMessage,
      });
    }
  } else if (letter.length === 1) {
    try {
      const snapShot = await db.collection(`index_misc`).get();
      if (!snapShot.empty) {
        snapShot.forEach((i) => arr.push(i.data()));
        let obj = {
          "status": 200,
          "message": "Ok",
          results: arr,
        };
        res.send(obj);
      } else {
        res.status(404).send({ "status": 404, "message": "Data Not Found" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        "status": res.statusCode,
        "message": res.statusMessage,
      });
    }
  } else {
    res.status(400).send([{ "status": 400, "message": "Invalid Request" }]);
  }
});

app.get("/api/nrn/:nrn", async (req, res) => {
  try {
    let { nrn } = req.params;
    const snapShot = await db
      .collection("drugsData")
      .where("nrn", "==", nrn)
      .get();
    let arr = [];
    if (!snapShot.empty) {
      snapShot.forEach((i) => arr.push(i.data()));
      console.log(snapShot.size);
      let obj = {
        "status": 200,
        "message": "Ok",
        result: arr[0],
      };
      res.send(obj);
    } else {
      res.status(404).send({ "status": 404, "message": "Data Not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      "status": res.statusCode,
      "message": res.statusMessage,
    });
  }
});

app.get("/api/id/:id", async (req, res) => {
  try {
    let { id } = req.params;
    const snapShot = await db.collection("drugsData").doc(id).get();
    if (snapShot.exists) {
      let obj = {
        "status": 200,
        "message": "Ok",
        result: snapShot.data(),
      };
      res.send(obj);
    } else {
      res.status(404).send({ "status": 404, "message": "Data Not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      "status": res.statusCode,
      "message": res.statusMessage,
    });
  }
});

app.all("*", (req, res) => {
  res.status(400).send({ "status": 400, "message": "Invalid Request" });
});
