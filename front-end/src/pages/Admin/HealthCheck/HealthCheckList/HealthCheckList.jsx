import { Flex, Input, Popconfirm, Table, notification } from "antd";
import React, { useMemo, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";

// Mock data for health check list
const INITIAL_DATA = [
  {
    id: 1,
    heartRate: 75,
    bloodPressure: 110,
    temperature: 36.8,
    height: 1.7,
    weight: 65,
    healthMetrics: "75 / 110 / 36.8 / 1.7 / 65",
    bmi: "22.49",
    notes: "Healthy condition",
    result: "Đạt",
  },
  {
    id: 2,
    heartRate: 80,
    bloodPressure: 115,
    temperature: 37.0,
    height: 1.65,
    weight: 70,
    healthMetrics: "80 / 115 / 37.0 / 1.65 / 70",
    bmi: "25.71",
    notes: "Slightly overweight",
    result: "Không đạt",
  },
];

const HealthCheckList = () => {
  // Quản lý dữ liệu và phân trang
  const [data, setData] = useState(INITIAL_DATA);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const columns = useMemo(() => {
    return [
      {
        title: "Nhịp tim",
        key: "heartRate",
        dataIndex: "heartRate",
      },
      {
        title: "Huyết áp",
        key: "bloodPressure",
        dataIndex: "bloodPressure",
      },
      {
        title: "Nhiệt độ",
        key: "temperature",
        dataIndex: "temperature",
      },
      {
        title: "Chiều cao",
        key: "height",
        dataIndex: "height",
      },
      {
        title: "Cân nặng",
        key: "weight",
        dataIndex: "weight",
      },
      {
        title: "Số liệu sức khỏe",
        key: "healthMetrics",
        dataIndex: "healthMetrics",
      },
      {
        title: "BMI",
        key: "bmi",
        dataIndex: "bmi",
      },
      {
        title: "Ghi chú",
        key: "notes",
        dataIndex: "notes",
      },
      {
        title: "Kết quả",
        key: "result",
        dataIndex: "result",
      },
      {
        title: "Hành động",
        key: "actions",
        render: (_, record) => {
          return (
            <Flex gap="12px">
              <Link
                className="text-blue-500"
                to={ROUTE_PATH.HEALTH_CHECK_EDIT(record.id)}
              >
                Edit
              </Link>

              <Popconfirm
                title="Xóa lịch sử này?"
                description="Bạn có chắc chắn muốn xóa lịch sử này?"
                onConfirm={() => handleDelete(record.id)}
              >
                <p className="text-red-500 cursor-pointer">Delete</p>
              </Popconfirm>
            </Flex>
          );
        },
      },
    ];
  }, []);

  // Hàm xử lý phân trang
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Hàm xử lý xóa (mô phỏng)
  const handleDelete = (id) => {
    setTimeout(() => {
      setData((prevData) => prevData.filter((item) => item.id !== id)); // Cập nhật danh sách
      notification.success({
        message: "Thành công",
        description: "Lịch sử kiểm tra sức khỏe đã được xóa.",
      });
    }, 500); // Simulate a delay of 0.5 seconds
  };

  return (
    <>
      <Flex align="center" justify="space-between">
        <h1 className="font-semibold text-xl">Kiểm tra sức khỏe</h1>

        <Input
          placeholder="Tìm kiếm..."
          className="w-64"
          suffix={<SearchOutlined />}
          size="large"
        />
      </Flex>

      <Table
        columns={columns}
        className="mt-4"
        scroll={{ x: 1200 }}
        dataSource={data} // Sử dụng state để quản lý dữ liệu
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data.length,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trong tổng số ${total} mục`,
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default HealthCheckList;