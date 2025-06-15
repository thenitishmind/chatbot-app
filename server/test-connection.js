require('dotenv').config();
const { connectMongoDB } = require('./config/database');

async function testConnection() {
  try {
    const client = await connectMongoDB();
    console.log('Connection test completed successfully!');
    
    // List all databases
    const dbs = await client.db().admin().listDatabases();
    console.log('Available databases:');
    dbs.databases.forEach(db => {
      console.log(` - ${db.name}`);
    });

    await client.close();
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testConnection(); 