const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 3;
  let retryCount = 0;

  const attemptConnection = async () => {
    try {
      console.log(`📡 [DB] Attempting MongoDB connection (attempt ${retryCount + 1}/${maxRetries})...`);
      console.log(`📡 [DB] URI: ${process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:[^:]*@/, ':****@') : 'NOT SET'}`);

      const conn = await mongoose.connect(process.env.MONGO_URI || '', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 10000,
        retryWrites: true,
        w: 'majority',
      });

      console.log(`✅ [DB] MongoDB connected successfully!`);
      console.log(`✅ [DB] Host: ${conn.connection.host}`);
      console.log(`✅ [DB] Database: ${conn.connection.name}`);
      return true;
    } catch (error) {
      retryCount++;
      console.error(`❌ [DB] Connection failed: ${error.message}`);

      if (error.code === 'ENOTFOUND') {
        console.error(`❌ [DB] DNS resolution failed - check MONGO_URI hostname`);
      } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
        console.error(`❌ [DB] Connection timeout/refused - MongoDB server may be down`);
        console.error(`❌ [DB] Ensure MongoDB Atlas cluster is running and IP whitelist allows your connection`);
      } else if (error.message.includes('authentication failed')) {
        console.error(`❌ [DB] Authentication failed - check username/password in MONGO_URI`);
      }

      if (retryCount < maxRetries) {
        console.log(`⏳ [DB] Retrying in 3 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return attemptConnection();
      } else {
        console.error(`❌ [DB] Failed to connect after ${maxRetries} attempts`);
        console.warn(`⚠️  [DB] Starting server anyway - some features may be unavailable`);
        return false;
      }
    }
  };

  return attemptConnection();
};

module.exports = connectDB;
