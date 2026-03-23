const mongoose = require('mongoose');
require('dotenv').config();

console.log('--- DB CONNECTION DEBUGGER ---');
console.log('Timestamp:', new Date().toISOString());
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);

if (process.env.MONGO_URI) {
    const maskedUri = process.env.MONGO_URI.replace(/([^/]+):([^@]+)@/, '$1:****@');
    console.log('Target URI:', maskedUri);
}

mongoose.connection.on('connecting', () => console.log('Mongoose: connecting...'));
mongoose.connection.on('connected', () => console.log('Mongoose: connected to db'));
mongoose.connection.on('error', (err) => console.log('Mongoose: error:', err.message));
mongoose.connection.on('disconnected', () => console.log('Mongoose: disconnected'));

const testConnection = async () => {
  try {
    console.log('Attempting mongoose.connect()...');
    const start = Date.now();
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // Fail fast (5s)
    });
    console.log('Success! Connection established in', Date.now() - start, 'ms');
    process.exit(0);
  } catch (err) {
    console.error('CRITICAL FAILURE:', err.message);
    console.error('Error Code:', err.code);
    if (err.message.includes('IP not whitelisted') || err.message.includes('Could not connect to any servers')) {
        console.log('\n--- DIAGNOSIS: IP WHITELIST ISSUE ---');
        console.log('Your Railway server is being blocked by MongoDB Atlas.');
        console.log('ACTION: Go to MongoDB Atlas -> Network Access -> Add IP Address -> Select "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0).');
    }
    process.exit(1);
  }
};

testConnection();
