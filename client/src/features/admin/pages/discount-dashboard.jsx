// ... các import như cũ
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, Select, message, Tag, Descriptions } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import AdminSidebar from "@/components/ui/admin-sidebar";
import { getAllDiscounts, createDiscount, updateDiscount, deleteDiscount } from "@/features/admin/discount-service";
import dayjs from "dayjs";

const DiscountDashboard = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, discount: null });
  const [detailModal, setDetailModal] = useState({ open: false, discount: null });
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [search, setSearch] = useState("");
  const [type, setType] = useState();
  const [isActive, setIsActive] = useState();
  const [dateRange, setDateRange] = useState([null, null]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getAllDiscountsHandler = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (type) params.type = type;
      if (isActive !== undefined) params.isActive = isActive;
      if (dateRange[0]) params.startDate = dayjs(dateRange[0]).startOf("day").toISOString();
      if (dateRange[1]) params.endDate = dayjs(dateRange[1]).endOf("day").toISOString();
      const res = await getAllDiscounts(params);
      setDiscounts(res);
    } catch (err) {
      message.error("Lỗi khi lấy danh sách discount");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllDiscountsHandler();
    // eslint-disable-next-line
  }, [search, type, isActive, dateRange]);

  const handleAdd = async (values) => {
    try {
      await createDiscount(values);
      message.success("Thêm mã giảm giá thành công!");
      setAddModal(false);
      form.resetFields();
      getAllDiscountsHandler();
    } catch (err) {
      message.error("Thêm mã giảm giá thất bại!");
    }
  };

  const handleEdit = async (values) => {
    try {
      await updateDiscount(editModal.discount._id, values);
      message.success("Cập nhật mã giảm giá thành công!");
      setEditModal({ open: false, discount: null });
      editForm.resetFields();
      getAllDiscountsHandler();
    } catch (err) {
      message.error("Cập nhật mã giảm giá thất bại!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDiscount(id);
      message.success("Xoá mã giảm giá thành công!");
      getAllDiscountsHandler();
    } catch (err) {
      message.error("Xoá mã giảm giá thất bại!");
    }
  };

  const handleOpenEditModal = (discount) => {
    setEditModal({ open: true, discount });
    setTimeout(() => {
      editForm.resetFields();
      editForm.setFieldsValue({
        code: discount.code,
        type: discount.type,
        amount: discount.amount,
        minOrderValue: discount.minOrderValue,
        usageLimit: discount.usageLimit,
        usedCount: discount.usedCount,
        startDate: discount.startDate ? dayjs(discount.startDate) : null,
        endDate: discount.endDate ? dayjs(discount.endDate) : null,
        isActive: discount.isActive,
      });
    }, 0);
  };

  const columns = [
    {
      title: "Mã giảm giá",
      dataIndex: "code",
      key: "code",
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    { title: "Loại", dataIndex: "type", key: "type" },
    { title: "Giá trị", dataIndex: "amount", key: "amount" },
    { title: "Đơn tối thiểu", dataIndex: "minOrderValue", key: "minOrderValue" },
    { title: "Giới hạn", dataIndex: "usageLimit", key: "usageLimit" },
    { title: "Đã dùng", dataIndex: "usedCount", key: "usedCount" },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => date ? new Date(date).toLocaleDateString() : "",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => date ? new Date(date).toLocaleDateString() : "",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (active) => <Tag color={active ? "green" : "red"}>{active ? "Active" : "Inactive"}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<EyeOutlined />} onClick={() => setDetailModal({ open: true, discount: record })}>Chi tiết</Button>
          <Button icon={<EditOutlined />} type="primary" onClick={() => handleOpenEditModal(record)}>Cập nhật</Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar selectedKey="discount" />
      <div style={{ flex: 1, padding: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Quản lý mã giảm giá</h2>
        <Button type="primary" onClick={() => setAddModal(true)} style={{ marginBottom: 16 }}>
          Thêm mã giảm giá
        </Button>

        {/* Bộ lọc */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Input.Search
            placeholder="Tìm kiếm mã giảm giá"
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={(v) => setSearch(v)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Loại"
            allowClear
            value={type}
            onChange={(v) => setType(v)}
            style={{ width: 120 }}
          >
            <Select.Option value="PERCENT">PERCENT</Select.Option>
            <Select.Option value="FIXED">FIXED</Select.Option>
          </Select>
          <Select
            placeholder="Trạng thái"
            allowClear
            value={isActive}
            onChange={(v) => setIsActive(v)}
            style={{ width: 120 }}
          >
            <Select.Option value={true}>Active</Select.Option>
            <Select.Option value={false}>Inactive</Select.Option>
          </Select>
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
          dataSource={discounts.map((d) => ({ ...d, key: d._id }))}
          loading={loading}
        />

        {/* Modal Thêm */}
        <Modal open={addModal} title="Thêm mã giảm giá" onCancel={() => setAddModal(false)} footer={null}>
          <Form form={form} layout="vertical" onFinish={handleAdd}>
            <Form.Item name="code" label="Mã giảm giá" rules={[{ required: true, message: "Nhập mã giảm giá" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="type" label="Loại" rules={[{ required: true, message: "Chọn loại" }]}>
              <Select>
                <Select.Option value="PERCENT">PERCENT</Select.Option>
                <Select.Option value="FIXED">FIXED</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="amount" label="Giá trị" rules={[{ required: true, message: "Nhập giá trị" }]}>
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="minOrderValue" label="Đơn tối thiểu">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="usageLimit" label="Giới hạn sử dụng">
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true, message: "Chọn ngày kết thúc" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="isActive" label="Kích hoạt" initialValue={true}>
              <Select>
                <Select.Option value={true}>Active</Select.Option>
                <Select.Option value={false}>Inactive</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Thêm
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal Cập nhật */}
        <Modal
          open={editModal.open}
          title="Cập nhật mã giảm giá"
          onCancel={() => setEditModal({ open: false, discount: null })}
          footer={null}
        >
          <Form form={editForm} layout="vertical" onFinish={handleEdit}>
            <Form.Item name="code" label="Mã giảm giá" rules={[{ required: true, message: "Nhập mã giảm giá" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="type" label="Loại" rules={[{ required: true, message: "Chọn loại" }]}>
              <Select>
                <Select.Option value="PERCENT">PERCENT</Select.Option>
                <Select.Option value="FIXED">FIXED</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="amount" label="Giá trị" rules={[{ required: true, message: "Nhập giá trị" }]}>
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="minOrderValue" label="Đơn tối thiểu">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="usageLimit" label="Giới hạn sử dụng">
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true, message: "Chọn ngày kết thúc" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="isActive" label="Kích hoạt" initialValue={true}>
              <Select>
                <Select.Option value={true}>Active</Select.Option>
                <Select.Option value={false}>Inactive</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal Chi tiết */}
        <Modal
          open={detailModal.open}
          title="Chi tiết mã giảm giá"
          onCancel={() => setDetailModal({ open: false, discount: null })}
          footer={null}
        >
          {detailModal.discount && (
            <Descriptions bordered column={1} size="small" title="Chi tiết mã giảm giá">
              <Descriptions.Item label="Mã giảm giá">{detailModal.discount.code}</Descriptions.Item>
              <Descriptions.Item label="Loại">{detailModal.discount.type}</Descriptions.Item>
              <Descriptions.Item label="Giá trị">{detailModal.discount.amount}</Descriptions.Item>
              <Descriptions.Item label="Đơn tối thiểu">{detailModal.discount.minOrderValue}</Descriptions.Item>
              <Descriptions.Item label="Giới hạn sử dụng">{detailModal.discount.usageLimit}</Descriptions.Item>
              <Descriptions.Item label="Đã dùng">{detailModal.discount.usedCount}</Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">{new Date(detailModal.discount.startDate).toLocaleDateString()}</Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc">{new Date(detailModal.discount.endDate).toLocaleDateString()}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">{detailModal.discount.isActive ? "Active" : "Inactive"}</Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default DiscountDashboard;
