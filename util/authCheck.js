const jwt = require("jsonwebtoken");
const CustomError = require("../error/customError");
require("dotenv").config();

const authCheck = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomError("No headers authorization", 401, {
      header: "Not have authorization header",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new CustomError("Not Valid Token", 401, { token: "token not right" });
  }
};

module.exports = authCheck;
