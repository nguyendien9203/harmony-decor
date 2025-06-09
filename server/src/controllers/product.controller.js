const Product = require("../models/product.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      status,
      stock,
      ratings,
      createdBy,
      updatedBy,
    } = req.body;
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
        resource_type: "image",
        transformation: [
          { width: 300, height: 300, crop: "fill", gravity: "face" },
          { quality: "auto" },
        ],
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    const product = new Product({
      name,
      description,
      price,
      status,
      stock,
      ratings,
      createdBy,
      updatedBy,
      images: imageUrl,
    });
    await product.save();
    res.status(201).json({
      success: true,
      message: "Tạo sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo sản phẩm",
      error: error.message,
    });
  }
};

// Get all products with search, filter, sort, pagination, status
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const { search = "", status, sort } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (status) query.status = status;
    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    else if (sort === "desc") sortOption.price = -1;
    else sortOption.createdAt = -1;
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: { currentPage: page, totalPages, totalProducts, limit },
      },
      message: "Lấy danh sách sản phẩm thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sản phẩm",
      error: error.message,
    });
  }
};

// Get product by slug
exports.getProductBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const product = await Product.findOne({ slug: slug });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });

    res.status(200).json({
      success: true,
      data: product,
      message: "Lấy chi tiết sản phẩm thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    res.status(200).json({
      success: true,
      data: product,
      message: "Lấy chi tiết sản phẩm thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết sản phẩm",
      error: error.message,
    });
  }
};

// Update product (ngắn gọn)
exports.updateProduct = async (req, res) => {
  try {
    const updateFields = { ...req.body };
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
        resource_type: "image",
        transformation: [
          { width: 300, height: 300, crop: "fill", gravity: "face" },
          { quality: "auto" },
        ],
      });
      updateFields.images = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    res
      .status(200)
      .json({ success: true, message: "Cập nhật sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật sản phẩm",
      error: error.message,
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    res.status(200).json({ success: true, message: "Xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa sản phẩm",
      error: error.message,
    });
  }
};
