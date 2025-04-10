import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../service/authService";
import { ROUTE_PATH } from "../../constants/routes";

function RegistrationPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // State for form data and contact info
  const [formData, setFormData] = useState({
    cccd: "",
    password: "",
    fullName: "",
    dob: "",
    sex: "",
    address: "",
  });

  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  });

  const [isForm1Complete, setIsForm1Complete] = useState(false);

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    const stateSetter = formType === "form1" ? setFormData : setContactInfo;
    stateSetter((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Combine form data and contact info
      const userData = { ...formData, ...contactInfo };

      // Register the user
      await authService.register(userData);

      // Đăng ký thành công, chuyển hướng về trang login
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate(ROUTE_PATH.LOGIN);
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra khi đăng ký");
      console.error("Registration error:", error);
    }
  };

  const handleNext = () => {
    // Validate form 1
    if (
      !formData.cccd ||
      !formData.password ||
      !formData.fullName ||
      !formData.dob ||
      !formData.sex ||
      !formData.address
    ) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Validate CCCD format (12 số)
    if (!/^\d{12}$/.test(formData.cccd)) {
      setError("CCCD phải có 12 chữ số");
      return;
    }

    // Validate password (ít nhất 6 ký tự)
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setIsForm1Complete(true);
    setError("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Đăng ký tài khoản
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* First Form Part */}
          {!isForm1Complete ? (
            <>
              <div className="mb-4">
                <label
                  htmlFor="cccd"
                  className="block text-sm font-medium text-gray-600"
                >
                  CCCD
                </label>
                <input
                  type="text"
                  id="cccd"
                  name="cccd"
                  value={formData.cccd}
                  onChange={(e) => handleInputChange(e, "form1")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                  maxLength="12"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-600"
                >
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange(e, "form1")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                  minLength="6"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-600"
                >
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange(e, "form1")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="dob"
                  className="block text-sm font-medium text-gray-600"
                >
                  Ngày sinh
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={(e) => handleInputChange(e, "form1")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="sex"
                  className="block text-sm font-medium text-gray-600"
                >
                  Giới tính
                </label>
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={(e) => handleInputChange(e, "form1")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-600"
                >
                  Địa chỉ
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange(e, "form1")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Tiếp tục
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactInfo.email}
                  onChange={(e) => handleInputChange(e, "form2")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-600"
                >
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={contactInfo.phone}
                  onChange={(e) => handleInputChange(e, "form2")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                  pattern="[0-9]{10}"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Đăng ký
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;
