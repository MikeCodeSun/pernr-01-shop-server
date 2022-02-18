const CustomError = require("../error/customError");

const error_Handler = async (err, req, res, next) => {
  console.log(err.stack, err.message);
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .json({ msg: err.message, stack: err.stack });
  }
  res.status(500).json({ msg: "something went wrong" });
};

module.exports = error_Handler;
