import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import authService from "../../service/authService";
import appointmentService from "../../service/appointmentService";

const Appointments = () => {
  const navigate = useNavigate();
  const [profileInfo, setProfileInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { confirm } = Modal;

  // Hàm chuyển đổi giới tính
  const getGenderDisplay = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      case "other":
        return "Khác";
      default:
        return "-";
    }
  };

  // Hàm định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  };

  // Hàm xóa đơn đăng ký
  const handleDeleteAppointment = () => {
    confirm({
      title: "Bạn có chắc chắn muốn hủy đơn đăng ký hiến máu?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          if (appointments && appointments.length > 0) {
            const appointmentId = appointments[0]._id;
            await appointmentService.deleteAppointment(appointmentId);
            await authService.updateProfile({ hasAppointment: false });
            
            // Cập nhật lại trạng thái
            setProfileInfo(prev => ({
              ...prev,
              hasAppointment: false
            }));
            
            message.success("Đã hủy đơn đăng ký hiến máu thành công!");
          } else {
            throw new Error("Không tìm thấy thông tin đăng ký!");
          }
        } catch (error) {
          message.error("Có lỗi xảy ra: " + error.message);
        }
      },
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Lấy thông tin profile
        const profileResponse = await authService.getProfile();
        setProfileInfo(profileResponse);
        
        // Nếu có appointment, lấy thông tin appointments
        if (profileResponse?.hasAppointment) {
          const appointmentsResponse = await appointmentService.getUserAppointments();
          if (appointmentsResponse.success && appointmentsResponse.data) {
            setAppointments(appointmentsResponse.data);
          }
        }
      } catch (err) {
        setError(err.message || "Không thể tải thông tin người dùng");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="bg-zinc-100 min-h-screen p-4 flex items-center justify-center">
        <div className="text-xl text-blue-800">Đang tải thông tin...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-100 min-h-screen p-4 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-100 min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-md my-2 p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">
          Thông tin đăng ký hiến máu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">
              Thông tin cá nhân
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Họ và tên:</span>
                <span>{profileInfo?.fullName || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Số CMND:</span>
                <span>{profileInfo?.cccd || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Ngày sinh:</span>
                <span>{formatDate(profileInfo?.dob) || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Giới tính:</span>
                <span>{getGenderDisplay(profileInfo?.sex) || "-"}</span>
              </div>
            </div>
          </div>
          <div className="bg-zinc-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">
              Thông tin liên hệ
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Địa chỉ liên lạc:</span>
                <span>{profileInfo?.address || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Điện thoại di động:</span>
                <span>{profileInfo?.phone || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{profileInfo?.email || "-"}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-zinc-50 rounded-lg p-4 mt-4">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">
            Phiếu đăng ký hiến máu
          </h3>
          <div className="flex flex-col items-center justify-center h-full">
            <img
              src="/assets/img/phieuDangky.png"
              alt="Document Icon"
              className="mb-4 w-[140px]"
            />
            {profileInfo?.hasAppointment ? (
              <div className="text-center">
                <p className="text-green-700 font-medium">Bạn đã đăng ký hiến máu</p>
                {appointments && appointments.length > 0 && (
                  <div className="mt-2 text-left mx-auto max-w-md">
                    <p><span className="font-medium">Sự kiện:</span> {appointments[0].event?.name || "-"}</p>
                    <p><span className="font-medium">Ngày:</span> {formatDate(appointments[0].event?.eventDate) || "-"}</p>
                    <p><span className="font-medium">Địa điểm:</span> {appointments[0].event?.location || "-"}</p>
                    <p><span className="font-medium">Thời gian:</span> {appointments[0].event?.eventStartTime?.slice(0, 5) || "-"} - {appointments[0].event?.eventEndTime?.slice(0, 5) || "-"}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-zinc-500">Chưa có phiếu đăng ký hiến máu</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-center mt-6">
          {profileInfo?.hasAppointment ? (
            <button
              onClick={handleDeleteAppointment}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Hủy đơn đăng ký
            </button>
          ) : (
            <button
              onClick={() => navigate("/events")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Đăng ký hiến máu
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;