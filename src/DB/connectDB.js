const { MongoClient } = require("mongodb");

const connectionURL = process.env.MongoDB_Connection_URL;
const databaseName = "SocialSpot";

let _db;
module.exports = {
  // Connect with MongoDB sever
  connectDB: async function (callback) {
    try {
      const client = new MongoClient(connectionURL);
      await client.connect();
      _db = client.db(databaseName);
      return callback(null, _db);
    } catch (error) {
      return callback(error, null);
    }
  },

  getDB: function () {
    return _db;
  },
};
