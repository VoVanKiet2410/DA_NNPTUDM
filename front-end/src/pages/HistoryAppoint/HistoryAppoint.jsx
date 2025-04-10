import React from "react";

function HistoryAppoint() {
  // Hardcoded placeholder data for UI demonstration
  const appointments = [
    {
      id: 1,
      status: "PENDING",
      event: {
        name: "Sự kiện hiến máu 1",
        donationUnitDTO: {
          location: "123 Đường Láng, Hà Nội",
        },
        eventStartTime: "08:00",
        eventDate: "20/03/2025",
      },
    },
    {
      id: 2,
      status: "CONFIRMED",
      event: {
        name: "Sự kiện hiến máu 2",
        donationUnitDTO: {
          location: "456 Trần Phú, TP.HCM",
        },
        eventStartTime: "09:00",
        eventDate: "25/03/2025",
      },
    },
    {
      id: 3,
      status: "COMPLETED",
      event: {
        name: "Sự kiện hiến máu 3",
        donationUnitDTO: {
          location: "789 Nguyễn Trãi, Đà Nẵng",
        },
        eventStartTime: "07:30",
        eventDate: "15/03/2025",
      },
    },
    {
      id: 4,
      status: "CANCELED",
      event: null, // Simulate missing event data
    },
  ];

  const statusMap = {
    PENDING: {
      text: "Đang chờ",
      color: "bg-yellow-500",
    },
    CONFIRMED: {
      text: "Đã xác nhận",
      color: "bg-blue-500",
    },
    CANCELED: {
      text: "Đã xoá",
      color: "bg-red-500",
    },
    COMPLETED: {
      text: "Hoàn thành",
      color: "bg-green-500",
    },
  };

  return (
    <div className="min-h-screen p-4 rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold text-blue-800">Lịch sử đặt hẹn</h2>
      <div className="mt-4 space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-start p-4 bg-zinc-100 rounded-lg shadow-sm"
          >
            <img
              src="/assets/img/blood.png"
              alt="blood drop icon"
              className="w-14 h-14 mr-4"
            />
            <div className="flex-1">
              <h3 className="text-blue-800 font-semibold">
                {appointment.event
                  ? appointment.event.name
                  : "Thông tin sự kiện không có"}
              </h3>
              <p className="text-zinc-600">
                <span className="inline-block mr-2">
                  <img
                    src="/assets/img/local222.png"
                    alt="location icon"
                    className="inline w-4 h-4 mr-1"
                  />
                  {appointment.event
                    ? appointment.event.donationUnitDTO.location
                    : "Không có địa điểm"}
                </span>
                <br />
                <span className="inline-block">
                  <img
                    src="/assets/img/alarm.png"
                    alt="clock icon"
                    className="inline w-4 h-4 mr-1"
                  />
                  {appointment.event
                    ? `${appointment.event.eventStartTime} - ${appointment.event.eventDate}`
                    : "Không có thời gian"}
                </span>
              </p>
            </div>
            <div className="flex flex-col items-end">
              <button
                className={`${statusMap[appointment.status]?.color} text-white px-3 py-1 rounded-full mb-2`}
              >
                {statusMap[appointment.status]?.text}
              </button>
              <a href={`/appointment/${appointment.id}`} className="text-blue-600">
                Xem chi tiết
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoryAppoint;