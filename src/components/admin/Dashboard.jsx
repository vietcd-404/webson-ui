import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Space, Statistic, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  getDoanhThuTheoNam,
  getDoanhThuTheoNgay,
  getDoanhThuTheoThang,
  getThongKeStatus,
  getTop4Customer,
  getTop4Favorite,
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
  DoughnutController,
  ArcElement,
  PointElement,
  LineController,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
  PointElement,
  LineController,
  LineElement
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
          title={"Quản Lý sản phẩm"}
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
        <TopFavorite />
      </Space>
      <div style={{ clear: "both" }} />
      <Row gutter={16}>
        <Col span={12}>
          <DashboardChart />
        </Col>
        <Col span={12}>
          <StatusChart />
        </Col>
      </Row>
      <DashboardColumn />
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

function TopFavorite() {
  const [dataTop, setDataTop] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTable = async () => {
    try {
      const response = await getTop4Favorite();
      setDataTop(response.data);
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
      <Typography.Text className="text-bold">
        Top Sản Phẩm Yêu Thích
      </Typography.Text>
      <Table
        className="ml-2 mr-2"
        columns={[
          {
            title: "Tên sản phẩm",
            dataIndex: "tenSanPham",
          },
          {
            title: "Số lượt yêu thích",
            dataIndex: "soLuongTon",
          },
        ]}
        loading={loading}
        dataSource={dataTop}
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
        const response = await getDoanhThuTheoNam();
        const doanhThuTheoNam = response.data;
        const chartData = {
          labels: [],
          datasets: [
            {
              label: "Doanh thu",
              data: [],
              borderColor: "rgba(255, 0, 0, 1)",
              fill: false,
            },
            {
              label: "Số lượng bán ra",
              data: [],
              borderColor: "rgba(0,0,255)",
              fill: false,
            },
          ],
        };

        const dataByYear = {};
        doanhThuTheoNam.forEach((item) => {
          dataByYear[item.year] = item;
        });

        for (let year = 2020; year <= 2023; year++) {
          const dataForYear = dataByYear[year.toString()];

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
    },
  };

  return (
    <Card
      style={{ width: "100%", height: 500, textAlign: "center" }}
      title={"Doanh thu, số lượng theo từng năm"}
      className="mb-5 ml-9"
    >
      <Line
        options={{ ...options, maintainAspectRatio: false }}
        data={revenueData}
        width={800}
        height={400}
      />
    </Card>
  );
}

function StatusChart() {
  const [statusData, setStatusData] = useState({
    status0: 0,
    status1: 0,
    status2: 0,
    status3: 0,
    status4: 0,
  });

  const [chartData, setChartData] = useState({
    labels: ["Chờ xác nhận", "Chờ giao", "Đang Giao", "Hoàn Thành", "Hủy"],
    datasets: [
      {
        label: "Thống kê theo trạng thái",
        data: [],
        backgroundColor: [
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 0, 0, 1)",
        ],
      },
    ],
  });

  const fetchDataForAllStatus = async () => {
    try {
      const responseStatus0 = await getThongKeStatus(0);
      const responseStatus1 = await getThongKeStatus(1);
      const responseStatus2 = await getThongKeStatus(2);
      const responseStatus3 = await getThongKeStatus(3);
      const responseStatus4 = await getThongKeStatus(4);
      setStatusData({
        status0: responseStatus0.data,
        status1: responseStatus1.data,
        status2: responseStatus2.data,
        status3: responseStatus3.data,
        status4: responseStatus4.data,
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu trạng thái: ", error);
    }
  };

  useEffect(() => {
    fetchDataForAllStatus();
  }, []);

  useEffect(() => {
    const data = [
      statusData.status0,
      statusData.status1,
      statusData.status2,
      statusData.status3,
      statusData.status4,
    ];

    setChartData((prevChartData) => ({
      ...prevChartData,
      datasets: [
        {
          ...prevChartData.datasets[0],
          data: data,
        },
      ],
    }));
  }, [statusData]);

  return (
    <Card
      title={"Trạng thái hóa đơn"}
      style={{ width: "87%", height: 500, textAlign: "center" }}
      className="mb-5 ml-9"
    >
      <Doughnut data={chartData} className="ml-7" width={600} />
    </Card>
  );
}

function DashboardColumn() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Doanh thu",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Số lượng  bán ra",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  });

  const [selectedOption, setSelectedOption] = useState("today"); // State để lưu trữ lựa chọn của người dùng

  const fetchData = async () => {
    function formatDateToString(date) {
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (month < 10) {
        month = `0${month}`;
      }
      if (day < 10) {
        day = `0${day}`;
      }

      return `${year}-${month}-${day}`;
    }

    const today = formatDateToString(new Date());
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

    const yesterday = formatDateToString(yesterdayDate);

    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const thisMonth = new Date().getMonth() + 1;
    try {
      let response;
      switch (selectedOption) {
        case "today":
          response = await getDoanhThuTheoNgay(today);
          break;
        case "yesterday":
          response = await getDoanhThuTheoNgay(yesterday);
          break;

        case "month":
          response = await getDoanhThuTheoThang(thisMonth, year);
          break;
        case "lastMonth":
          response = await getDoanhThuTheoThang(month, year);
          break;
        default:
          break;
      }

      if (response) {
        const data = response.data;
        const labels = [""];
        const revenueValues = [data.doanhThu];
        const salesValues = [data.slDaBan];

        setChartData({
          labels: labels,
          datasets: [
            {
              ...chartData.datasets[1],
              data: revenueValues,
            },
            {
              ...chartData.datasets[0],
              data: salesValues,
            },
          ],
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedOption]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <Card title={"Số lượng và doanh thu"} style={{ textAlign: "center" }}>
        <select value={selectedOption} onChange={handleOptionChange}>
          <option value="today">Hôm nay</option>
          <option value="yesterday">Hôm qua</option>
          <option value="month">Trong tháng</option>
          <option value="lastMonth">Tháng trước</option>
        </select>
        <Bar
          data={{
            labels: chartData.labels,
            datasets: [
              {
                label: "Số lượng bán ra",
                data: chartData.datasets[1].data,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                yAxisID: "quantity",
              },
              {
                label: "Doanh thu",
                data: chartData.datasets[0].data,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                yAxisID: "revenue",
              },
            ],
          }}
          options={{
            scales: {
              y: [
                {
                  id: "revenue",
                  type: "linear", // Loại trục là linear cho doanh thu
                  position: "left", // Đặt vị trí là bên trái
                  ticks: {
                    beginAtZero: true,
                  },
                },
                {
                  id: "quantity",
                  type: "linear",
                  position: "right",
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }}
        />
      </Card>
    </div>
  );
}

export default Dashboard;
