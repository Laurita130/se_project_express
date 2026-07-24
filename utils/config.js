const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wtwr_db";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

module.exports = {
  MONGODB_URI,
  JWT_SECRET,
};
