import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Descriptions, Tag, message, Select, Input, Menu, DatePicker, Form } from "antd";
import { ShoppingOutlined, ShoppingCartOutlined, DollarOutlined, UserOutlined, LogoutOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import { getAllOrders, updateOrderStatus, deleteOrder, getOrderById } from "@/features/admin/order-service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import AdminSidebar from "@/components/ui/admin-sidebar";
import dayjs from "dayjs";

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [detailModal, setDetailModal] = useState({ open: false, order: null });
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [editModal, setEditModal] = useState({ open: false, order: null });
  const [editForm] = Form.useForm();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchOrders = async (page = 1, searchValue = search, dateValue = dateRange) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (searchValue) params.search = searchValue;
      if (dateValue[0]) params.startDate = dayjs(dateValue[0]).startOf('day').toISOString();
      if (dateValue[1]) params.endDate = dayjs(dateValue[1]).endOf('day').toISOString();
      const res = await getAllOrders(params);
      setOrders(res);
      setPagination({
        current: page,
        pageSize: 10,
        total: res.pagination?.totalOrders || 0,
      });
    } catch (err) {
      message.error("Lỗi khi lấy danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, search, dateRange);
    // eslint-disable-next-line
  }, [search, dateRange]);

  const handleUpdateStatus = async (orderId, status) => {
    setStatusUpdating(true);
    try {
      await updateOrderStatus(orderId, status);
      message.success("Cập nhật trạng thái thành công!");
      fetchOrders(pagination.current);
    } catch (err) {
      message.error("Cập nhật trạng thái thất bại!");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await deleteOrder(orderId);
      message.success("Xoá đơn hàng thành công!");
      fetchOrders(pagination.current);
    } catch (err) {
      message.error("Xoá đơn hàng thất bại!");
    }
  };

  const handleShowDetail = async (orderId) => {
    setDetailModal({ open: true, order: null });
    try {
      const res = await getOrderById(orderId);
      setDetailModal({ open: true, order: res.order });
    } catch (err) {
      message.error("Không lấy được chi tiết đơn hàng");
      setDetailModal({ open: false, order: null });
    }
  };

  const handleOpenEditModal = (order) => {
    setEditModal({ open: true, order });
    editForm.setFieldsValue({
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      totalAmount: order.totalAmount,
      note: order.note,
    });
  };

  const columns = [
    {
      title: "Khách hàng",
      key: "user",
      render: (_, record) => record.userId?.name || "-",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (total) => `${total?.toLocaleString()} VND`,
    },
    {
      title: "Trạng thái đơn",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => <Tag color={status === "DELIVERED" ? "green" : status === "CANCELLED" ? "red" : "blue"}>{status}</Tag>,
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => <Tag color={status === "PAID" ? "green" : "orange"}>{status}</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Địa chỉ",
      key: "shippingAddress",
      render: (_, record) =>
        record.shippingAddress
          ? `${record.shippingAddress.recipientName}, ${record.shippingAddress.street}`
          : "",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<EyeOutlined />} onClick={() => handleShowDetail(record._id)}>
            Chi tiết
          </Button>
          <Button icon={<EditOutlined />} type="primary" onClick={() => handleOpenEditModal(record)}>
            Cập nhật
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar selectedKey="order" />
      <div style={{ flex: 1, padding: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Quản lý đơn hàng</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Input.Search
            placeholder="Tìm kiếm theo tên khách hàng hoặc ghi chú"
            allowClear
            value={search}
            onChange={e => setSearch(e.target.value)}
            onSearch={v => setSearch(v)}
            style={{ width: 300 }}
          />
          <DatePicker.RangePicker
            value={dateRange}
            onChange={setDateRange}
            style={{ width: 260 }}
            format="DD/MM/YYYY"
            allowClear
          />
        </div>
        <Table
          columns={columns}
          dataSource={orders.map((o) => ({ ...o, key: o._id }))}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page) => fetchOrders(page),
            showSizeChanger: false,
          }}
        />
        <Modal
          open={detailModal.open}
          title="Chi tiết đơn hàng"
          onCancel={() => setDetailModal({ open: false, order: null })}
          footer={null}
        >
          {detailModal.order && (
            <div>
              <Descriptions bordered column={1} size="small" title="Thông tin đơn hàng">
                <Descriptions.Item label="Mã đơn hàng">{detailModal.order._id}</Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">{new Date(detailModal.order.createdAt).toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái đơn hàng">{detailModal.order.orderStatus}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái thanh toán">{detailModal.order.paymentStatus}</Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">{detailModal.order.paymentMethod}</Descriptions.Item>
                <Descriptions.Item label="Tổng tiền trước giảm giá">{detailModal.order.total?.toLocaleString()} VND</Descriptions.Item>
                {detailModal.order.discountCode && (
                  <Descriptions.Item label="Mã giảm giá">{detailModal.order.discountCode} (-{detailModal.order.discountAmount?.toLocaleString()} VND)</Descriptions.Item>
                )}
                <Descriptions.Item label="Tổng phải trả">{detailModal.order.totalAmount?.toLocaleString()} VND</Descriptions.Item>
                {detailModal.order.note && (
                  <Descriptions.Item label="Ghi chú">{detailModal.order.note}</Descriptions.Item>
                )}
              </Descriptions>

              <Descriptions bordered column={1} size="small" title="Thông tin khách hàng" style={{ marginTop: 16 }}>
                <Descriptions.Item label="Tên khách hàng">{detailModal.order.shippingAddress?.recipientName || detailModal.order.userId?.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{detailModal.order.shippingAddress?.email || detailModal.order.userId?.email}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{detailModal.order.shippingAddress?.phone}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ giao hàng">
                  {detailModal.order.shippingAddress?.street}, Phường {detailModal.order.shippingAddress?.ward}, Quận {detailModal.order.shippingAddress?.district}, Tỉnh {detailModal.order.shippingAddress?.province}
                </Descriptions.Item>
              </Descriptions>

              <div style={{ marginTop: 16 }}>
                <h4>Sản phẩm trong đơn</h4>
                {console.log("Order items FE nhận được:", detailModal.order.items)}
                <Table
                  dataSource={detailModal.order.items?.map((item, idx) => ({
                    ...item,
                    key: idx,
                  }))}
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: "Tên sản phẩm",
                      key: "name",
                      render: (_, item) => {
                        if (item.productId && typeof item.productId === "object" && item.productId.name) {
                          return item.productId.name;
                        }
                        if (item.name) {
                          return item.name;
                        }
                        return "Sản phẩm đã xoá";
                      },
                    },
                    {
                      title: "Giá",
                      key: "price",
                      render: (_, item) => {
                        const price = item.price || item.productId?.price;
                        return (price ? price.toLocaleString() : "0") + " VND";
                      },
                    },
                    {
                      title: "Số lượng",
                      dataIndex: "quantity",
                      key: "quantity",
                    },
                    {
                      title: "Thành tiền",
                      key: "total",
                      render: (_, item) => {
                        const price = item.price || item.productId?.price || 0;
                        return (price * item.quantity).toLocaleString() + " VND";
                      },
                    },
                  ]}
                />
              </div>
            </div>
          )}
        </Modal>
        <Modal
          open={editModal.open}
          title="Cập nhật trạng thái đơn hàng"
          onCancel={() => setEditModal({ open: false, order: null })}
          footer={null}
        >
          <Form form={editForm} layout="vertical" onFinish={async (values) => {
            const payload = values.orderStatus === "DELIVERED"
              ? { orderStatus: values.orderStatus, paymentStatus: "PAID" }
              : { orderStatus: values.orderStatus };
            await handleUpdateStatus(editModal.order._id, payload);
            setEditModal({ open: false, order: null });
          }}>
            <Form.Item label="Trạng thái đơn hàng" name="orderStatus" rules={[{ required: true, message: "Chọn trạng thái" }]}> 
              <Select>
                <Select.Option value="PENDING">PENDING</Select.Option>
                <Select.Option value="PROCESSING">PROCESSING</Select.Option>
                <Select.Option value="SHIPPED">SHIPPED</Select.Option>
                <Select.Option value="DELIVERED">DELIVERED</Select.Option>
                <Select.Option value="CANCELLED">CANCELLED</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Trạng thái thanh toán" name="paymentStatus">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Phương thức thanh toán" name="paymentMethod">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Tổng phải trả" name="totalAmount">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <Input disabled />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>Cập nhật</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default OrderDashboard; 