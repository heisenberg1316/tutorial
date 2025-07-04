const mongoose = require("mongoose");
const db = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("✅ DB Connected Successfully");
    }
    catch (error) {
        console.error("❌ DB Connection Failed");
        console.error(error);
        process.exit(1); // Exit the process with failure
    }
}

module.exports = db;