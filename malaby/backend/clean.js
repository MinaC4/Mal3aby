const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const Pitch = require('./models/Pitch');

async function clean() {
  try {
    await Pitch.deleteMany({});
    console.log("✅ تم حذف كل الملاعب القديمة بنجاح");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

clean();
