import React, { useMemo, useState } from "react";
import { Table, Input, Popconfirm, Flex, notification, Image } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";
import axios from "axios";
import { useEffect } from "react";

const API_URL = "http://localhost:5000"; // Thêm URL gốc

const NewsList = () => {
  const [newsData, setNewsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/news`);
      setNewsData(response.data.data);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách tin tức",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

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
        title: "Ảnh",
        key: "image",
        render: (_, record) => (
          <Image 
            src={record.imageUrl || "/assets/img/default.png"} 
            alt={record.title}
            style={{ width: 100, height: 60, objectFit: 'cover' }}
            fallback="/assets/img/default.png"
          />
        ),
      },
      {
        title: "Tiêu đề",
        key: "title",
        dataIndex: "title",
        ellipsis: true,
      },
      {
        title: "Nội dung",
        key: "content",
        dataIndex: "content",
        ellipsis: true,
        width: '40%',
      },
      {
        title: "Hành động",
        key: "actions",
        render: (_, record) => {
          return (
            <Flex gap="12px">
              <Link
                className="text-blue-500"
                to={ROUTE_PATH.NEWS_ADMIN_EDIT(record._id)}
              >
                Chỉnh sửa
              </Link>

              <Popconfirm
                title="Xóa tin tức này?"
                description="Bạn có chắc chắn muốn xóa tin tức này không?"
                onConfirm={() => handleDelete(record._id)}
              >
                <p className="text-red-500 cursor-pointer">Xóa</p>
              </Popconfirm>
            </Flex>
          );
        },
      },
    ];
  }, []);

  // Hàm xử lý xóa tin tức
  const handleDelete = async (id) => {
    try {
      // Sử dụng URL đầy đủ
      await axios.delete(`${API_URL}/api/news/${id}`);
      notification.success({
        message: "Thành công",
        description: "Xóa tin tức thành công!",
      });
      fetchNews(); // Refresh data
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa tin tức",
      });
    }
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
        rowKey="_id"
        loading={loading}
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