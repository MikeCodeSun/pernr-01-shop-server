const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CustomError = require("../error/customError");
const { registerValidator, loginValidator } = require("../util/validator");
const pool = require("../db/connectDb");
require("dotenv").config();

const genJwt = (data) => {
  return jwt.sign(
    { id: data.rows[0].id, name: data.rows[0].name, emai: data.rows[0].email },
    process.env.SECRET,
    { expiresIn: "1d" }
  );
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { valid, error } = loginValidator(email, password);
  if (!valid) {
    throw new CustomError("Value Empty", 406, error);
  }

  const data = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  if (data.rows.length === 0) {
    throw new CustomError("User not exist", 400, {
      user: "user not exist",
    });
  }

  const isValid = await bcryptjs.compare(password, data.rows[0].password);

  if (!isValid) {
    throw new CustomError("Wrong password", 400, {
      password: "wrong password",
    });
  }

  const token = genJwt(data);

  res.status(200).json({ msg: "success login", user: data.rows[0], token });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const { valid, error } = registerValidator(name, email, password);
  if (!valid) {
    throw new CustomError("Empty Value", 400, error);
  }

  const data = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  if (data.rows.length !== 0) {
    throw new CustomError("User already exist", 404, {
      user: "user existed",
    });
  }

  const hashPassword = await bcryptjs.hash(password, 10);
  const newData = await pool.query(
    "INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *",
    [name, email, hashPassword]
  );

  const token = genJwt(newData);

  res
    .status(200)
    .json({ msg: "success register", user: newData.rows[0], token });
};

module.exports = { login, register };
