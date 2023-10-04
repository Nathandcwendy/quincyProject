import admin from "firebase-admin";
import axios from "axios";
const serviceAccount = "./serviceAccount.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quincy-393920.firebaseio.com",
});

const db = admin.firestore();

// const uploadData = async () => {
//   const res = await axios.get("http://localhost:3060/finalData");
//   if (res.status == 200) {
//     for (const [index, value] of res.data.entries()) {
//       await db
//         .collection(`drugsData`)
//         .doc(`${value.id}`)
//         .set(value)
//         .then(
//           () => {
//             console.log(`\n ${index + 1} of ${res.data.length} Completed`);
//             console.log(
//               `${((index + 1) / res.data.length) * 100}% Completed \n`
//             );
//           },
//           (err) => {
//             console.error(err.message);
//           }
//         );
//     }
//     console.log("Data Upload Completed!!!!");
//   }
// };

// const uploadIndexes = async () => {
//   const res = await axios.get("http://localhost:3060/index");
//   if (res.status == 200) {
//     for (const [key, value] of Object.entries(res.data)) {
//       for (const [index, el] of value.entries()) {
//         let obj = {
//           "name": el.product_name,
//           "id": el.id,
//         };
//         await db
//           .collection(`index_${key}`)
//           .doc(`${el.id}`)
//           .set(obj)
//           .then(
//             () => {
//               console.log(`\n ${index + 1} of ${value.length} Completed`);
//               console.log(
//                 `${((index + 1) / value.length) * 100}% Completed \n`
//               );
//             },
//             (err) => {
//               console.error(err.message);
//             }
//           );
//       }
//       console.log(`index_${key} Upload Completed`);
//     }
//     console.log("Data Upload Completed!!!!");
//   }
// };

const uploadIndexes = async () => {
  const res = await axios.get("http://localhost:3060/index");
  if (res.status == 200) {
    for (const [key, value] of Object.entries(res.data)) {
      for (const [index, el] of value.entries()) {
        let obj = {
          [el.id]: el.product_name,
        };
        await db
          .collection("indexes")
          .doc(`index_${key}`)
          .set(obj, { merge: true })
          .then(
            () => {
              console.log(`\n ${index + 1} of ${value.length} Completed`);
              console.log(
                `${((index + 1) / value.length) * 100}% Completed \n`
              );
            },
            (err) => {
              console.error(err.message);
            }
          );
      }
      console.log(`index_${key} Upload Completed`);
    }
    console.log("Data Upload Completed!!!!");
  }
};

const getIndexes = async () => {
  let data = (await db.collection("indexes").doc("index_A").get()).data();
  console.log(data);
};

getIndexes();
// uploadIndexes();
