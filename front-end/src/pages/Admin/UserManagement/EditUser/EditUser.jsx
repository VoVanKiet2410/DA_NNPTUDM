import {
  Button,
  Form,
  Input,
  Select,
  message,
  Card,
  Spin,
  DatePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserService from "../../../../service/userService";
import moment from "moment";
import { RollbackOutlined, SaveOutlined } from "@ant-design/icons";

const EditUser = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await UserService.getUserById(username);

        if (response.success && response.user) {
          const user = response.user;
          console.log("User data:", user); // Debug
          setUserData(user);

          // Format DOB for DatePicker
          const dobMoment = user.userInfoDTO.dob
            ? moment(user.userInfoDTO.dob)
            : null;

          // Set initial form values
          form.setFieldsValue({
            cccd: username,
            fullName: user.userInfoDTO.fullName,
            phone: user.userInfoDTO.phone,
            email: user.userInfoDTO.email,
            address: user.userInfoDTO.address,
            dob: dobMoment,
            sex: user.userInfoDTO.sex || "male",
          });
        } else {
          messageApi.error("Không tìm thấy thông tin người dùng");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        messageApi.error(
          "Lỗi khi tải thông tin người dùng: " +
            (error.message || "Đã xảy ra lỗi")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, form, messageApi]);

  const onFinish = async (values) => {
    try {
      setSubmitting(true);

      // Format DOB to string format for backend
      const dataToSend = {
        ...values,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
      };

      const response = await UserService.updateUser(username, dataToSend);

      if (response.success) {
        messageApi.success("Cập nhật thông tin người dùng thành công");

        // Chuyển hướng về trang danh sách người dùng sau 1.5 giây
        setTimeout(() => {
          navigate("/admin/user");
        }, 1500);
      } else {
        messageApi.error(
          response.message || "Không thể cập nhật thông tin người dùng"
        );
      }
    } catch (error) {
      console.error("Error updating user:", error);
      messageApi.error(
        "Lỗi khi cập nhật thông tin: " + (error.message || "Đã xảy ra lỗi")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/user");
  };

  return (
    <>
      {contextHolder}
      <Card
        title="Chỉnh sửa thông tin người dùng"
        className="shadow-md"
        extra={
          <Button icon={<RollbackOutlined />} onClick={handleCancel}>
            Quay lại
          </Button>
        }
      >
        {loading ? (
          <div className="flex justify-center items-center p-10">
            <Spin size="large" tip="Đang tải..." />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="max-w-3xl mx-auto"
            requiredMark={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="cccd"
                label="CCCD/CMND"
                rules={[{ required: true, message: "Trường này là bắt buộc" }]}
              >
                <Input placeholder="Nhập CCCD/CMND" disabled />
              </Form.Item>

              <Form.Item
                name="fullName"
                label="Họ tên"
                rules={[
                  { required: true, message: "Trường này là bắt buộc" },
                  {
                    max: 35,
                    message: "Họ tên không được quá 35 ký tự",
                  },
                ]}
              >
                <Input placeholder="Nhập họ tên" />
              </Form.Item>

              <Form.Item name="dob" label="Ngày sinh">
                <DatePicker
                  placeholder="Chọn ngày sinh"
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>

              <Form.Item
                name="sex"
                label="Giới tính"
                rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Select.Option value="male">Nam</Select.Option>
                  <Select.Option value="female">Nữ</Select.Option>
                  <Select.Option value="other">Khác</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Trường này là bắt buộc" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Số điện thoại phải có 10 chữ số",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Trường này là bắt buộc" },
                  {
                    type: "email",
                    message: "Vui lòng nhập đúng định dạng email",
                  },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>

              <Form.Item
                name="address"
                label="Địa chỉ"
                className="md:col-span-2"
                rules={[{ required: true, message: "Trường này là bắt buộc" }]}
              >
                <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
              </Form.Item>
            </div>

            <Form.Item className="mt-4 flex justify-center">
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                icon={<SaveOutlined />}
                size="large"
              >
                Lưu thông tin
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </>
  );
};

export default EditUser;
