import * as mongodb from './mongodb.js'
import axios from 'axios';
import express from 'express';

const StuduApi = express.Router()

//login
StuduApi.post('/creatmember', async (req, res) => {
    const id = req.body.id
    const pw = req.body.pw
    await mongodb.creatmember(id, pw)
    res.send('ok')
})

//check member
StuduApi.post('/findmember', async (req, res) => {
    const id = req.body.id
    const pw = req.body.pw
    // 先檢查是否存在相同的 id 和 pw 的成員
    const memberExists = await mongodb.findMember(id, pw);

    if (memberExists) {
        res.status(400).send('Member already exists');
    } else {
        // 成員不存在
        res.status(200).send('Member does not exist');
    }
});

//insert study data.
StuduApi.post('/creatstudy', async (req, res) => {
    try {
        const id = req.body.id
        const studytime = req.body.studytime
        const studycontent = req.body.studycontent
        await mongodb.creatstudy(id, studytime, studycontent)
        res.send('ok')
    } catch (err) {
        console.error('An error occurred:', err);
    }
})

StuduApi.post('/update-study', async (req, res) => {
    // 從請求體中提取資料
    const id = req.body.id;
    const studytime = req.body.studytime;
    const studycontent = req.body.studycontent;

    // 檢查請求體中是否包含所有必要的資料
    if (!id || !studytime || !studycontent) {
        return res.status(400).send('Missing data in request body');
    }

    try {
        // 呼叫 updateStudyData 函數進行更新
        await mongodb.updateStudyData(id, studytime, studycontent);
        res.send('Study data updated successfully');
    } catch (error) {
        // 處理可能發生的錯誤
        console.error('Error updating study data:', error);
        res.status(500).send('Error updating study data');
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

StuduApi.get('/testhello', async (req, res) => {
    try {
        res.json('hellow'); // 發送JSON響應
    } catch (error) {
        console.error('Error retrieving study data:', error);
        res.status(500).send('Error retrieving study data');
    }
});

export default StuduApi;