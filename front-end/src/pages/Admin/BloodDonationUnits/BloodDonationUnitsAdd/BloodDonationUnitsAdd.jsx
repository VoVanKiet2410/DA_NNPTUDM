import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Typography,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import donationUnitService from "../../../../service/donationUnitService";

const { Title } = Typography;

const BloodDonationUnitsAdd = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // Tạo FormData để gửi file
      const formData = {
        name: values.unitsName,
        location: values.location,
        email: values.email,
        phone: values.phone,
        unitPhotoUrl: values.photo ? values.photo[0].thumbUrl : null,
      };

      const response = await donationUnitService.createUnit(formData);
      if (response.success) {
        message.success("Thêm đơn vị thành công!");
        navigate("/admin/blood-donation-units");
      } else {
        message.error(response.message || "Không thể thêm đơn vị");
      }
    } catch (error) {
      message.error(error.message || "Đã có lỗi xảy ra khi thêm đơn vị");
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <Row justify="center">
        <Col span={12}>
          <Title level={2} className="text-center mb-5">
            Thêm Đơn Vị Hiến Máu
          </Title>

          <Form
            layout="vertical"
            onFinish={handleSubmit}
            className="bg-white p-5 rounded-lg shadow-md"
          >
            <Form.Item
              name="unitsName"
              label="Tên Đơn Vị"
              rules={[{ required: true, message: "Trường này là bắt buộc" }]}
            >
              <Input placeholder="Nhập tên đơn vị" />
            </Form.Item>

            <Form.Item
              name="location"
              label="Địa Điểm"
              rules={[{ required: true, message: "Trường này là bắt buộc" }]}
            >
              <Input placeholder="Nhập địa điểm" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Trường này là bắt buộc" },
                { type: "email", message: "Vui lòng nhập một email hợp lệ" },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số Điện Thoại"
              rules={[
                { required: true, message: "Trường này là bắt buộc" },
                {
                  pattern: /^[0-9]+$/,
                  message: "Vui lòng nhập số điện thoại hợp lệ",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              name="photo"
              label="Tải Lên Ảnh"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                name="photo"
                listType="picture"
                maxCount={1}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Nhấn để tải lên</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                {loading ? "Đang thêm..." : "Thêm đơn vị"}
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default BloodDonationUnitsAdd;
