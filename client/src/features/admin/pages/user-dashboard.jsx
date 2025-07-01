import React, { useEffect, useState } from "react";
import { Table, Menu, Button, Tag, message, Input, Select, Image, Modal, Form, Descriptions } from "antd";
import { getAllUsers, getUserInfo, updateStatus } from "@/features/admin/user-service";
import { UserOutlined, ShoppingOutlined, ShoppingCartOutlined, DollarOutlined, LogoutOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import AdminSidebar from "@/components/ui/admin-sidebar";

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 6, total: 0 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState();
  const [role, setRole] = useState();
  const [sort, setSort] = useState();
  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [editForm] = Form.useForm();
  const [detailModal, setDetailModal] = useState({ open: false, user: null, loading: false });
  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 6,
        search,
        status,
        role,
        sort,
      };
      const res = await getAllUsers(params);
      setUsers(res.data.users || []);
      setPagination({
        current: page,
        pageSize: 6,
        total: res.data.pagination?.totalUsers || 0,
      });
    } catch (err) {
      message.error("Lỗi khi lấy danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
    // eslint-disable-next-line
  }, [search, status, role, sort]);

  const handleShowDetail = async (id) => {
    setDetailModal({ open: true, user: null, loading: true });
    try {
      const user = await getUserInfo(id);
      setDetailModal({ open: true, user, loading: false });
    } catch (err) {
      message.error("Không lấy được thông tin tài khoản");
      setDetailModal({ open: false, user: null, loading: false });
    }
  };

  const handleUpdateStatus = async (values) => {
    if (!editModal.user) return;
    try {
      await updateStatus(editModal.user._id || editModal.user.id, values.status);
      message.success("Cập nhật trạng thái thành công!");
      setEditModal({ open: false, user: null });
      fetchUsers(pagination.current);
    } catch (err) {
      message.error("Cập nhật trạng thái thất bại!");
    }
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) =>
        avatar ? (
          <Image
            src={avatar}
            width={40}
            height={40}
            style={{ objectFit: "cover", borderRadius: "50%" }}
            preview={false}
          />
        ) : (
          <span>N/A</span>
        ),
    },
    {
      title: "Tên tài khoản",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "roles",
      key: "roles",
      render: (roles) => <span>{Array.isArray(roles) ? roles.join(", ") : roles}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <span>{status}</span>,
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
          <Button type="default" icon={<EyeOutlined />} onClick={() => handleShowDetail(record._id || record.id)}>
            Chi tiết
          </Button>
          <Button type="primary" icon={<EditOutlined />} onClick={() => {
            setEditModal({ open: true, user: record });
            editForm.setFieldsValue({
              name: record.name,
              email: record.email,
              role: Array.isArray(record.roles) ? record.roles[0] : record.roles,
              status: record.status,
            });
          }}>
            Cập nhật
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar selectedKey="user" />
      <div style={{ flex: 1, padding: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Danh sách tài khoản</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Input.Search
            placeholder="Tìm kiếm tên/email"
            allowClear
            value={search}
            onChange={e => setSearch(e.target.value)}
            onSearch={v => setSearch(v)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Trạng thái"
            allowClear
            value={status}
            onChange={v => setStatus(v)}
            style={{ width: 120 }}
          >
            <Select.Option value="ACTIVE">ACTIVE</Select.Option>
            <Select.Option value="INACTIVE">INACTIVE</Select.Option>
            <Select.Option value="BANNED">BANNED</Select.Option>
          </Select>
          <Select
            placeholder="Vai trò"
            allowClear
            value={role}
            onChange={v => setRole(v)}
            style={{ width: 120 }}
          >
            <Select.Option value="ADMIN">ADMIN</Select.Option>
            <Select.Option value="USER">USER</Select.Option>
          </Select>
          <Select
            placeholder="Sắp xếp tên"
            allowClear
            value={sort}
            onChange={v => setSort(v)}
            style={{ width: 140 }}
          >
            <Select.Option value="name_asc">Tên A-Z</Select.Option>
            <Select.Option value="name_desc">Tên Z-A</Select.Option>
          </Select>
        </div>
        <Table
          columns={columns}
          dataSource={users.map((u) => ({ ...u, key: u._id || u.id }))}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page) => fetchUsers(page),
            showSizeChanger: false,
          }}
        />
        <Modal
          open={editModal.open}
          title="Cập nhật trạng thái"
          onCancel={() => setEditModal({ open: false, user: null })}
          footer={null}
        >
          <Form form={editForm} layout="vertical" onFinish={handleUpdateStatus}>
            <Form.Item name="name" label="Tên tài khoản">
              <Input disabled />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input disabled />
            </Form.Item>
            <Form.Item name="role" label="Vai trò">
              <Select disabled>
                <Select.Option value="ADMIN">ADMIN</Select.Option>
                <Select.Option value="USER">USER</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="ACTIVE">ACTIVE</Select.Option>
                <Select.Option value="INACTIVE">INACTIVE</Select.Option>
                <Select.Option value="BANNED">BANNED</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          open={detailModal.open}
          title="Chi tiết tài khoản"
          onCancel={() => setDetailModal({ open: false, user: null, loading: false })}
          footer={null}
        >
          {detailModal.loading ? (
            <div>Đang tải...</div>
          ) : detailModal.user ? (
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Tên tài khoản">{detailModal.user.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{detailModal.user.email}</Descriptions.Item>
              <Descriptions.Item label="Vai trò">{Array.isArray(detailModal.user.roles) ? detailModal.user.roles.join(", ") : detailModal.user.roles}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">{detailModal.user.status}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">{new Date(detailModal.user.createdAt).toLocaleString()}</Descriptions.Item>
            </Descriptions>
          ) : null}
        </Modal>
      </div>
    </div>
  );
};

export default UserDashboard;
