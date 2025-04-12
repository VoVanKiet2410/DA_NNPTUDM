import { Flex, Input, Popconfirm, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";
import eventService from "../../../../service/eventService";
import donationUnitService from "../../../../service/donationUnitService";

const EventBloodDonationList = () => {
  const [searchText, setSearchText] = useState("");
  const [events, setEvents] = useState([]);
  const [donationUnits, setDonationUnits] = useState({});
  const [loading, setLoading] = useState(false);

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Lọc sự kiện theo từ khóa tìm kiếm
  const filteredEvents = events.filter((event) => {
    const unitName = donationUnits[event.donationUnit]?.name || "";
    return (
      event.name.toLowerCase().includes(searchText.toLowerCase()) ||
      unitName.toLowerCase().includes(searchText.toLowerCase()) ||
      event.location.toLowerCase().includes(searchText.toLowerCase()) ||
      event.eventDate.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  // Xóa sự kiện
  const handleDeleteEvent = async (id) => {
    try {
      setLoading(true);
      const response = await eventService.deleteEvent(id);
      if (response.success) {
        message.success("Xóa sự kiện thành công");
        fetchEvents();
      } else {
        message.error(response.message || "Không thể xóa sự kiện");
      }
    } catch (error) {
      message.error(error.message || "Đã có lỗi xảy ra khi xóa sự kiện");
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách sự kiện
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAllEvents();
      if (response.success) {
        setEvents(response.data);
      } else {
        message.error("Không thể tải danh sách sự kiện");
      }
    } catch (error) {
      message.error(error.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách đơn vị hiến máu
  const fetchDonationUnits = async () => {
    try {
      const response = await donationUnitService.getAllUnits();
      if (response.success) {
        // Chuyển đổi mảng thành object để dễ tìm kiếm
        const unitsObj = {};
        response.data.forEach((unit) => {
          unitsObj[unit._id] = unit;
        });
        setDonationUnits(unitsObj);
      }
    } catch (error) {
      message.error("Không thể tải danh sách đơn vị hiến máu");
    }
  };

  useEffect(() => {
    fetchDonationUnits();
    fetchEvents();
  }, []);

  const columns = [
    {
      title: "Tên sự kiện",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Đơn vị hiến máu",
      key: "donationUnit",
      render: (_, record) => record.donationUnit?.name || "N/A",
    },
    {
      title: "Địa chỉ",
      key: "location",
      dataIndex: "location",
    },
    {
      title: "Ngày diễn ra",
      key: "eventDate",
      dataIndex: "eventDate",
    },
    {
      title: "Thời gian bắt đầu",
      key: "eventStartTime",
      dataIndex: "eventStartTime",
    },
    {
      title: "Thời gian kết thúc",
      key: "eventEndTime",
      dataIndex: "eventEndTime",
    },
    {
      title: "Số lượng đăng ký",
      key: "currentRegistrations",
      render: (_, record) =>
        `${record.currentRegistrations}/${record.maxRegistrations}`,
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <span
          className={status === "ACTIVE" ? "text-green-500" : "text-red-500"}
        >
          {status === "ACTIVE"
            ? "Đang hoạt động"
            : status === "DONE"
            ? "Đã kết thúc"
            : "Đã đầy"}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => {
        return (
          <Flex gap="12px">
            <Link
              className="text-blue-500"
              to={ROUTE_PATH.EVENT_BLOOD_DONATION_EDIT(record._id)}
            >
              Chỉnh sửa
            </Link>

            <Popconfirm
              title="Xóa sự kiện"
              description="Bạn có chắc chắn muốn xóa sự kiện này?"
              onConfirm={() => handleDeleteEvent(record._id)}
            >
              <p className="text-red-500 cursor-pointer">Xóa</p>
            </Popconfirm>
          </Flex>
        );
      },
    },
  ];

  return (
    <>
      <Flex align="center" justify="space-between">
        <h1 className="font-semibold text-xl">Danh sách sự kiện hiến máu</h1>

        <Input
          placeholder="Tìm kiếm tên sự kiện, đơn vị hoặc ngày..."
          className="w-64"
          suffix={<SearchOutlined />}
          size="large"
          value={searchText}
          onChange={handleSearch}
        />
      </Flex>

      <Table
        columns={columns}
        dataSource={filteredEvents}
        rowKey="_id"
        loading={loading}
      />
    </>
  );
};

export default EventBloodDonationList;
