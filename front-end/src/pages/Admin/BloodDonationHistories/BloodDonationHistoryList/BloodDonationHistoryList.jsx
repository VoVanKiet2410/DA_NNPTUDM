import { Flex, Input, Popconfirm, Table, message, Spin } from "antd";
import React, { useMemo, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";

const BloodDonationHistoryList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [bloodInventories, setBloodInventories] = useState([]);
  const [filteredInventories, setFilteredInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Dữ liệu giả lập
  const mockBloodInventories = [
    {
      id: 1,
      appointmentDTO: { userId: "user001", status: "COMPLETED" },
      donationType: "A",
      quantity: 250,
      lastUpdated: "2025-03-01T10:00:00",
      expirationDate: "2025-04-01",
    },
    {
      id: 2,
      appointmentDTO: { userId: "user002", status: "COMPLETED" },
      donationType: "B",
      quantity: 300,
      lastUpdated: "2025-03-05T14:30:00",
      expirationDate: "2025-04-05",
    },
    {
      id: 3,
      appointmentDTO: { userId: "user003", status: "COMPLETED" },
      donationType: "O",
      quantity: 200,
      lastUpdated: "2025-03-10T09:00:00",
      expirationDate: "2025-04-10",
    },
  ];

  useEffect(() => {
    // Giả lập việc tải dữ liệu
    const fetchMockData = () => {
      setTimeout(() => {
        setBloodInventories(mockBloodInventories);
        setFilteredInventories(mockBloodInventories);
        setLoading(false);
        message.success("Dữ liệu đã được tải thành công!");
      }, 1000); // Giả lập thời gian tải
    };

    fetchMockData();
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: "Người hiến",
        key: "user",
        render: (_, record) => record.appointmentDTO?.userId || "N/A",
      },
      {
        title: "Loại máu",
        key: "donationType",
        dataIndex: "donationType",
      },
      {
        title: "Số lượng (ml)",
        key: "quantity",
        dataIndex: "quantity",
      },
      {
        title: "Ngày cập nhật",
        key: "lastUpdated",
        dataIndex: "lastUpdated",
        render: (date) => new Date(date).toLocaleString(),
      },
      {
        title: "Ngày hết hạn",
        key: "expirationDate",
        dataIndex: "expirationDate",
        render: (date) => new Date(date).toLocaleDateString(),
      },
      {
        title: "Trạng thái lịch hẹn",
        key: "status",
        render: (_, record) => record.appointmentDTO?.status || "N/A",
      },
      {
        title: "Hành động",
        key: "actions",
        render: (_, record) => (
          <Flex gap="12px">
            <Link
              className="text-blue-500"
              to={ROUTE_PATH.EDIT_BLOOD_DONATION_HISTORY(record.id)}
            >
              Chỉnh sửa
            </Link>
            <Popconfirm
              title="Xóa dữ liệu"
              description="Bạn có chắc chắn muốn xóa mục này không?"
              onConfirm={() => handleDelete(record.id)}
            >
              <p className="text-red-500 cursor-pointer">Xóa</p>
            </Popconfirm>
          </Flex>
        ),
      },
    ];
  }, []);

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleDelete = (id) => {
    setBloodInventories((prev) => prev.filter((item) => item.id !== id));
    setFilteredInventories((prev) => prev.filter((item) => item.id !== id));
    message.success("Đã xóa thành công!");
  };

  const handleSearchChange = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);

    if (keyword === "") {
      setFilteredInventories(bloodInventories);
    } else {
      const filtered = bloodInventories.filter(
        (item) =>
          item.appointmentDTO?.userId.toLowerCase().includes(keyword) ||
          item.donationType.toLowerCase().includes(keyword) ||
          item.appointmentDTO?.status.toLowerCase().includes(keyword)
      );
      setFilteredInventories(filtered);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <>
      <Flex align="center" justify="space-between" className="mb-4">
        <h1 className="font-semibold text-xl">Danh sách kho máu</h1>
        <Input
          placeholder="Tìm kiếm theo người hiến, loại máu hoặc trạng thái"
          className="w-64"
          suffix={<SearchOutlined />}
          size="large"
          value={searchKeyword}
          onChange={handleSearchChange}
        />
      </Flex>

      <Table
        columns={columns}
        className="mt-4"
        scroll={{ x: 1200 }}
        dataSource={filteredInventories}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredInventories.length,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trong tổng số ${total} mục`,
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default BloodDonationHistoryList;