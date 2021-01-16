//Dateformat
const dateFormat = require("dateformat");

//express configuration
const express = require("express"); //Importa la libreria
const body_parser = require("body-parser");
const cors = require("cors");
const app = express(); //Crea el servidor
app.use(cors());
const port = process.env.PORT || 3000;
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.listen(port, () => {
  console.log("Listening in port " + port);
});

//axios configuration
const axios = require("axios");

//fs
var fs = require('fs');

//Firebase configuration
//const db1 = require("./firebaseConfig").db1;
//const db2 = require("./firebaseConfig").db2;

//Configuration from CronJob
//const cronJob = require("./CronJob")
//cronJob.job.start()
//cronJob.job2.start()

//Endpoints de la API 
app.get("/", (req, res) => {
  res.send({
    message: "Server online",
  });
});

//Get the deal of the day

app.get("/dotd", (req, res) => {
  let date = new Date();
  let formatDate = dateFormat(date, "dd/mm/yyyy");
  let data = [];
  fs.readFile('deals.json', function (err, content) {
    if (err) throw err;
    var parseJson = JSON.parse(content);
    data = parseJson.filter(deal => deal.date == formatDate);
    //console.log(data);
    res.send(data)
  })
});

//Get sensor data of the day from firebase
app.get("/getSensorData", (req, res) => {
  let date = new Date();
  let formatDate = dateFormat(date, "dd/mm/yyyy");
  let data = [];
  fs.readFile('deals.json', function (err, content) {
    if (err) throw err;
    var parseJson = JSON.parse(content);
    data = parseJson.filter(deal => deal.date == formatDate);
    console.log(data);
  })
});

//Get the sensor data of the moment with an axios request to the python API 
app.get("/getCurrentSensorData", (req, res) => {
  axios.get("http://192.168.15.100:8080/getCurrentSensorData").then((data) => {
    res.send(data.data);
  });
});
