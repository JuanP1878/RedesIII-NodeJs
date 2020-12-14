//Firebase configuration
var admin = require("firebase-admin");
let serviceAccount = require("./smarthome-72e44-firebase-adminsdk-zjvss-040b8357da.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
let db1 = admin.firestore();


let serviceAccount2 = require("./infinagames-firebase-adminsdk-9jhl4-92156b3cbc.json");
let other = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount2),
    databaseURL: "https://infinagames.firebaseio.com",
  },
  "db2"
  
);
const db2 = other.firestore();

exports.db1 = db1;
exports.db2 = db2;