const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://bizloanchatbot:bizloanchatbot@database.wfemzr4.mongodb.net/bizloan-chatbot?retryWrites=true&w=majority";

// MongoDB Configuration
const connectMongoDB = async () => {
  try {
    const client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();
    console.log("Connected to MongoDB Atlas!");
    
    // Test the connection
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connection test successful!");

    return client;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

module.exports = {
  connectMongoDB,
  MONGODB_URI
}; 