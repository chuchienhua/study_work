import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongodbapi from "./mongodbapi.js";
const app = express();
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json({ limit: "20mb" }));
app.use(cors());
// parse form-data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const port = process.env.PORT || 3000;
app.use('/study', mongodbapi)

app.listen(port, () => {
  console.log("server start");
});