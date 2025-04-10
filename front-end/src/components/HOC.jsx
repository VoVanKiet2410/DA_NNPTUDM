import React, { useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import authService from "../service/authService";

export const GuestRoute = ({ element: Component }) => {
  const location = useLocation();

  // Nếu đã đăng nhập và không phải đang ở trang login, chuyển hướng về trang chủ
  if (authService.isAuthenticated() && location.pathname !== "/login") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Nếu chưa đăng nhập, hiển thị component
  return Component;
};

export const ProtectedRoute = ({ element, ...rest }) => {
  // Kiểm tra nếu có token (nghĩa là người dùng đã đăng nhập)
  // const isAuthenticated = Cookies.get('token');
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    // Nếu người dùng chưa đăng nhập, chuyển hướng họ về trang login
    return <Navigate to="/login" />;
  }

  // Nếu người dùng đã đăng nhập, hiển thị element tương ứng
  return element;
};

export const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const result = await authService.isAdmin();
        setIsAdmin(result);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  // Nếu không phải admin, chuyển hướng về trang chủ
  if (!isAdmin) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Nếu là admin, cho phép truy cập các route con
  return <Outlet />;
};

export default AdminRoute;
