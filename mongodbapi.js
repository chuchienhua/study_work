import * as mongodb from './mongodb.js'
import axios from 'axios';
import express from 'express';

const StuduApi = express.Router()

//login
StuduApi.post('/creatmember', async (req, res) => {
    const id = req.body.id
    const pw = req.body.pw
    await mongodb.creatmember(id, pw)
    res.json({ login: "ok" }) // 修正 JSON 格式
})

//check member
StuduApi.post('/findmember', async (req, res) => {
    const id = req.body.id
    const pw = req.body.pw
    // 先檢查是否存在相同的 id 和 pw 的成員
    const memberExists = await mongodb.findMember(id, pw);

    if (memberExists) {
        res.json({ status: "success", message: "Login successful", id: id, pw: pw });
        console.log("123");
    } else {
        // 成員不存在
        res.json({ status: "error", message: "Invalid credentials" });
    }
});

//insert study data.
StuduApi.post('/creatstudy', async (req, res) => {

    const id = req.body.id
    const studyDatebyself = req.body.studyDatebyself
    const studytime = req.body.studytime
    const studycontent = req.body.studycontent
    mongodb.createStudy(id, studyDatebyself, studytime, studycontent)
        .then(val => res.send(val));
})

StuduApi.post('/update-study', async (req, res) => {
    // 從請求體中提取資料
    const id = req.body.id;
    const studyDatebyself = req.body.studyDatebyself
    const studytime = req.body.studytime;
    const studycontent = req.body.studycontent;

    // 檢查請求體中是否包含所有必要的資料
    if (!id || !studytime || !studycontent) {
        return res.status(400).send('Missing data in request body');
    }
    try {
        // 呼叫 updateStudyData 函數進行更新
        await mongodb.updateStudyData(id, studyDatebyself, studytime, studycontent);
        res.json({ status: 'success' });
    } catch (error) {
        // 處理可能發生的錯誤
        console.error('Error updating study data:', error);
        res.json({ status: 'error' });
    }
});

StuduApi.post('/deleteStudyDataById', async (req, res) => {
    // 從請求體中提取資料
    const id = req.body.id;

    // 檢查請求體中是否包含所有必要的資料
    if (!id) {
        return res.status(400).send('Missing data in request body');
    }
    try {
        // 呼叫 deleteStudyDataById 函數進行更新
        await mongodb.deleteStudyDataById(id);
        res.json({ status: 'success' });
    } catch (error) {
        // 處理可能發生的錯誤
        console.error('Error updating study data:', error);
        res.json({ status: 'error' });
    }
});

// 設定檢索所有學習資料的路由
StuduApi.get('/get-study-data', async (req, res) => {
    try {
        const studyData = await mongodb.getAllStudyData();
        res.json(studyData); // 發送JSON響應
    } catch (error) {
        console.error('Error retrieving study data:', error);
        res.status(500).send('Error retrieving study data');
    }
});

// 设置检索特定用户学习数据的路由
StuduApi.get('/get-study-data/:id', async (req, res) => {
    const userId = req.params.id; // 从 URL 获取用户 ID
    try {
        const studyData = await mongodb.getStudyDataByUserId(userId);
        res.json(studyData); // 发送 JSON 响应
    } catch (error) {
        console.error('Error retrieving study data for user ID:', userId, error);
        res.status(500).send('Error retrieving study data');
    }
});


StuduApi.get('/testhello', async (req, res) => {
    try {
        res.json('hellow'); // 發送JSON響應
    } catch (error) {
        console.error('Error retrieving study data:', error);
        res.status(500).send('Error retrieving study data');
    }
});

export default StuduApi;