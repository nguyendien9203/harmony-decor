const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Discount = require("../models/discount.model");
const { formatOrder } = require("../utils/format");
const User = require("../models/user.model");

// Create a new order (user)
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      total,
      discountCode,
      discountAmount,
      totalAmount,
      paymentMethod,
      note,
    } = req.body;
    const userId = req.user.userId;

    // Validate items
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Không có sản phẩm trong đơn hàng" });
    }

    // Validate shippingAddress
    if (!shippingAddress) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin địa chỉ giao hàng" });
    }

    // Validate discountCode is provided
    if (discountCode) {
      const discount = await Discount.findOne({
        code: discountCode.toUpperCase(),
        isActive: true,
      });
      if (!discount) {
        return res.status(400).json({ message: "Mã giảm giá không hợp lệ" });
      }

      // Update usedCount
      discount.usedCount += 1;
      await discount.save();
    }

    // Validate product item
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
        }
        if (item.quantity <= 0) {
          throw new Error(`Số lượng sản phẩm ${product.name} phải lớn hơn 0`);
        }
        return {
          productId: item.productId,
          price: product.price,
          quantity: item.quantity,
        };
      })
    );

    const newOrder = new Order({
      userId,
      items: orderItems,
      shippingAddress,
      total,
      discountCode: discountCode ? discountCode.toUpperCase() : null,
      discountAmount: discountAmount || 0,
      totalAmount,
      paymentMethod,
      note,
    });

    // Save the order
    await newOrder.save({});

    const populatedOrder = await Order.findById(newOrder._id)
      .populate("items.productId", "name price images")
      .exec();

    res.status(201).json({
      status: 201,
      message: "Tạo đơn hàng thành công",
      order: formatOrder(populatedOrder),
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Get orders by user (user)
exports.getOrdersByUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const userId = req.user.userId;
    const { status } = req.query;
    const limit = 2;

    console.log("Status filter:", status);

    let query = {};

    if (status && status !== "ALL") {
      query.orderStatus = status;
    }

    const totalOrders = await Order.countDocuments({ userId, ...query });
    const totalPages = Math.ceil(totalOrders / limit);
    const orders = await Order.find({ userId, ...query })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("items.productId", "name price images")
      .exec();

    res.status(200).json({
      message: "Lấy đơn hàng của bạn thành công",
      orders: orders.map(formatOrder),
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả đơn hàng (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { search, startDate, endDate } = req.query;
    let query = {};

    // Filter theo khoảng ngày tạo
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Search theo note hoặc tên khách hàng
    if (search) {
      // Tìm userId theo tên khách hàng
      const users = await User.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");
      const userIds = users.map((u) => u._id);

      // Tìm theo note hoặc userId
      query.$or = [
        { note: { $regex: search, $options: "i" } },
        { userId: { $in: userIds } },
      ];
    }

    const orders = await Order.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ message: "Lấy danh sách đơn hàng thành công", orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách đơn hàng", error: error.message });
  }
};

// Lấy chi tiết đơn hàng theo ID (user hoặc admin)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("items.productId", "name price");
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    // if (
    //   req.user.role !== "admin" &&
    //   order.userId._id.toString() !== req.user._id.toString()
    // ) {
    //   return res
    //     .status(403)
    //     .json({ message: "Bạn không có quyền truy cập đơn hàng này" });
    // }
    res.json({ message: "Lấy chi tiết đơn hàng thành công", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi lấy chi tiết đơn hàng", error: error.message });
  }
};

// Cập nhật trạng thái đơn hàng + thanh toán (admin + user)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === "DELIVERED") {
        order.paymentStatus = "PAID";
        order.deliveredAt = Date.now();
        order.paidAt = Date.now();
      } else if (orderStatus === "CANCELLED") {
        order.paymentStatus = "FAILED";
      }
    }

    await order.save();
    res.json({ message: "Cập nhật trạng thái đơn hàng thành công", order });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi cập nhật trạng thái đơn hàng",
      error: error.message,
    });
  }
};

// Hủy đơn hàng (user)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (order.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền hủy đơn hàng này" });
    }

    if (order.orderStatus !== "PENDING") {
      return res
        .status(400)
        .json({ message: "Đơn hàng không thể hủy ở trạng thái hiện tại" });
    }

    order.orderStatus = "CANCELLED";
    await order.save();
    res.json({ message: "Hủy đơn hàng thành công", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi hủy đơn hàng", error: error.message });
  }
};

// Xóa đơn hàng (admin)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json({ message: "Xóa đơn hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa đơn hàng", error: error.message });
  }
};
