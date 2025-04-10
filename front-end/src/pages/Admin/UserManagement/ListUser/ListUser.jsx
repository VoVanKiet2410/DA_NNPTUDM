import {
  Flex,
  Input,
  Popconfirm,
  Table,
  Button,
  Select,
  Modal,
  message,
  Tag,
  Alert,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserSwitchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";
import UserService from "../../../../service/userService";

const ListUser = () => {
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal quản lý vai trò
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  // Lấy danh sách người dùng từ API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await UserService.getAllUsers();
      console.log("Users response:", response); // Debug

      if (
        response.success &&
        response.userList &&
        Array.isArray(response.userList)
      ) {
        setUsers(response.userList);
        if (response.userList.length === 0) {
          setError("Danh sách người dùng trống");
        }
      } else {
        const errorMsg =
          response.message || "Không thể tải danh sách người dùng";
        setError(`Lỗi: ${errorMsg}. Kiểm tra console để biết thêm chi tiết.`);
        console.error("Lỗi cấu trúc phản hồi:", response);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(
        `Lỗi kết nối: ${
          error.message || "Không xác định"
        }. Kiểm tra console để biết thêm chi tiết.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm xử lý tìm kiếm
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  // Xử lý tải lại danh sách
  const handleRefresh = () => {
    fetchUsers();
  };

  // Lọc người dùng theo từ khóa tìm kiếm
  const filteredUsers = users.filter(
    (user) =>
      user.userInfoDTO.fullName
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      user.username.toLowerCase().includes(searchText.toLowerCase())
  );

  // Mở modal cập nhật vai trò
  const handleSetRole = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role.name.toLowerCase()); // Chuyển sang chữ thường cho API
    setIsRoleModalVisible(true);
  };

  // Lưu thay đổi vai trò
  const handleSaveRole = async () => {
    try {
      setLoading(true);
      const response = await UserService.updateUserRole(
        selectedUser.username,
        selectedRole
      );

      if (response.success) {
        message.success("Cập nhật vai trò thành công");
        await fetchUsers(); // Tải lại danh sách người dùng
        setIsRoleModalVisible(false);
      } else {
        message.error(response.message || "Không thể cập nhật vai trò");
      }
    } catch (error) {
      message.error(
        "Lỗi khi cập nhật vai trò: " + (error.message || "Đã xảy ra lỗi")
      );
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý xóa người dùng
  const handleDeleteUser = async (username) => {
    try {
      setLoading(true);
      const response = await UserService.deleteUser(username);

      if (response.success) {
        message.success("Xóa người dùng thành công");
        await fetchUsers(); // Tải lại danh sách người dùng
      } else {
        message.error(response.message || "Không thể xóa người dùng");
      }
    } catch (error) {
      message.error(
        "Lỗi khi xóa người dùng: " + (error.message || "Đã xảy ra lỗi")
      );
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị vai trò với màu sắc
  const renderRole = (role) => {
    let color = "default";
    let displayName = role.name.toUpperCase();

    switch (role.name.toLowerCase()) {
      case "admin":
        color = "red";
        break;
      case "user":
        color = "blue";
        break;
      default:
        color = "default";
    }

    return <Tag color={color}>{displayName}</Tag>;
  };

  // Cấu hình các cột của bảng
  const columns = [
    {
      title: "CCCD",
      key: "username",
      dataIndex: "username",
    },
    {
      title: "Họ tên",
      key: "fullName",
      render: (record) => record.userInfoDTO.fullName,
    },
    {
      title: "Email",
      key: "email",
      render: (record) => record.userInfoDTO.email,
    },
    {
      title: "Số điện thoại",
      key: "phone",
      render: (record) => record.userInfoDTO.phone,
    },
    {
      title: "Vai trò",
      key: "role",
      render: (record) => renderRole(record.role),
    },
    // {
    //   title: "Trạng thái",
    //   key: "status",
    //   render: (record) => (
    //     <Tag color={record.isActive ? "green" : "red"}>
    //       {record.isActive ? "Hoạt động" : "Bị khóa"}
    //     </Tag>
    //   ),
    // },
    {
      title: "Hành động",
      key: "actions",
      render: (record) => {
        return (
          <Flex gap="8px">
            {/* Set role button */}
            <Button
              type="primary"
              icon={<UserSwitchOutlined />}
              size="small"
              onClick={() => handleSetRole(record)}
            >
              Phân quyền
            </Button>

            {/* Edit user button */}
            <Link to={ROUTE_PATH.EDIT_USER(record.username)}>
              <Button type="default" icon={<EditOutlined />} size="small">
                Chỉnh sửa
              </Button>
            </Link>

            {/* Delete user */}
            <Popconfirm
              title="Xóa người dùng này?"
              description="Bạn có chắc chắn muốn xóa người dùng này?"
              onConfirm={() => handleDeleteUser(record.username)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
              >
                Xóa
              </Button>
            </Popconfirm>
          </Flex>
        );
      },
    },
  ];

  // Phân trang
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Hiển thị trạng thái xác thực
  const renderAuthStatus = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    return (
      <div className="mb-4 text-xs">
        <p>
          <strong>Trạng thái xác thực:</strong>{" "}
          {token ? "Đã đăng nhập" : "Chưa đăng nhập"}
        </p>
        {token && (
          <p>
            <strong>Token:</strong> {token.substring(0, 20)}...
          </p>
        )}
        {role && (
          <p>
            <strong>Vai trò:</strong> {role}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      <Flex align="center" justify="space-between" className="mb-4">
        <h1 className="font-semibold text-xl">Quản lý người dùng</h1>

        <Flex gap="8px">
          <Input
            placeholder="Tìm kiếm bằng CCCD hoặc họ tên..."
            className="w-64"
            suffix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Tải lại
          </Button>
        </Flex>
      </Flex>

      {renderAuthStatus()}

      {error && (
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="username"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredUsers.length,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total) => `Tổng cộng ${total} người dùng`,
        }}
        onChange={handleTableChange}
        locale={{
          emptyText: "Không có dữ liệu người dùng",
        }}
      />

      {/* Modal phân quyền người dùng */}
      <Modal
        title="Phân quyền người dùng"
        open={isRoleModalVisible}
        onOk={handleSaveRole}
        onCancel={() => setIsRoleModalVisible(false)}
        confirmLoading={loading}
      >
        {selectedUser && (
          <>
            <p>
              <strong>Người dùng:</strong> {selectedUser.userInfoDTO.fullName}
            </p>
            <p>
              <strong>CCCD:</strong> {selectedUser.username}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.userInfoDTO.email}
            </p>

            <div className="my-4">
              <label className="block mb-2">Chọn vai trò:</label>
              <Select
                style={{ width: "100%" }}
                value={selectedRole}
                onChange={(value) => setSelectedRole(value)}
              >
                <Select.Option value="user">Người dùng</Select.Option>
                <Select.Option value="admin">Quản trị viên</Select.Option>
              </Select>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default ListUser;
