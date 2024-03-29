import * as studymongodb from './connect.js'
import { ObjectId } from 'mongodb';

export async function creatmember(id, pw) {
    let closeConnection; // 定義一個變數以保持 closeConnection 函數
    try {
        const { collection, closeConnection: closeConn } = await studymongodb.connectToCollection('Study', 'study_login');
        closeConnection = closeConn; // 保存 closeConnection 函數以便稍後使用

        const doc = {
            loginId: id,
            loginPassword: pw,
        };
        const result = await collection.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } catch (err) {
        console.error('An error occurred:', err);
    }
    finally {
        if (closeConnection) {
            closeConnection(); // 使用保存的 closeConnection 函數來關閉連接
        }
    }
}

export async function findMember(id, pw) {
    let closeConnection; // 定義一個變數以保持 closeConnection 函數
    try {
        const { collection, closeConnection: closeConn } = await studymongodb.connectToCollection('Study', 'study_login');
        closeConnection = closeConn; // 保存 closeConnection 函數以便稍後使用

        // 使用 findOne 查找一個文檔，同時匹配 loginId 和 loginPassword
        const member = await collection.findOne({
            loginId: id,
            loginPassword: pw
        });

        // 如果 member 存在，返回找到的會員資訊
        if (member) {
            console.log(`Member found with id: ${id}`);
            return member;
        } else {
            // 如果沒有找到會員，返回 null
            console.log(`No member found with matching id and password`);
            return null;
        }
    } catch (err) {
        console.error('An error occurred:', err);
        return null;
    }
    finally {
        if (closeConnection) {
            closeConnection(); // 使用保存的 closeConnection 函數來關閉連接
        }
    }
}

//insert study data
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // 月份是從0開始的
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

//insert study data
export async function createStudy(id, studyDatebyself, studytime, studycontent) {
    let closeConnection;
    let obj = {
        res: [],
        error: false,
    };
    try {
        const { collection, closeConnection: closeConn } = await studymongodb.connectToCollection('Study', 'study_time');
        closeConnection = closeConn;

        // 先查詢 studyDatebyself 是否已存在
        const existingDocument = await collection.findOne({ studyDatebyself: studyDatebyself });
        if (existingDocument) {
            throw new Error('已經登記過此日期，請重新確認');
        }

        const doc = {
            loginId: id,
            studyDate: new Date(), // 假設 getCurrentDateTime() 返回當前日期時間
            studyDatebyself: studyDatebyself,
            studytime: studytime,
            studycontent: studycontent,
        };

        const result = await collection.insertOne(doc);
        obj.res.push(result.insertedId); // 儲存插入文檔的 ID

    } catch (err) {
        console.error('An error occurred:', err);
        obj.error = true;
        obj.res = err.message; // 儲存錯誤訊息
    } finally {
        if (closeConnection) {
            closeConnection();
        }
    }

    return obj; // 返回 obj 對象，包含操作結果或錯誤信息
}


// update studytime 與 studycontent
export async function updateStudyData(id, studyDatebyself, studytime, studycontent) {
    let closeConnection;
    try {
        const { collection, closeConnection: closeConn } = await studymongodb.connectToCollection('Study', 'study_time');
        closeConnection = closeConn;

        // 將字符串形式的 _id 轉換為 ObjectId
        const documentId = new ObjectId(id);

        // 更新文檔
        const updateResult = await collection.updateOne(
            { _id: documentId },
            { $set: { studyDatebyself: studyDatebyself, studytime: studytime, studycontent: studycontent } }
        );

        if (updateResult.modifiedCount === 1) {
            console.log(`Document with _id: ${id} was successfully updated.`);
        } else {
            console.log(`No document matched the provided _id. No updates were made.`);
        }
    } catch (err) {
        console.error('An error occurred during the update:', err);
    }
    finally {
        if (closeConnection) {
            closeConnection();
        }
    }
}

//刪除資料
export async function deleteStudyDataById(id) {
    let closeConnection;
    try {
        const { collection, closeConnection: closeConn } = await studymongodb.connectToCollection('Study', 'study_time');
        closeConnection = closeConn;

        // 將字符串形式的 _id 轉換為 ObjectId
        const documentId = new ObjectId(id);

        // 刪除指定的文檔
        const deleteResult = await collection.deleteOne({ _id: documentId });

        if (deleteResult.deletedCount === 1) {
            console.log(`Document with _id: ${id} was successfully deleted.`);
            return { success: true, message: `Document with _id: ${id} was successfully deleted.` };
        } else {
            console.log(`No document matched the provided _id. No documents were deleted.`);
            return { success: false, message: `No document matched the provided _id. No documents were deleted.` };
        }
    } catch (err) {
        console.error('An error occurred during the deletion:', err);
        return { success: false, message: err.message };
    }
    finally {
        if (closeConnection) {
            closeConnection();
        }
    }
}

// 獲取所有學習資料
export async function getAllStudyData() {
    let closeConnection;
    try {
        const { collection, closeConnection: closeConn } = await studymongodb.connectToCollection('Study', 'study_time');
        closeConnection = closeConn;

        // 使用 find 方法獲取所有文檔
        const studyData = await collection.find({}).toArray();

        return studyData; // 返回查詢到的數據
    } catch (err) {
        console.error('An error occurred while retrieving study data:', err);
    }
    finally {
        if (closeConnection) {
            closeConnection();
        }
    }
}

// 获取特定用户的所有学习数据
export async function getStudyDataByUserId(userId) {
    let closeConnection;
    try {
        const { collection, closeConnection: closeConn } = await studymongodb.connectToCollection('Study', 'study_time');
        closeConnection = closeConn;

        // 使用 find 方法和查询条件获取特定用户的文档
        const studyData = await collection.find({ loginId: userId }).toArray();

        return studyData; // 返回查询到的数据
    } catch (err) {
        console.error('An error occurred while retrieving study data for user:', userId, err);
        throw err; // 抛出错误以便于外部捕获
    } finally {
        if (closeConnection) {
            closeConnection();
        }
    }
}

