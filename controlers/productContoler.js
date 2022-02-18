const pool = require("../db/connectDb");
const CustomError = require("../error/customError");

const getAllProducts = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM products LEFT JOIN (SELECT product_id, count(product_id), TRUNC(AVG(rating), 1) AS AVG FROM reviews GROUP BY product_id) reviews ON products.id = reviews.product_id"
  );
  if (result.rows.length === 0) {
    throw new CustomError("No product", 404, { products: `No products!` });
  }
  res.status(200).json({
    msg: "get all produckts",
    result: result.rows.length,
    products: result.rows,
  });
};

const createProduct = async (req, res) => {
  const { user } = req;
  const { name, price, description, image, stock } = req.body;

  const result = await pool.query(
    "INSERT INTO products(name, price, description, image, creator_id, stock) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
    [name, price, description, image, user.id, stock]
  );

  res.status(200).json({ msg: "create product", product: result.rows[0] });
};

const getOneProduct = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "SELECT * FROM products LEFT JOIN (SELECT product_id, count(product_id), TRUNC(AVG(rating), 1) AS AVG FROM reviews GROUP BY product_id) reviews ON products.id = reviews.product_id WHERE id=$1",
    [id]
  );

  const reviewResult = await pool.query(
    "SELECT * FROM reviews WHERE product_id=$1",
    [id]
  );
  console.log(reviewResult.rows);
  if (result.rows.length === 0) {
    throw new CustomError("No product", 404, {
      product: `Not Found product with id : ${id}`,
    });
  }
  res.status(200).json({
    msg: `get product id: ${id}`,
    product: result.rows[0],
    reviews: reviewResult.rows,
  });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const data = await pool.query("SELECT * FROM products WHERE id=$1", [id]);

  if (data.rows.length === 0) {
    throw new CustomError("Delete failed", 404, {
      product: `No product with id : ${id}`,
    });
  }

  if (data.rows[0].creator_id !== req.user.id) {
    throw new CustomError("Delete failed", 404, {
      product: "You are not have allow delete product which not created by you",
    });
  }

  const result = await pool.query(
    "DELETE FROM products WHERE id=$1 RETURNING *",
    [id]
  );

  res
    .status(200)
    .json({ msg: `delete product id: ${id}`, product: result.rows[0] });
};

const updateProduct = async (req, res) => {
  const { name, price, image, description, stock } = req.body;
  const id = req.params.id;

  const data = await pool.query("SELECT * FROM products WHERE id=$1", [id]);

  if (data.rows.length === 0) {
    throw new CustomError("Update failed", 404, {
      product: `No product with id : ${id}`,
    });
  }

  if (data.rows[0].creator_id !== req.user.id) {
    throw new CustomError("Update failed", 404, {
      product: "You are not allowed update product which not created by you",
    });
  }

  const result = await pool.query(
    "UPDATE products SET name=COALESCE($1, name), price=COALESCE($2, price), image=COALESCE($3, image), description=COALESCE($4, description), stock=COALESCE($6, stock) WHERE id=$5 RETURNING *",
    [name, price, image, description, id, stock]
  );
  if (result.rows.length === 0) {
    throw new CustomError("Update failed", 404, {
      product: `No product with id : ${id}`,
    });
  }

  res
    .status(200)
    .json({ msg: `update product id: ${id}`, product: result.rows[0] });
};

const createReview = async (req, res) => {
  const { name, id } = req.user;
  const { id: product_id } = req.params;
  const { content, rating } = req.body;

  const result = await pool.query(
    "INSERT INTO reviews (content, creator, creator_id, product_id, rating) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [content, name, id, product_id, rating]
  );

  res.status(200).json({ msg: `create review`, review: result.rows[0] });
};

const getUserProduct = async (req, res) => {
  const { id: user_id } = req.user;
  const result = await pool.query(
    "SELECT * FROM products LEFT JOIN (SELECT product_id, TRUNC(AVG(rating), 1) AS avg, count(product_id) FROM reviews GROUP BY product_id) reviews ON products.id = reviews.product_id WHERE creator_id=$1",
    [user_id]
  );
  console.log(result.rows);

  res.status(200).json({ msg: `get user products`, products: result.rows });
};

module.exports = {
  getAllProducts,
  createProduct,
  getOneProduct,
  deleteProduct,
  updateProduct,
  createReview,
  getUserProduct,
};
