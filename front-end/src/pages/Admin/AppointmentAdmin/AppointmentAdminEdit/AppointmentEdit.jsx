import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Select, Button, message, Spin } from "antd";

const { Option } = Select;

const EditAppointmentForm = () => {
  const { id } = useParams(); // Lấy ID cuộc hẹn từ URL
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  // Dữ liệu giả lập thay vì gọi API
  const mockAppointment = {
    id: id,
    status: "PENDING", // Trạng thái mặc định
  };

  useEffect(() => {
    // Giả lập việc tải dữ liệu
    const fetchMockData = () => {
      setTimeout(() => {
        setAppointment(mockAppointment);
        setStatus(mockAppointment.status);
        setLoading(false);
      }, 1000); // Giả lập thời gian tải dữ liệu
    };

    fetchMockData();
  }, [id]);

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleUpdate = () => {
    setLoading(true);
    // Giả lập cập nhật trạng thái mà không gọi API
    setTimeout(() => {
      messageApi.success("Trạng thái cuộc hẹn đã được cập nhật thành công!");
      setLoading(false);
      navigate("/admin/appointments");
    }, 1000); // Giả lập thời gian xử lý
  };

  if (loading) {
    return <Spin tip="Đang tải thông tin cuộc hẹn..." />;
  }

  return (
    <div className="edit-appointment-form">
      {contextHolder}
      <h2>Chỉnh sửa trạng thái cuộc hẹn</h2>
      {appointment ? (
        <Form layout="vertical" onFinish={handleUpdate}>
          <Form.Item label="Trạng thái hiện tại">
            <Select
              value={status}
              onChange={handleStatusChange}
              placeholder="Chọn trạng thái"
            >
              <Option value="PENDING">Đang chờ</Option>
              <Option value="CONFIRMED">Đã xác nhận</Option>
              <Option value="CANCELED">Đã hủy</Option>
              <Option value="COMPLETED">Hoàn thành</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <p>Không tìm thấy thông tin cuộc hẹn.</p>
      )}
    </div>
  );
};

export default EditAppointmentForm;