const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const upload = require("../config/multer");


router.post("/",upload.single("images"),productController.createProduct);
router.put("/:id",upload.single('images'),productController.updateProduct);

router.get("/", productController.getProducts);

router.get("/:id", productController.getProductById);

router.delete("/:id", productController.deleteProduct);

module.exports = router; 