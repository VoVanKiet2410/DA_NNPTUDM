import { Button, Form, InputNumber, Select, DatePicker, message, Alert } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddBloodInventoryForm = () => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [noAppointments, setNoAppointments] = useState(false);
  const navigate = useNavigate();

  // Dữ liệu giả lập danh sách lịch hẹn
  const mockAppointments = [
    { id: 1, userId: "user001", status: "COMPLETED" },
    { id: 2, userId: "user002", status: "COMPLETED" },
    { id: 3, userId: "user003", status: "COMPLETED" },
  ];

  useEffect(() => {
    // Giả lập việc tải danh sách lịch hẹn
    const fetchMockAppointments = () => {
      setTimeout(() => {
        const completedAppointments = mockAppointments.filter(
          (appointment) => appointment.status === "COMPLETED"
        );

        if (completedAppointments.length === 0) {
          setNoAppointments(true);
        } else {
          setAppointments(completedAppointments);
          setNoAppointments(false);
        }
        setLoadingAppointments(false);
      }, 1000); // Giả lập thời gian tải dữ liệu
    };

    fetchMockAppointments();
  }, []);

  const onSubmit = (values) => {
    setLoading(true);
    // Giả lập thêm mới kho máu mà không gọi API
    setTimeout(() => {
      const payload = {
        donationType: values.donationType,
        quantity: parseInt(values.quantity),
        lastUpdated: values.lastUpdated.toISOString(),
        expirationDate: values.expirationDate.toISOString(),
        appointmentId: values.appointmentId,
      };
      console.log("Dữ liệu gửi đi:", payload); // Log dữ liệu để kiểm tra
      message.success("Thêm mới thành công!");
      setLoading(false);
      navigate("/admin/blood-donation-history");
    }, 1000); // Giả lập thời gian xử lý
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h1 className="font-semibold text-xl mb-4">Thêm mới kho máu</h1>

      {noAppointments && (
        <Alert
          message="Không có cuộc hẹn nào đạt đủ điều kiện. Vui lòng cập nhật lại trạng thái lịch hẹn."
          type="warning"
          showIcon
          className="mb-4"
        />
      )}

      <Form
        layout="vertical"
        onFinish={onSubmit}
        className="max-w-lg mx-auto"
        disabled={noAppointments}
      >
        {/* Loại máu */}
        <Form.Item
          name="donationType"
          label="Loại máu"
          rules={[{ required: true, message: "Vui lòng chọn loại máu" }]}
        >
          <Select
            placeholder="Chọn loại máu"
            options={[
              { label: "A", value: "A" },
              { label: "B", value: "B" },
              { label: "AB", value: "AB" },
              { label: "O", value: "O" },
            ]}
          />
        </Form.Item>

        {/* Số lượng */}
        <Form.Item
          name="quantity"
          label="Số lượng (ml)"
          rules={[
            { required: true, message: "Vui lòng nhập số lượng máu" },
            { type: "number", min: 1, message: "Số lượng máu phải lớn hơn 0" },
          ]}
        >
          <InputNumber placeholder="Nhập số lượng (ml)" min={1} style={{ width: "100%" }} />
        </Form.Item>

        {/* Ngày cập nhật */}
        <Form.Item
          name="lastUpdated"
          label="Ngày cập nhật"
          rules={[{ required: true, message: "Vui lòng chọn ngày cập nhật" }]}
        >
          <DatePicker placeholder="Chọn ngày cập nhật" format="DD/MM/YYYY" style={{ width: "100%" }} />
        </Form.Item>

        {/* Ngày hết hạn */}
        <Form.Item
          name="expirationDate"
          label="Ngày hết hạn"
          rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn" }]}
        >
          <DatePicker placeholder="Chọn ngày hết hạn" format="DD/MM/YYYY" style={{ width: "100%" }} />
        </Form.Item>

        {/* Lịch hẹn */}
        <Form.Item
          name="appointmentId"
          label="Lịch hẹn"
          rules={[{ required: true, message: "Vui lòng chọn lịch hẹn" }]}
        >
          <Select
            loading={loadingAppointments}
            placeholder="Chọn lịch hẹn"
            options={appointments.map((appointment) => ({
              label: `ID: ${appointment.id} - ${appointment.userId}`,
              value: appointment.id,
            }))}
          />
        </Form.Item>

        <Button
          htmlType="submit"
          type="primary"
          loading={loading}
          className="w-full"
          disabled={noAppointments}
        >
          Thêm mới
        </Button>
      </Form>
    </div>
  );
};

export default AddBloodInventoryForm;