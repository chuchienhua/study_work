import { config } from 'dotenv';
config();

import express from "express";
import cors from "cors";
import mongodbapi from "./mongodbapi.js";

const app = express();

// 優化後的中間件設置
// parse application/json
app.use(express.json({ limit: "20mb" }));
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// 設置CORS策略
const corsOptions = {
  origin: ['http://localhost:3000', "http://192.168.0.13:3000" ,"https://studywork-front-qrvta6hen-chuchienhuas-projects.vercel.app"], // 允許訪問的源列表
  credentials: true, // 允許跨域請求帶有認證信息（如Cookies）
  optionsSuccessStatus: 200 // 某些舊版瀏覽器（IE11, various SmartTVs）兼容性設置
};
app.use(cors(corsOptions));


const port = process.env.PORT || 3001;
app.use('/study', mongodbapi);

app.listen(port, () => {
  console.log("server start");
});
