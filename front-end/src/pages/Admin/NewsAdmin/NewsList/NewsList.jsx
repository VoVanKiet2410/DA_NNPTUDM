import React, { useMemo, useState } from "react";
import { Table, Input, Popconfirm, Flex, notification } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";

// Mock data for news list
const INITIAL_DATA = [
  {
    id: 1,
    title: "Tin tức 1",
    content: "Nội dung chi tiết của tin tức 1.",
  },
  {
    id: 2,
    title: "Tin tức 2",
    content: "Nội dung chi tiết của tin tức 2.",
  },
  {
    id: 3,
    title: "Tin tức 3",
    content: "Nội dung chi tiết của tin tức 3.",
  },
];

const NewsList = () => {
  const [newsData, setNewsData] = useState(INITIAL_DATA);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  // Xử lý tìm kiếm
  const filteredData = useMemo(() => {
    return newsData.filter((item) => {
      return (
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [newsData, searchQuery]);

  // Các cột hiển thị trong bảng
  const columns = useMemo(() => {
    return [
      {
        title: "Tiêu đề",
        key: "title",
        dataIndex: "title",
      },
      {
        title: "Nội dung",
        key: "content",
        dataIndex: "content",
      },
      {
        title: "Hành động",
        key: "actions",
        render: (_, record) => {
          return (
            <Flex gap="12px">
              <Link
                className="text-blue-500"
                to={ROUTE_PATH.NEWS_ADMIN_EDIT(record.id)}
              >
                Chỉnh sửa
              </Link>

              <Popconfirm
                title="Xóa tin tức này?"
                description="Bạn có chắc chắn muốn xóa tin tức này không?"
                onConfirm={() => handleDelete(record.id)} // Gọi hàm xóa
              >
                <p className="text-red-500 cursor-pointer">Xóa</p>
              </Popconfirm>
            </Flex>
          );
        },
      },
    ];
  }, []);

  // Hàm xử lý xóa tin tức (mô phỏng)
  const handleDelete = (id) => {
    setTimeout(() => {
      setNewsData((prevData) => prevData.filter((news) => news.id !== id));
      notification.success({
        message: "Thành công",
        description: "Xóa tin tức thành công!",
      });
    }, 500); // Simulate a delay of 0.5 seconds
  };

  // Hàm xử lý phân trang
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <>
      <Flex align="center" justify="space-between" className="mb-4">
        <h1 className="font-semibold text-xl">Danh sách tin tức</h1>

        <Input
          placeholder="Tìm kiếm..."
          className="w-64"
          suffix={<SearchOutlined />}
          size="large"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Flex>

      <Table
        columns={columns}
        className="mt-4"
        dataSource={filteredData}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredData.length,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trong tổng số ${total} mục`,
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default NewsList;