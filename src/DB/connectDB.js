const { MongoClient } = require("mongodb");

const connectionURL = process.env.MONGODB_CONNECTION_URL;
const databaseName = process.env.DATABASE;

// let _db;
// module.exports = {
//   // Connect with MongoDB sever
//   connectDB: async function (callback) {
//     try {
//       console.log(databaseName);
//       const client = new MongoClient(connectionURL);
//       await client.connect();
//       _db = client.db(databaseName);
//       return callback(null, _db);
//     } catch (error) {
//       return callback(error, null);
//     }
//   },

//   getDB: function () {
//     console.log("-", _db);
//     return _db;
//   },
// };

// create DB collection and return DB instances

const getDBInstance = async () => {
  // console.log("-->", connectionURL)
  // console.log("==>", databaseName)
  // console.log("->", process.env.MONGODB_CONNECTION_URL);
  // "mongodb://127.0.0.1:27017/"
  const client = await MongoClient.connect(process.env.MONGODB_CONNECTION_URL);

  const dbInstance = client.db(databaseName); // create DB instaces and return // No need to write await here
  return dbInstance;
};

let db;
const getDB = async () => {
  // If instances is not created then we will create the DB instances and return it
  if (!db) {
    db = getDBInstance();
  }
  return db;
};

// const clearDatabase = async () => {
//   if (!db) {
//     db = await getDBInstance();
//   }
//   await db.dropDatabase();
// };

// const getDB = () => {
//   if (!db) connectDB();
//   else return db;
// };

module.exports = {
  getDB,
  // clearDatabase,
  // getDB,
};
