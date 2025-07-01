const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const upload = require("../config/multer");
const {
  authenticateToken,
  requireRole,
} = require("../middlewares/auth.middleware");

router.post(
  "/",
  authenticateToken,
  requireRole(["ADMIN"]),
  upload.single("images"),
  productController.createProduct
);
router.put(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  upload.single("images"),
  productController.updateProduct
);

router.get("/", productController.getProducts);

router.get("/:id", productController.getProductById);
router.get("/slug/:slug", productController.getProductBySlug);

router.delete(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  productController.deleteProduct
);

router.post(
  "/:id/reviews",
  authenticateToken,
  requireRole(["USER"]),
  productController.addReview
);

router.put(
  "/:productId/reviews/:reviewId",
  authenticateToken,
  requireRole(["USER"]),
  productController.updateReview
);

module.exports = router;
