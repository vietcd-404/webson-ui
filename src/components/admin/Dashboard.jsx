import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Space, Statistic, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  getCustomers,
  getDoanhThuTheoNam,
  getInventory,
  getOrders,
  getRevenue,
  getTop4Customer,
  getTop4Product,
  sumTotalBill,
} from "../../services/ThongKeService.jsx";
import { findAllSPCT } from "../../services/SanPhamChiTietService";
import { findAllNguoiDung } from "../../services/NguoiDungService";
import { getAllOrder } from "../../services/HoaDonService";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [orders, setOrders] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    loadTotalProduct();
    loadTotalUser();
    getTotalOrder();
    loadTotalBill();
  }, []);

  const loadTotalProduct = async () => {
    try {
      const response = await findAllSPCT();
      setInventory(response.data.length);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const loadTotalUser = async () => {
    try {
      const response = await findAllNguoiDung();
      setCustomers(response.data.length);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };
  const getTotalOrder = async () => {
    try {
      const response = await getAllOrder();
      setOrders(response.data.totalElements);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const loadTotalBill = async () => {
    try {
      const response = await sumTotalBill();
      setRevenue(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Tổng Quan</Typography.Title>
      <Space direction="horizontal">
        <DashboardCard
          icon={
            <ShoppingCartOutlined
              style={{
                color: "green",
                backgroundColor: "rgba(0,255,0,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Lượt mua hàng"}
          value={orders}
        />
        <DashboardCard
          icon={
            <ShoppingOutlined
              style={{
                color: "blue",
                backgroundColor: "rgba(0,0,255,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Sản Phẩm"}
          value={inventory}
        />
        <DashboardCard
          icon={
            <UserOutlined
              style={{
                color: "purple",
                backgroundColor: "rgba(0,255,255,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Tài khoản người dùng"}
          value={customers}
        />
        <DashboardCard
          icon={
            <DollarCircleOutlined
              style={{
                color: "red",
                backgroundColor: "rgba(255,0,0,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Tổng tiền thu được"}
          value={revenue}
        />
      </Space>
      <Space>
        <RecentOrders />
        <TopOrder />
      </Space>
      <div style={{ clear: "both" }} />
      <DashboardChart />
    </Space>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <Card>
      <Space direction="horizontal">
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}
function RecentOrders() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTable = async () => {
    try {
      const response = await getTop4Product();
      setDataSource(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    loadTable();
  }, []);

  return (
    <>
      <Typography.Text className="text-bold">Sản phẩm bán chạy</Typography.Text>
      <Table
        columns={[
          {
            title: "Tên sản phẩm",
            dataIndex: "tenSanPham",
          },
          {
            title: "Số lượng đã bán",
            dataIndex: "soLuongTon",
          },
        ]}
        loading={loading}
        dataSource={dataSource}
        pagination={false}
      ></Table>
    </>
  );
}

function TopOrder() {
  const [dataTopOrder, setDataTopOrder] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTable = async () => {
    try {
      const response = await getTop4Customer();
      setDataTopOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    loadTable();
  }, []);

  return (
    <>
      <Typography.Text className="text-bold">Top người mua</Typography.Text>
      <Table
        columns={[
          {
            title: "Tên khách hàng",
            dataIndex: "ten",
          },
          {
            title: "Tài khoản",
            dataIndex: "username",
          },
          {
            title: "Số lượt mua",
            dataIndex: "luotMua",
          },
        ]}
        loading={loading}
        dataSource={dataTopOrder}
        pagination={false}
      ></Table>
    </>
  );
}

function DashboardChart() {
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchDoanhThuTheoNam = async () => {
      try {
        const response = await getDoanhThuTheoNam(2021, 2023);
        const doanhThuTheoNam = response.data;

        const chartData = {
          labels: [],
          datasets: [
            {
              label: "Doanh thu",
              data: [],
              backgroundColor: "rgba(255, 0, 0, 1)",
            },
            {
              label: "Số lượng bán",
              data: [],
              backgroundColor: "rgba(0, 0, 255, 1)",
            },
          ],
        };

        for (let year = 2021; year <= 2023; year++) {
          const dataForYear = doanhThuTheoNam.find((item) => item.nam === year);
          chartData.labels.push(`${year}`);
          if (dataForYear) {
            chartData.datasets[0].data.push(
              parseFloat(dataForYear.doanhThu || 0)
            );
            chartData.datasets[1].data.push(
              parseFloat(dataForYear.slDaBan || 0)
            );
          } else {
            chartData.datasets[0].data.push(0);
            chartData.datasets[1].data.push(0);
          }
        }

        setRevenueData(chartData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu doanh thu: ", error);
      }
    };

    fetchDoanhThuTheoNam();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Doanh thu và số lượng bán theo từng năm",
      },
    },
  };

  return (
    <Card style={{ width: 500, height: 250 }}>
      <Bar options={options} data={revenueData} />
    </Card>
  );
}

export default Dashboard;
