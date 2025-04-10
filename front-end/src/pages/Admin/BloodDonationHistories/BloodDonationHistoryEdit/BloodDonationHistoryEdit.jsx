import { Button, Flex, Form, Input, Select, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const BloodDonationHistoryEdit = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // Giả lập dữ liệu ban đầu (như khi chỉnh sửa một bản ghi thực tế)
  const initialValues = {
    type: 1, // Loại hiến máu mặc định
    receivingFacility: "Bệnh viện Chợ Rẫy",
    donationUnitAddress: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    donor: "Nguyễn Văn A",
    event: "Sự kiện hiến máu tháng 3",
    status: 1, // Trạng thái mặc định
  };

  const onSubmit = (values) => {
    console.log("Dữ liệu chỉnh sửa:", values);
    // Giả lập lưu thành công
    messageApi.success("Lịch sử hiến máu đã được cập nhật thành công!");
    setTimeout(() => {
      navigate("/admin/blood-donation-history"); // Điều hướng sau khi "lưu"
    }, 1000); // Giả lập thời gian xử lý
  };

  return (
    <>
      {contextHolder}
      <Flex align="center" justify="space-between">
        <h1 className="font-semibold text-xl">Chỉnh sửa lịch sử hiến máu</h1>
      </Flex>

      <Form
        className="mt-6"
        layout="vertical"
        onFinish={onSubmit}
        form={form}
        initialValues={initialValues} // Gán giá trị mặc định
      >
        <Form.Item
          name="type"
          label="Loại hiến máu"
          rules={[
            {
              required: true,
              message: "Trường này là bắt buộc",
            },
          ]}
        >
          <Select
            placeholder="Chọn loại hiến máu"
            options={[
              { label: "Toàn phần", value: 1 },
              { label: "Huyết tương", value: 2 },
              { label: "Tiểu cầu", value: 3 },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="receivingFacility"
          label="Cơ sở nhận máu"
          rules={[
            {
              required: true,
              message: "Trường này là bắt buộc",
            },
          ]}
        >
          <Input placeholder="Nhập cơ sở nhận máu" />
        </Form.Item>

        <Form.Item
          name="donationUnitAddress"
          label="Địa chỉ đơn vị hiến máu"
          rules={[
            {
              required: true,
              message: "Trường này là bắt buộc",
            },
          ]}
        >
          <Input placeholder="Nhập địa chỉ đơn vị" />
        </Form.Item>

        <Form.Item
          name="donor"
          label="Người hiến máu"
          rules={[
            {
              required: true,
              message: "Trường này là bắt buộc",
            },
          ]}
        >
          <Input placeholder="Nhập tên người hiến máu" />
        </Form.Item>

        <Form.Item
          name="event"
          label="Sự kiện"
          rules={[
            {
              required: true,
              message: "Trường này là bắt buộc",
            },
          ]}
        >
          <Input placeholder="Nhập tên sự kiện" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[
            {
              required: true,
              message: "Trường này là bắt buộc",
            },
          ]}
        >
          <Select
            placeholder="Chọn trạng thái"
            options={[
              { label: "Đã hoàn thành", value: 1 },
              { label: "Đang xử lý", value: 2 },
              { label: "Hủy bỏ", value: 3 },
            ]}
          />
        </Form.Item>

        <Button htmlType="submit" type="primary">
          Lưu
        </Button>
      </Form>
    </>
  );
};

export default BloodDonationHistoryEdit;