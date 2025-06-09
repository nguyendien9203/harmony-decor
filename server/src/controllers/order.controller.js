const Order = require("../models/order.model");
const Product = require("../models/product.model"); // Cần model Product để lấy giá

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, note } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Danh sách sản phẩm không hợp lệ" });
    }
    if (!shippingAddress) {
      return res.status(400).json({ message: "Thiếu thông tin địa chỉ giao hàng" });
    }
    if (!paymentMethod) {
      return res.status(400).json({ message: "Thiếu phương thức thanh toán" });
    }

    // Lấy giá từng sản phẩm từ DB và thêm vào item
    const detailedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Sản phẩm với id ${item.productId} không tồn tại`);
        }
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price, // lấy giá từ product
        };
      })
    );

    const order = new Order({
      userId: req.user._id,
      items: detailedItems,
      shippingAddress,
      paymentMethod,
      note,
      // totalAmount không cần truyền vì đã tính trong pre save
    });

    await order.save();

    res.status(201).json({ message: "Đặt hàng thành công!", order });
  } catch (error) {
    res.status(500).json({ message: "Lỗi tạo đơn hàng", error: error.message, req.user });

  }
};

// Lấy tất cả đơn hàng (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json({ message: "Lấy danh sách đơn hàng thành công", orders });
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách đơn hàng", error: error.message });
  }
};

// Lấy đơn hàng theo user (user)
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ message: "Lấy đơn hàng của bạn thành công", orders });
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy đơn hàng của bạn", error: error.message });
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
    if (req.user.role !== "admin" && order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập đơn hàng này" });
    }
    res.json({ message: "Lấy chi tiết đơn hàng thành công", order });
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy chi tiết đơn hàng", error: error.message });
  }
};

// Cập nhật trạng thái đơn hàng + thanh toán (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
      if (paymentStatus === "PAID") order.paidAt = Date.now();
    }

    if (orderStatus === "DELIVERED") order.deliveredAt = Date.now();

    await order.save();
    res.json({ message: "Cập nhật trạng thái đơn hàng thành công", order });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật trạng thái đơn hàng", error: error.message });
  }
};

// Hủy đơn hàng (user)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Bạn không có quyền hủy đơn hàng này" });
    }

    if (order.orderStatus !== "PENDING") {
      return res.status(400).json({ message: "Đơn hàng không thể hủy ở trạng thái hiện tại" });
    }

    order.orderStatus = "CANCELLED";
    await order.save();
    res.json({ message: "Hủy đơn hàng thành công", order });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi hủy đơn hàng", error: error.message });
  }
};

// Xóa đơn hàng (admin)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json({ message: "Xóa đơn hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa đơn hàng", error: error.message });
  }
};
