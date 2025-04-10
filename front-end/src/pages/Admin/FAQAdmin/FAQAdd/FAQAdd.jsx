import React, { useState } from "react";
import { Button, Form, Input, notification, Row, Col, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import faqService from "../../../../service/faqService";

const { Title } = Typography;

const FaqAdd = () => {
  const [loading, setLoading] = useState(false);
  const [faqData, setFaqData] = useState({
    title: "",
    description: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFaqData({
      ...faqData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await faqService.createFAQs(faqData);
      notification.success({
        message: "Thành công",
        description: "FAQ đã được thêm thành công!",
      });
      navigate("/admin/faqs");
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: error.message || "Đã xảy ra lỗi khi thêm FAQ.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 max-w-[700px] mx-auto">
      <Title level={2} className="text-center mb-5">
        Thêm Câu Hỏi Thường Gặp (FAQ)
      </Title>

      <Form
        onFinish={handleSubmit}
        layout="vertical"
        className="bg-white p-5 rounded-lg shadow-lg"
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Tiêu Đề"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề câu hỏi." }]}
            >
              <Input
                name="title"
                value={faqData.title}
                onChange={handleInputChange}
                placeholder="Nhập tiêu đề câu hỏi"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Mô Tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả câu hỏi." }]}
            >
              <Input.TextArea
                name="description"
                value={faqData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Nhập mô tả câu hỏi"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            className="bg-[#1890ff] border-[#1890ff] text-white font-bold"
          >
            {loading ? "Đang gửi..." : "Thêm câu hỏi"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FaqAdd;