import React, { useEffect, useState } from "react";
import authService from "../../service/authService";

function Profile() {
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
        console.log("Profile response:", response); // Để debug

        // Kiểm tra và xử lý dữ liệu trả về
        if (response) {
          setProfileInfo(response);
        } else {
          throw new Error("Không lấy được thông tin profile");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err.message || "Không thể tải thông tin người dùng");
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
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">
          Thông tin cá nhân
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">
              Thông tin cá nhân
            </h3>
            <div className="space-y-2">
              <ProfileRow label="Số CMND" value={profileInfo?.cccd} />
              <ProfileRow label="Họ và tên" value={profileInfo?.fullName} />
              <ProfileRow
                label="Ngày sinh"
                value={formatDate(profileInfo?.dob)}
              />
              <ProfileRow
                label="Giới tính"
                value={getGenderDisplay(profileInfo?.sex)}
              />
            </div>
          </div>

          <div className="bg-zinc-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">
              Thông tin liên hệ
            </h3>
            <div className="space-y-2">
              <ProfileRow
                label="Địa chỉ liên lạc"
                value={profileInfo?.address}
              />
              <ProfileRow
                label="Điện thoại di động"
                value={profileInfo?.phone}
              />
              <ProfileRow label="Email" value={profileInfo?.email} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="font-medium">{label}:</span>
      <span>{value || "Chưa cập nhật"}</span>
    </div>
  );
}

export default Profile;
