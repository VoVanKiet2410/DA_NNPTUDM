import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";
import { Table, Button, Input, Popconfirm, message, Pagination } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import donationUnitService from "../../../../service/donationUnitService";
import "./ManageBloodDonationUnitsPage.css";

const BloodDonationUnitList = () => {
  const [units, setUnits] = useState([]); // Toàn bộ danh sách đơn vị
  const [filteredUnits, setFilteredUnits] = useState([]); // Danh sách đơn vị sau khi tìm kiếm
  const [searchKeyword, setSearchKeyword] = useState(""); // Từ khóa tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const [pageSize, setPageSize] = useState(10); // Số đơn vị mỗi trang
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const navigate = useNavigate();

  // Fetch dữ liệu từ API
  const fetchUnits = async () => {
    try {
      setLoading(true);
      const response = await donationUnitService.getAllUnits();
      if (response.success) {
        setUnits(response.data);
        setFilteredUnits(response.data);
      } else {
        message.error("Không thể tải danh sách đơn vị hiến máu");
      }
    } catch (error) {
      message.error(error.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleSearchChange = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);

    if (keyword === "") {
      setFilteredUnits(units);
    } else {
      const filtered = units.filter((unit) =>
        unit.name.toLowerCase().includes(keyword)
      );
      setFilteredUnits(filtered);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await donationUnitService.deleteUnit(id);
      if (response.success) {
        message.success("Xóa đơn vị thành công");
        fetchUnits(); // Tải lại danh sách
      } else {
        message.error("Không thể xóa đơn vị");
      }
    } catch (error) {
      message.error(error.message || "Đã có lỗi xảy ra khi xóa đơn vị");
    }
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: "Tên đơn vị",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <div>
          <Link to={ROUTE_PATH.BLOOD_DONATION_UNITS_EDIT(record._id)}>
            <Button
              type="link"
              icon={<EditOutlined />}
              style={{ color: "#1890ff", marginRight: 10 }}
            >
              Chỉnh sửa
            </Button>
          </Link>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa đơn vị này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="link"
              icon={<DeleteOutlined />}
              style={{ color: "red" }}
            >
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="manage-units">
      <h2 className="title">Tất cả các đơn vị hiến máu</h2>

      <div className="filter-container">
        <Input
          id="search"
          value={searchKeyword}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm theo tên đơn vị"
          className="filter-input"
          allowClear
        />
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={filteredUnits.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        rowKey="_id"
        pagination={false}
        bordered
      />

      <div className="pagination-container">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredUnits.length}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={["10", "20", "30"]}
          showTotal={(total) => `Tổng cộng ${total} đơn vị`}
        />
      </div>
    </div>
  );
};

export default BloodDonationUnitList;
