import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Table, Menu, Button, Modal, Descriptions, Image, message, Form, Input, InputNumber, Select, Upload } from "antd";
import { getAllProducts, addProduct, updateProduct } from "@/features/admin/product-service";
import { UserOutlined, ShoppingOutlined, ShoppingCartOutlined, DollarOutlined, LogoutOutlined, EyeOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/ui/admin-sidebar";

const AdminDashboard = () => {
  // Mock data - replace with actual data from your backend
  const stats = {
    totalUsers: 1234,
    totalOrders: 567,
    totalProducts: 89,
    totalRevenue: 45678,
    monthlyGrowth: 12.5,
    activeUsers: 789
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [detailModal, setDetailModal] = useState({ open: false, product: null });
  const [editModal, setEditModal] = useState({ open: false, product: null });
  const [editForm] = Form.useForm();
  const [editFileList, setEditFileList] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 6, total: 0 });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState();
  const [addModal, setAddModal] = useState(false);
  const [addForm] = Form.useForm();
  const [addFileList, setAddFileList] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [adding, setAdding] = useState(false);

  const fetchProducts = async (page = 1, searchValue = search, sortValue = sort) => {
    setLoading(true);
    try {
      const params = { page, limit: 6 };
      if (searchValue) params.search = searchValue;
      if (sortValue) params.sort = sortValue;
      const response = await getAllProducts(params);
      const products = response.data.products;
      const total = response.data.pagination?.totalProducts || response.data.pagination?.total || 0;
      if (products.length === 0 && page > 1) {
        fetchProducts(1, searchValue, sortValue);
        return;
      }
      setProducts(products);
      setPagination({
        current: page,
        pageSize: 6,
        total,
      });
    } catch (error) {
      message.error("Lỗi khi lấy danh sách sản phẩm");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
    // eslint-disable-next-line
  }, [search, sort]);

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (img) => (
        <Image src={Array.isArray(img) ? img[0] : img} width={60} height={60} style={{ objectFit: "cover", borderRadius: 8 }} />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => stock ?? 0,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<EyeOutlined />} onClick={() => setDetailModal({ open: true, product: record })}>
            Chi tiết
          </Button>
          <Button icon={<EditOutlined />} type="primary" onClick={() => {
            setEditModal({ open: true, product: record });
            editForm.setFieldsValue({
              name: record.name,
              price: record.price,
              status: record.status,
              description: record.description,
              stock: record.stock,
            });
            setEditFileList(
              record.images
                ? [
                    {
                      uid: '-1',
                      name: 'Ảnh hiện tại',
                      status: 'done',
                      url: Array.isArray(record.images) ? record.images[0] : record.images,
                    },
                  ]
                : []
            );
          }}>
            Cập nhật
          </Button>
        </div>
      ),
    },
  ];

  // Xử lý cập nhật sản phẩm
  const handleUpdate = async (values) => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("status", values.status);
      formData.append("description", values.description || "");
      formData.append("stock", values.stock);
      if (
        editFileList.length > 0 &&
        editFileList[0].originFileObj
      ) {
        formData.append("images", editFileList[0].originFileObj);
      }
      if (user?._id || user?.userId) {
        formData.append("updatedBy", user._id || user.userId);
      }
      const res = await updateProduct(editModal.product._id || editModal.product.id, formData, true);
      setProducts((prev) =>
        prev.map((p) => {
          if ((p._id || p.id) === (editModal.product._id || editModal.product.id)) {
            return {
              ...p,
              ...values,
              images:
                editFileList.length > 0 && editFileList[0].originFileObj
                  ? URL.createObjectURL(editFileList[0].originFileObj)
                  : p.images,
            };
          }
          return p;
        })
      );
      setEditModal({ open: false, product: null });
      setEditFileList([]);
      message.success("Cập nhật sản phẩm thành công!");
    } catch (error) {
      message.error("Cập nhật thất bại!");
      console.error("Update error:", error);
    } finally {
      setUpdating(false);
    }
  };

  // Xử lý thêm sản phẩm
  const handleAdd = async (values) => {
    if (addFileList.length === 0 || !addFileList[0].originFileObj) {
      message.error("Vui lòng chọn ảnh sản phẩm!");
      return;
    }
    setAdding(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("status", values.status);
      formData.append("description", values.description || "");
      formData.append("stock", values.stock);
      formData.append("images", addFileList[0].originFileObj);
      if (user?._id || user?.userId) {
        formData.append("createdBy", user._id || user.userId);
        formData.append("updatedBy", user._id || user.userId);
      }
      await addProduct(formData, true);
      message.success("Thêm sản phẩm thành công!");
      setAddModal(false);
      setAddFileList([]);
      addForm.resetFields();
      fetchProducts(1);
    } catch (error) {
      message.error("Thêm sản phẩm thất bại!");
      console.error("Add product error:", error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar selectedKey="product" />
      <div style={{ flex: 1, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 16 }}>
          <h2 style={{ fontSize: 24, fontWeight: 600 }}>Danh sách sản phẩm</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <Input.Search
              placeholder="Tìm kiếm tên sản phẩm"
              allowClear
              value={search}
              onChange={e => setSearch(e.target.value)}
              onSearch={v => setSearch(v)}
              style={{ width: 200 }}
            />
            <Select
              placeholder="Sắp xếp giá"
              allowClear
              value={sort}
              onChange={v => setSort(v)}
              style={{ width: 120 }}
            >
              <Select.Option value="desc">Cao → Thấp</Select.Option>
              <Select.Option value="asc">Thấp → Cao</Select.Option>
            </Select>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModal(true)}>
            Thêm sản phẩm
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={products.map((p) => ({ ...p, key: p._id || p.id }))}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page) => fetchProducts(page),
            showSizeChanger: false,
          }}
        />
      </div>
      {/* Modal Chi tiết sản phẩm */}
      <Modal
        open={detailModal.open}
        title="Chi tiết sản phẩm"
        onCancel={() => setDetailModal({ open: false, product: null })}
        footer={null}
      >
        {detailModal.product && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Tên sản phẩm">{detailModal.product.name}</Descriptions.Item>
            <Descriptions.Item label="Giá">{detailModal.product.price?.toLocaleString()} VND</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{detailModal.product.status}</Descriptions.Item>
            <Descriptions.Item label="Tồn kho">{detailModal.product.stock}</Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{new Date(detailModal.product.createdAt).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Mô tả">{detailModal.product.description}</Descriptions.Item>
            <Descriptions.Item label="Hình ảnh">
              <Image src={Array.isArray(detailModal.product.images) ? detailModal.product.images[0] : detailModal.product.images} width={120} />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
      {/* Modal Cập nhật sản phẩm */}
      <Modal
        open={editModal.open}
        title="Cập nhật sản phẩm"
        onCancel={() => setEditModal({ open: false, product: null })}
        footer={null}
      >
        {editModal.product && (
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleUpdate}
          >
            <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Giá" rules={[{ required: true, message: "Vui lòng nhập giá" }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Chọn trạng thái" }]}>
              <Select>
                <Select.Option value="ACTIVE">ACTIVE</Select.Option>
                <Select.Option value="INACTIVE">INACTIVE</Select.Option>
                <Select.Option value="OUT_OF_STOCK">OUT_OF_STOCK</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="stock" label="Số lượng tồn kho" rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho" }]}> 
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Ảnh sản phẩm">
              <Upload
                fileList={editFileList}
                beforeUpload={() => false}
                maxCount={1}
                onChange={({ fileList }) => setEditFileList(fileList)}
                listType="picture"
              >
                <Button>Chọn ảnh</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={updating}>Cập nhật</Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
      {/* Modal Thêm sản phẩm */}
      <Modal
        open={addModal}
        title="Thêm sản phẩm mới"
        onCancel={() => { setAddModal(false); setAddFileList([]); addForm.resetFields(); }}
        footer={null}
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={handleAdd}
        >
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true, message: "Vui lòng nhập giá" }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Chọn trạng thái" }]}> 
            <Select>
              <Select.Option value="ACTIVE">ACTIVE</Select.Option>
              <Select.Option value="INACTIVE">INACTIVE</Select.Option>
              <Select.Option value="OUT_OF_STOCK">OUT_OF_STOCK</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="stock" label="Số lượng tồn kho" rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho" }]}> 
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Ảnh sản phẩm">
            <Upload
              fileList={addFileList}
              beforeUpload={() => false}
              maxCount={1}
              onChange={({ fileList }) => setAddFileList(fileList)}
              listType="picture"
            >
              <Button>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={adding}>Thêm sản phẩm</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard; 