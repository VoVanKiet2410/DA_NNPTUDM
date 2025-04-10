import React, { useState, useEffect } from "react";
import { DatePicker, Select, Button, Pagination, message } from "antd";
import { useNavigate } from "react-router-dom";
import eventService from "../../service/eventService";
import donationUnitService from "../../service/donationUnitService";

const { RangePicker } = DatePicker;

function BloodDonationSearch() {
  const [filters, setFilters] = useState({
    dateRange: [],
    organization: "Tất cả",
    organizationId: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [donationUnits, setDonationUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchEvents();
    fetchDonationUnits();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAllEvents();
      setEvents(response.data);
    } catch (error) {
      messageApi.error("Không thể tải danh sách sự kiện");
    } finally {
      setLoading(false);
    }
  };

  const fetchDonationUnits = async () => {
    try {
      const response = await donationUnitService.getAllUnits();
      if (response.success) {
        setDonationUnits(response.data);
      }
    } catch (error) {
      messageApi.error("Không thể tải danh sách đơn vị hiến máu");
    }
  };

  const handleDateRangeChange = (dates) => {
    setFilters({ ...filters, dateRange: dates });
  };

  const handleOrganizationChange = (value) => {
    const unitId = value === "Tất cả" ? null : value;
    setFilters({ ...filters, organization: value, organizationId: unitId });
  };

  const handleBooking = (event) => {
    if (event.currentRegistrations >= event.maxRegistrations) {
      messageApi.warning("Sự kiện này đã đầy!");
      return;
    }
    localStorage.setItem("eventId", event._id);
    navigate(`/appointments/booking`);
  };

  // Lọc sự kiện dựa trên bộ lọc
  const filteredEvents = events.filter((event) => {
    // Lọc theo đơn vị hiến máu
    if (
      filters.organizationId &&
      event.donationUnit !== filters.organizationId
    ) {
      return false;
    }

    // Lọc theo khoảng thời gian
    if (filters.dateRange && filters.dateRange.length === 2) {
      const eventDate = new Date(event.eventDate);
      const startDate = filters.dateRange[0].startOf("day").toDate();
      const endDate = filters.dateRange[1].endOf("day").toDate();

      if (eventDate < startDate || eventDate > endDate) {
        return false;
      }
    }

    return true;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredEvents.slice(startIndex, endIndex);

  return (
    <>
      {contextHolder}
      <div className="max-w-5xl mx-auto p-6 bg-gray-100">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4 flex items-center gap-4">
            <label
              htmlFor="date-range"
              className="block text-sm text-gray-700 font-medium whitespace-nowrap"
            >
              Bạn cần đặt lịch vào thời gian nào?
            </label>
            <RangePicker
              id="date-range"
              className="w-96"
              onChange={handleDateRangeChange}
              value={filters.dateRange}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <Button type="default" className="px-6">
              Gần tôi
            </Button>
            <Button type="default" className="px-6">
              Đề xuất
            </Button>
            <Select
              className="w-60"
              onChange={handleOrganizationChange}
              value={filters.organization}
              options={[
                { value: "Tất cả", label: "Tất cả" },
                ...donationUnits.map((unit) => ({
                  value: unit._id,
                  label: unit.name,
                })),
              ]}
            />
          </div>
        </div>
        <div>
          {filteredEvents.length === 0 ? (
            <p className="text-gray-600 text-center">
              Không có sự kiện nào phù hợp với bộ lọc của bạn.
            </p>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                {filteredEvents.length} Kết quả
              </p>
              <div className="space-y-4">
                {currentItems.map((event) => {
                  const donationUnit = donationUnits.find(
                    (unit) => unit._id === event.donationUnit
                  );
                  return (
                    <div
                      key={event._id}
                      className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between"
                    >
                      <div className="flex items-start gap-6">
                        <img
                          src={
                            donationUnit?.unitPhotoUrl ||
                            "/assets/img/blood.png"
                          }
                          alt={event.name}
                          className="w-20 h-20 object-contain"
                        />
                        <div>
                          <h3 className="text-lg font-bold text-blue-600 mb-1">
                            {event.name}
                          </h3>
                          <p className="text-gray-500 mb-1">
                            <span className="font-medium">Đơn vị: </span>
                            {donationUnit?.name}
                          </p>
                          <p className="text-gray-500 mb-1">{event.location}</p>
                          <p className="text-gray-500">
                            Thời gian: {event.eventDate} ({event.eventStartTime}{" "}
                            - {event.eventEndTime})
                          </p>
                          <p className="text-gray-500">
                            {event.currentRegistrations} /{" "}
                            {event.maxRegistrations} Người đã đăng ký
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          type="primary"
                          onClick={() => handleBooking(event)}
                          className="px-6"
                          disabled={
                            event.currentRegistrations >= event.maxRegistrations
                          }
                        >
                          Đặt lịch
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-center">
                <Pagination
                  current={currentPage}
                  pageSize={itemsPerPage}
                  total={filteredEvents.length}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default BloodDonationSearch;
