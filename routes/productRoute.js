const router = require("express").Router();
const authCheck = require("../util/authCheck");
const {
  getAllProducts,
  createProduct,
  getOneProduct,
  deleteProduct,
  updateProduct,
  createReview,
} = require("../controlers/productContoler");

router.route("/").get(getAllProducts).post(authCheck, createProduct);

router
  .route("/:id")
  .get(getOneProduct)
  .delete(authCheck, deleteProduct)
  .patch(authCheck, updateProduct);

router.route("/:id/review").post(authCheck, createReview);

module.exports = router;
