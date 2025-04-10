import React, { useState } from "react";
import { Card, Form, Radio, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

const HealthCheckForm = ({ onTabChange }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hasDonatedBefore: null,
    hasChronicDiseases: null,
    hasRecentDiseases: null,
    hasSymptoms: null,
    isPregnantOrNursing: null,
    HIVTestAgreement: null,
    notes: "",
  });

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    // Kiểm tra xem tất cả các trường đã được điền chưa
    const isFormComplete = Object.values(formData).every(
      (value) => value !== null
    );

    if (!isFormComplete) {
      message.error("Vui lòng điền đầy đủ thông tin khảo sát!");
      return;
    }

    // Kiểm tra các điều kiện không được phép hiến máu
    if (
      formData.hasChronicDiseases === true ||
      formData.hasRecentDiseases === true ||
      formData.hasSymptoms === true ||
      formData.isPregnantOrNursing === true ||
      formData.HIVTestAgreement === false
    ) {
      message.error(
        "Bạn không đủ điều kiện để hiến máu. Vui lòng tham khảo thêm thông tin về điều kiện hiến máu."
      );
      return;
    }

    // Nếu đủ điều kiện, hiển thị thông báo thành công
    message.success("Khảo sát đã được gửi thành công!");
    // Chuyển hướng về trang appointments
    navigate("/appointments");
  };

  const fieldLabels = {
    hasDonatedBefore: "Bạn đã từng hiến máu trước đây chưa?",
    hasChronicDiseases: "Bạn có mắc các bệnh mãn tính không?",
    hasRecentDiseases: "Bạn có mắc các bệnh gần đây không?",
    hasSymptoms: "Bạn có triệu chứng nào không?",
    isPregnantOrNursing: "Bạn đang mang thai hoặc cho con bú?",
    HIVTestAgreement: "Bạn đồng ý làm xét nghiệm HIV không?",
    notes: "Ghi chú bổ sung",
  };

  return (
    <div className="health-check-container">
      <Card title="Khảo sát sức khỏe" className="health-check-card my-4">
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item>
            <p>Vui lòng hoàn thành khảo sát sức khỏe trước khi tiếp tục:</p>
          </Form.Item>
          {Object.keys(formData).map((key) =>
            key !== "notes" ? (
              <Form.Item label={fieldLabels[key]} key={key}>
                <Radio.Group
                  onChange={(e) => handleChange(key, e.target.value)}
                  value={formData[key]}
                >
                  <Radio value={true}>Có</Radio>
                  <Radio value={false}>Không</Radio>
                </Radio.Group>
              </Form.Item>
            ) : (
              <Form.Item label={fieldLabels[key]} key={key}>
                <Input.TextArea
                  name={key}
                  value={formData[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  rows={4}
                  placeholder="Nhập ghi chú bổ sung tại đây..."
                />
              </Form.Item>
            )
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Gửi khảo sát
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default HealthCheckForm;
