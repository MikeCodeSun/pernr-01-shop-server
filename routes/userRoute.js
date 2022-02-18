const { getUserProduct } = require("../controlers/productContoler");
const { login, register } = require("../controlers/userControler");
const authCheck = require("../util/authCheck");

const router = require("express").Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/product").get(authCheck, getUserProduct);

module.exports = router;
