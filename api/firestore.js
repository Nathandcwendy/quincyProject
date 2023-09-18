import axios from "axios";
import firebaseAdmin from "firebase-admin";

const admin = firebaseAdmin;

const serviceAccount = "./serviceAccount.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const fireStore = admin.firestore();

const fetchData = async () => {
  const res = await axios.get("http://localhost:3060/finalData");
  if (res.status == 200) {
    const dataArr = [...res.data];

    for (const [index, value] of dataArr.entries()) {
      if (index < 200) {
        await fireStore
          .collection("drugsData")
          .doc(`${value.id}`)
          .set(value)
          .then(
            () => {
              console.log(`${index + 1} of ${dataArr.length} Completed`);
            },
            (err) => {
              throw new Error(err);
            }
          );
      }
    }
  }
};
// fetchData();

const addInventory = async () => {
  const res = await axios.get("http://localhost:3060/finalData");
  if (res.status == 200) {
    const dataArr = [...res.data];
    dataArr.sort((a, b) => {
      if (a.product_name < b.product_name) {
        return -1;
      }
      if (a.product_name > b.product_name) {
        return 1;
      }
      return 0;
    });

    for (const [index, value] of dataArr.entries()) {
      if (index < 3188) {
        let data = { name: value.product_name };
        await fireStore
          .collection("drugsInventory")
          .doc(`${value.id}`)
          .set(data)
          .then(
            () => {
              console.log(`${index + 1} of ${dataArr.length} Completed`);
            },
            (err) => {
              console.error(err.message);
            }
          );
      }
    }
  }
};

// addInventory();

const addIndexedInventory = async () => {
  const res = await axios.get("http://localhost:3060/index");
  if (res.status == 200) {
    for (const [key, value] of Object.entries(res.data)) {
      for (const [index, el] of value.entries()) {
        let data = { name: el.product_name };
        await fireStore
          .collection(`index_${key}`)
          .doc(`${el.id}`)
          .set(data)
          .then(
            () => {
              console.log(`${index + 1} of ${value.length} Completed`);
            },
            (err) => {
              console.error(err.message);
            }
          );
      }
      console.log(`Done With ${key}`);
    }
  }
};

addIndexedInventory();
