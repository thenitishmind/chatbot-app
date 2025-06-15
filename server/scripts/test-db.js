require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const MONGODB_URI = "mongodb+srv://bizloanchatbot:bizloanchatbot@database.wfemzr4.mongodb.net/bizloan-chatbot?retryWrites=true&w=majority";

async function testConnection() {
  const client = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Successfully connected to MongoDB!");

    // Test the connection
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connection test successful!");

    // List databases
    const dbs = await client.db().admin().listDatabases();
    console.log("\nAvailable databases:");
    dbs.databases.forEach(db => {
      console.log(` - ${db.name}`);
    });

  } catch (error) {
    console.error("Connection test failed:", error);
  } finally {
    await client.close();
    console.log("\nConnection closed.");
  }
}

// Run the test
console.log("Testing MongoDB connection...");
testConnection(); 