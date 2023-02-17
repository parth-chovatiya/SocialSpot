const { MongoClient } = require("mongodb");

const connectionURL = process.env.MONGODB_CONNECTION_URL;
const databaseName = process.env.DATABASE;

const getDBInstance = async () => {
  const client = await MongoClient.connect(connectionURL);

  const dbInstance = client.db(databaseName);
  return dbInstance;
};

let db;
const getDB = async () => {
  if (!db) {
    db = getDBInstance();
  }
  return db;
};

module.exports = {
  getDB,
};
