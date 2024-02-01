import { MongoClient, ServerApiVersion } from 'mongodb';

// 确保连接字符串是最新的，包含数据库名和tls=true参数
// const uri = 'mongodb+srv://serre1234:Mm0922578849@cluster0.iiipjhx.mongodb.net/?retryWrites=true&w=majority';
const uri =process.env.ATLAS.URI
export async function connectToCollection(dbName, collectionName) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  try {
    // 连接到MongoDB服务器
    await client.connect();
    console.log('Connected successfully to server');

    // 选择数据库和集合
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    return {
      collection,
      closeConnection: () => client.close(),
    };
  } catch (err) {
    // 处理连接错误
    console.error('An error occurred connecting to MongoDB: ', err);
    throw err; // 重新抛出错误，允许调用者处理它
  }
}
