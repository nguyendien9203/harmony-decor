import React, { useEffect, useState } from "react";
import { Statistic, Row, Col, Spin, Select, Card } from "antd";
import { ShoppingCartOutlined, DollarOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Package, TrendingUp } from 'lucide-react';
import { getAllOrders } from "@/features/admin/order-service";
import { getAllProducts } from "@/features/admin/product-service";
import AdminSidebar from "@/components/ui/admin-sidebar";
import { Line } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Option } = Select;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalInventoryCost: 0,
  });
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [chartType, setChartType] = useState('week');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const orders = await getAllOrders();
        const products = await getAllProducts();
        setOrders(orders);
        
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const deliveredOrders = orders.filter(o => o.orderStatus === "DELIVERED").length;
        const cancelledOrders = orders.filter(o => o.orderStatus === "CANCELLED").length;
        
        // Tính tổng tiền nhập hàng (giá nhập * số lượng tồn kho)
        const totalInventoryCost = products.data?.products?.reduce((sum, product) => {
          // Giả sử giá nhập = 70% giá bán (có thể điều chỉnh theo logic thực tế)
          const costPrice = (product.price || 0) * 0.7;
          const stockQuantity = product.stock || 0;
          return sum + (costPrice * stockQuantity);
        }, 0) || 0;
        
        setStats({ 
          totalOrders, 
          totalRevenue, 
          deliveredOrders, 
          cancelledOrders,
          totalInventoryCost 
        });
      } catch (err) {
        setStats({ 
          totalOrders: 0, 
          totalRevenue: 0, 
          deliveredOrders: 0, 
          cancelledOrders: 0,
          totalInventoryCost: 0 
        });
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    // Tính dữ liệu cho biểu đồ theo chartType
    if (!orders.length) {
      setChartData([]);
      return;
    }
    let data = [];
    if (chartType === 'week') {
      // 7 ngày gần nhất
      const days = Array.from({ length: 7 }, (_, i) => dayjs().subtract(6 - i, 'day').format('YYYY-MM-DD'));
      data = days.map(date => {
        const total = orders.filter(o => dayjs(o.createdAt).format('YYYY-MM-DD') === date)
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        return { date, revenue: total };
      });
    } else if (chartType === 'month') {
      // 30 ngày gần nhất
      const days = Array.from({ length: 30 }, (_, i) => dayjs().subtract(29 - i, 'day').format('YYYY-MM-DD'));
      data = days.map(date => {
        const total = orders.filter(o => dayjs(o.createdAt).format('YYYY-MM-DD') === date)
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        return { date, revenue: total };
      });
    } else if (chartType === 'year') {
      // 12 tháng gần nhất
      const months = Array.from({ length: 12 }, (_, i) => dayjs().subtract(11 - i, 'month').format('YYYY-MM'));
      data = months.map(month => {
        const total = orders.filter(o => dayjs(o.createdAt).format('YYYY-MM') === month)
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        return { date: month, revenue: total };
      });
    }
    setChartData(data);
  }, [orders, chartType]);

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'revenue',
    point: { size: 5, shape: 'diamond' },
    label: { style: { fill: '#aaa' } },
    tooltip: { formatter: (d) => ({ name: 'Doanh thu', value: d.revenue.toLocaleString() + '₫' }) },
    smooth: true,
    color: '#3f8600',
    height: 320,
    xAxis: {
      label: { autoHide: true, autoRotate: false },
    },
    yAxis: {
      label: { formatter: (v) => (+v).toLocaleString() },
    },
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Dashboard</h2>
        {loading ? (
          <Spin />
        ) : (
          <>
            <Row gutter={24} style={{ marginBottom: 32 }}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Tổng đơn hàng" value={stats.totalOrders} prefix={<ShoppingCartOutlined />} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Tổng doanh thu" value={stats.totalRevenue} prefix={<DollarOutlined />} suffix="₫" valueStyle={{ color: '#3f8600' }} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Tổng tiền nhập hàng" value={stats.totalInventoryCost} prefix={<Package />} suffix="₫" valueStyle={{ color: '#cf1322' }} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Lợi nhuận tiềm năng" value={stats.totalRevenue - stats.totalInventoryCost} prefix={<TrendingUp />} suffix="₫" valueStyle={{ color: '#1890ff' }} />
                </Card>
              </Col>
            </Row>
            <Row gutter={24} style={{ marginBottom: 32 }}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Đã giao" value={stats.deliveredOrders} prefix={<CheckCircleOutlined style={{ color: 'green' }} />} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Đã hủy" value={stats.cancelledOrders} prefix={<CloseCircleOutlined style={{ color: 'red' }} />} />
                </Card>
              </Col>
            </Row>
            <Card style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontWeight: 600, fontSize: 18, margin: 0 }}>Biểu đồ doanh thu</h3>
                <Select value={chartType} onChange={setChartType} style={{ width: 160 }}>
                  <Option value="week">7 ngày gần nhất</Option>
                  <Option value="month">30 ngày gần nhất</Option>
                  <Option value="year">12 tháng gần nhất</Option>
                </Select>
              </div>
              <Line {...config} />
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 