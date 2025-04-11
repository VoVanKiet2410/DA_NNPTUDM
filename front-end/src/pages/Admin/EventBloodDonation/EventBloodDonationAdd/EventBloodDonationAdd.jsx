import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  message,
  Row,
  Col,
  Typography,
} from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import eventService from "../../../../service/eventService";
import donationUnitService from "../../../../service/donationUnitService";

const { Title } = Typography;

const EventBloodDonationAdd = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [donationUnits, setDonationUnits] = useState([]);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchDonationUnits = async () => {
      try {
        const response = await donationUnitService.getAllUnits();
        if (response.success) {
          setDonationUnits(response.data);
        } else {
          messageApi.error("Không thể tải danh sách đơn vị hiến máu");
        }
      } catch (error) {
        messageApi.error("Lỗi khi tải danh sách đơn vị hiến máu");
      }
    };

    fetchDonationUnits();
  }, [messageApi]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formattedValues = {
        name: values.name,
        location: values.location,
        eventDate: values.eventDate.format("YYYY-MM-DD"),
        eventStartTime: values.startTime.format("HH:mm:ss"),
        eventEndTime: values.endTime.format("HH:mm:ss"),
        maxRegistrations: parseInt(values.maxRegistrations),
        currentRegistrations: 0,
        status: values.status,
        donationUnit: values.donationUnit,
      };

      const response = await eventService.addEvent(formattedValues);

      if (response.success) {
        messageApi.success(response.message || "Tạo sự kiện thành công!");
        navigate("/admin/event-blood-donation");
      } else {
        messageApi.error(
          response.message || "Không thể tạo sự kiện. Vui lòng thử lại!"
        );
      }
    } catch (error) {
      messageApi.error(
        error.message || "Không thể tạo sự kiện. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="p-5 bg-[#f5f5f5] min-h-screen">
        <Row justify="center">
          <Col span={12}>
            <Title level={2} className="text-center mb-5">
              Thêm sự kiện hiến máu mới
            </Title>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="bg-white p-5 rounded-lg shadow-lg"
            >
              <Form.Item
                name="name"
                label="Tên sự kiện"
                rules={[{ required: true, message: "Không được để trống" }]}
              >
                <Input placeholder="Nhập tên sự kiện" />
              </Form.Item>

              <Form.Item
                name="donationUnit"
                label="Đơn vị hiến máu"
                rules={[
                  { required: true, message: "Vui lòng chọn đơn vị hiến máu" },
                ]}
              >
                <Select placeholder="Chọn đơn vị hiến máu">
                  {donationUnits.map((unit) => (
                    <Select.Option key={unit._id} value={unit._id}>
                      {unit.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="location"
                label="Địa chỉ"
                rules={[{ required: true, message: "Không được để trống" }]}
              >
                <Input placeholder="Nhập thông tin địa chỉ" />
              </Form.Item>

              <Form.Item
                name="eventDate"
                label="Ngày diễn ra"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày sự kiện" },
                ]}
              >
                <DatePicker
                  placeholder="Chọn ngày"
                  format="YYYY-MM-DD"
                  className="w-full"
                  disabledDate={(current) =>
                    current && current < moment().startOf("day")
                  }
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="startTime"
                    label="Thời gian bắt đầu"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn thời gian bắt đầu",
                      },
                    ]}
                  >
                    <TimePicker
                      placeholder="Chọn thời gian bắt đầu"
                      format="HH:mm"
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="endTime"
                    label="Thời gian kết thúc"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn thời gian kết thúc",
                      },
                    ]}
                  >
                    <TimePicker
                      placeholder="Chọn thời gian kết thúc"
                      format="HH:mm"
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* <Form.Item
                name="maxRegistrations"
                label="Giới hạn đăng ký"
                rules={[
                  { required: true, message: "Vui lòng nhập giới hạn đăng ký" },
                  {
                    type: "number",
                    min: 1,
                    message: "Giới hạn đăng ký phải lớn hơn 0",
                  },
                ]}
              >
                <Input type="number" placeholder="Nhập giới hạn đăng ký" />
              </Form.Item> */}
              <Form.Item
                name="maxRegistrations"
                label="Giới hạn đăng ký"
                rules={[
                  { required: true, message: "Vui lòng nhập giới hạn đăng ký" },
                  {
                    type: "number",
                    min: 1,
                    message: "Giới hạn đăng ký phải lớn hơn 0",
                  },
                ]}
                getValueFromEvent={(e) => {
                  const value = parseInt(e.target.value, 10); // Chuyển đổi chuỗi thành số
                  return isNaN(value) ? undefined : value; // Trả về undefined nếu không hợp lệ
                }}
              >
                <Input
                  type="number"
                  placeholder="Nhập giới hạn đăng ký"
                  onChange={(e) => {
                    console.log("Giá trị nhập vào:", e.target.value);
                    console.log("Kiểu dữ liệu nhập vào:", typeof e.target.value);
                  }}
                />
              </Form.Item>

              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: "Chọn trạng thái" }]}
                initialValue="ACTIVE"
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="ACTIVE">Đang hoạt động</Select.Option>
                  <Select.Option value="DONE">Đã kết thúc</Select.Option>
                  <Select.Option value="FULL">Đã đầy</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <div className="flex justify-between">
                  <Button
                    onClick={() => navigate("/admin/event-blood-donation")}
                    className="bg-gray-200 text-black hover:bg-gray-300"
                  >
                    Hủy
                  </Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    {loading ? "Đang tạo..." : "Tạo sự kiện"}
                    
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default EventBloodDonationAdd;
