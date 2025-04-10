import { Flex, Input, Popconfirm, Table, notification, Button } from "antd";
import React, { useState, useEffect } from "react";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";
import faqService from "../../../../service/faqService";

const FAQList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [faqs, setFaqs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [totalFaqs, setTotalFaqs] = useState(0);

  // Fetch FAQ data
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await faqService.getAllFAQs();
      if (response && response.data) {
        setFaqs(response.data);
        setTotalFaqs(response.data.length);
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: error.message || "Đã xảy ra lỗi khi tải dữ liệu FAQ.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Filter faqs based on search text
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.title.toLowerCase().includes(searchText.toLowerCase()) ||
      faq.description.toLowerCase().includes(searchText.toLowerCase())
  );

  // Columns for the table
  const columns = [
    {
      title: "STT",
      key: "index",
      width: 80,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
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
      width: 200,
      render: (_, record) => {
        return (
          <Flex gap="12px">
            <Link
              className="text-blue-500"
              to={ROUTE_PATH.FAQ_ADMIN_EDIT(record._id)}
            >
              Chỉnh sửa
            </Link>

            <Popconfirm
              title="Xóa câu hỏi này?"
              description="Bạn có chắc chắn muốn xóa câu hỏi này không?"
              onConfirm={() => handleDelete(record._id)}
              okText="Có"
              cancelText="Không"
            >
              <span className="text-red-500 cursor-pointer">Xóa</span>
            </Popconfirm>
          </Flex>
        );
      },
    },
  ];

  // Handle pagination
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Handle delete FAQ
  const handleDelete = async (id) => {
    try {
      await faqService.deleteFAQs(id);
      notification.success({
        message: "Thành công",
        description: "FAQ đã được xóa thành công.",
      });
      fetchFaqs(); // Refresh the list after deletion
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: error.message || "Đã xảy ra lỗi khi xóa FAQ.",
      });
    }
  };

  // Handle adding new FAQ
  const handleAddFaq = () => {
    navigate(ROUTE_PATH.FAQ_ADMIN_ADD);
  };

  return (
    <div className="p-5">
      <Flex align="center" justify="space-between" className="mb-4">
        <h1 className="font-semibold text-xl">Danh sách FAQ</h1>

        <Flex gap="12px">
          <Input
            placeholder="Tìm kiếm..."
            className="w-64"
            suffix={<SearchOutlined />}
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleAddFaq}
            className="bg-[#1890ff]"
          >
            Thêm mới
          </Button>
        </Flex>
      </Flex>

      <Table
        columns={columns}
        dataSource={filteredFaqs}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredFaqs.length,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trong tổng số ${total} mục`,
        }}
        onChange={handleTableChange}
        className="bg-white rounded-lg shadow"
      />
    </div>
  );
};

export default FAQList;