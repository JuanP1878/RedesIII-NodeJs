//cronJob configuration
const CronJob = require("cron").CronJob;

//WebScraping configuration
const webScraping = require("./web_scraping");

//Firebase configuration
const db1 = require("./firebaseConfig").db1;
const db2 = require("./firebaseConfig").db2;

//axios configuration
const axios = require("axios");

//Date format
const dateFormat = require("dateformat");

//CronJob configuration for webscraping once per day at 03:00 AM
//const job = new CronJob("0 3 * * 0-6"
const job = new CronJob("*/2 * * * *", async () => {
  console.log("CronJob 1")
  let dataaux;
  let date = new Date();
  let formatDate = dateFormat(date, "dd/mm/yyyy");
  await webScraping
    .doWebScraping()
    .then((articles) => {
      console.log("articles: ", articles);
      dataaux = articles[0];
    })
    .catch((err) => console.log(err));
  //console.log(dataaux);
  db1
    .collection("deals")
    .add({
      name: dataaux.title,
      deal_url: dataaux.link,
      img_url: dataaux.imageUrl,
      price: dataaux.price,
      date: formatDate,
    })
    .then(function () {
      console.log("Document successfully written!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
});

//CronJob configuration for the data update every 5 minutes everyday
const job2 = new CronJob("*/5 * * * *", async () => {
  let date = new Date();
  let formatDate = dateFormat(date, "dd/mm/yyyy");
  let dataaux;
  //console.log("Every 5 minutes ", date);
  //Llamada a la api del sensor y subir los datos a la base de datos
  await axios
    .get("http://192.168.15.100:8080/getCurrentSensorData")
    .then((data) => {
      //console.log(data.data);
      dataaux = data.data;
    });
  //console.log("**");
  db2
    .collection("sensors")
    .add({
      temp: dataaux.temp,
      hum: dataaux.hum,
      date: formatDate,
    })
    .then(function () {
      console.log("Document successfully written!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
});

job.start();
//job2.start();

exports.job = job;
exports.job2 = job2;
