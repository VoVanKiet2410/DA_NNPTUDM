import { Flex, Input, Popconfirm, Table, notification } from "antd";
import React, { useMemo, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";

const FAQList = () => {
  // Quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [faqs, setFaqs] = useState([]);

  // Mock data to simulate FAQ list
  useEffect(() => {
    const mockFaqs = [
      { id: 1, title: "FAQ 1", description: "Description for FAQ 1" },
      { id: 2, title: "FAQ 2", description: "Description for FAQ 2" },
      { id: 3, title: "FAQ 3", description: "Description for FAQ 3" },
      { id: 4, title: "FAQ 4", description: "Description for FAQ 4" },
      { id: 5, title: "FAQ 5", description: "Description for FAQ 5" },
    ];
    setFaqs(mockFaqs); // Set mock data
  }, []);

  // Cột cho bảng
  const columns = useMemo(() => {
    return [
      {
        title: "Tiêu đề",
        key: "title",
        dataIndex: "title",
      },
      {
        title: "Mô tả",
        key: "description",
        dataIndex: "description",
        ellipsis: true,
      },
      {
        title: "Hành động",
        key: "actions",
        render: (_, record) => {
          return (
            <Flex gap="12px">
              <Link
                className="text-blue-500"
                to={ROUTE_PATH.FAQ_ADMIN_EDIT(record.id)}
              >
                Chỉnh sửa
              </Link>

              <Popconfirm
                title="Xóa câu hỏi này?"
                description="Bạn có chắc chắn muốn xóa câu hỏi này không?"
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

  // Hàm xử lý phân trang
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Hàm xử lý xóa FAQ (mô phỏng)
  const handleDelete = (id) => {
    setTimeout(() => {
      setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq.id !== id)); // Cập nhật danh sách FAQ
      notification.success({
        message: "Thành công",
        description: "FAQ đã được xóa.",
      });
    }, 500); // Simulate a delay of 0.5 seconds
  };

  return (
    <>
      <Flex align="center" justify="space-between">
        <h1 className="font-semibold text-xl">Danh sách FAQ</h1>

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
        dataSource={faqs} // Dữ liệu từ state faqs
        rowKey="id"
        // Phân trang
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: faqs.length, // Tổng số bản ghi
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trong tổng số ${total} mục`,
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default FAQList;