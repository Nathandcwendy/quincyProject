const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const express = require("express");
admin.initializeApp();
const db = admin.firestore();
const app = express();

const setCaching = (req, res, next) => {
  res.set("Cache-Control", "public, max-age=300, s-maxage=600");
  next();
};

const authenticate = async (req, res, next) => {
  console.log(req.url);
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    res.status(403).send({status: 403, message: "Unauthorized"});
    return;
  }
  const idToken = req.headers.authorization.split("Bearer ")[1];
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (e) {
    console.log(e);
    res.status(403).send({status: 403, message: "Unauthorized"});
    return;
  }
};

const confirmStatus = (date) => {
  const regex = /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/;
  if (regex.test(date.toString())) {
    const currentDate = Date.now();
    const expiryDate = new Date(date).getTime();
    return expiryDate - currentDate > 0;
  }
  return false;
};

const verifyReportData = (data) => {
  const dateRegex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
  const nrnRegex = /^[\da-zA-Z]{1,5}-[\da-zA-Z]{1,10}$/;
  const dateTest1 = dateRegex.test(data.manufactureDate);
  const dateTest2 = dateRegex.test(data.expiryDate);
  const nrnTest = nrnRegex.test(data.nrn);
  return dateTest1 && dateTest2 && nrnTest;
};

app.use(authenticate);

app.get(setCaching);

app.get("/api", async (req, res) => {
  res.status(200).send({status: 200, message: "Ok", result: "Hello World"});
});

app.get("/api/inventory/:letter", async (req, res) => {
  const {letter} = req.params;
  const alphabetsArr = [
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
  const arr = [];
  if (letter.length === 1 && alphabetsArr.includes(letter.toLowerCase())) {
    try {
      const snapShot = await db
        .collection(`index_${letter.toUpperCase()}`)
        .get();
      if (!snapShot.empty) {
        snapShot.forEach((i) => arr.push(i.data()));
        const obj = {
          status: 200,
          message: "Ok",
          results: arr,
        };
        res.send(obj);
      } else {
        res.status(404).send({status: 404, message: "Data Not Found"});
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: res.statusCode,
        message: "Internal Server Error",
      });
    }
  } else if (letter.length === 1) {
    try {
      const snapShot = await db.collection(`index_misc`).get();
      if (!snapShot.empty) {
        snapShot.forEach((i) => arr.push(i.data()));
        const obj = {
          status: 200,
          message: "Ok",
          results: arr,
        };
        res.send(obj);
      } else {
        res.status(404).send({status: 404, message: "Data Not Found"});
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: res.statusCode,
        message: "Internal Server Error",
      });
    }
  } else {
    res.status(400).send({status: 400, message: "Invalid Request"});
  }
});

app.get("/api/nrn/:nrn", async (req, res) => {
  try {
    const {nrn} = req.params;
    const snapShot = await db
      .collection("drugsData")
      .where("nrn", "==", nrn)
      .get();
    const arr = [];
    if (!snapShot.empty) {
      snapShot.forEach((i) => arr.push(i.data()));
      arr.forEach((i) => {
        Object.keys(i).forEach((key) => {
          if (key == "status") {
            if (i.expiry_date && confirmStatus(i.expiry_date)) {
              i["status"] = "Active";
            } else {
              i["status"] = "Inactive";
            }
          }
        });
      });
      const obj = {
        status: 200,
        message: "Ok",
        results: arr,
      };
      res.send(obj);
    } else {
      res.status(404).send({status: 404, message: "Data Not Found"});
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: res.statusCode,
      message: "Internal Server Error",
    });
  }
});

app.get("/api/id/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const snapShot = await db.collection("drugsData").doc(id).get();
    if (snapShot.exists) {
      const data = snapShot.data();
      if (data.expiry_date && confirmStatus(data.expiry_date)) {
        data["status"] = "Active";
      } else {
        data["status"] = "Inactive";
      }
      const obj = {
        status: 200,
        message: "Ok",
        result: data,
      };
      res.send(obj);
    } else {
      res.status(404).send({status: 404, message: "Data Not Found"});
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: res.statusCode,
      message: "Internal Server Error",
    });
  }
});

app.post("/api/report", async (req, res) => {
  const data = req.body;
  const {
    productName,
    nrn,
    manufacturerName,
    manufacturerCountry,
    manufactureDate,
    expiryDate,
  } = req.body;
  if (
    productName &&
    nrn &&
    manufacturerName &&
    manufacturerCountry &&
    manufactureDate &&
    expiryDate
  ) {
    if (verifyReportData(data)) {
      data["userId"] = req.user.uid;
      const id = await db.collection("drugReports").add(data);
      data["id"] = id.id;
      const obj = {status: 200, message: "Ok", result: data};
      res.status(200).send(obj);
    } else {
      res.status(400).send({status: 400, message: "Invalid Request"});
    }
  } else {
    res.status(400).send({status: 400, message: "Invalid Request"});
  }
});

app.all("*", (req, res) => {
  res.status(400).send({status: 400, message: "Invalid Request"});
});

exports.api = onRequest({maxInstances: 10, cors: false}, app);
