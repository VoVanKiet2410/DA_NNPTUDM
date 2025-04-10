import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../service/authService";

const Appointments = () => {
  const navigate = useNavigate();
  const [profileInfo, setProfileInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await authService.getProfile();
        console.log("Profile response in Appointments:", response); // Để debug

        // Kiểm tra và xử lý dữ liệu trả về
        if (response) {
          setProfileInfo(response);
        } else {
          throw new Error("Không lấy được thông tin profile");
        }
      } catch (err) {
        setError(err.message || "Không thể tải thông tin người dùng");
        console.error("Error fetching user profile in Appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
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
              <p className="text-red-700">Bạn đã đăng ký hiến máu</p>
            ) : (
              <p className="text-zinc-500">Chưa có phiếu đăng ký hiến máu</p>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-6">
          {profileInfo?.hasAppointment ? (
            <button
              onClick={() => alert("Xóa đơn đăng ký (chỉ là demo)")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Xóa đơn đăng ký
            </button>
          ) : (
            <button
              onClick={() => navigate("/events")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
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
