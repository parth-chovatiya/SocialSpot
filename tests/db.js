const { MongoClient } = require("mongodb");

const connectionURL = process.env.MongoDB_Connection_URL;
const databaseName = process.env.DATABASE;

const connect = async () => {
  console.log(databaseName);
  const client = new MongoClient(connectionURL);
  await client.connect();
  const db = client.db(databaseName);
  const collectionsInfo = await db.listCollections().toArray();

  console.log(collectionsInfo);
  const collections = [];
  for (let collection of collectionsInfo) {
    collections.push(collection.name);
  }
  console.log(collections);
};

module.exports = { connect };
