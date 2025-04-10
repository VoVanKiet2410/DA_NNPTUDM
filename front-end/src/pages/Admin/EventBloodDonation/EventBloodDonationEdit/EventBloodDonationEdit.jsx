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
import { useNavigate, useParams } from "react-router-dom";
import eventService from "../../../../service/eventService";
import donationUnitService from "../../../../service/donationUnitService";

const { Title } = Typography;

const EventBloodDonationEdit = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [donationUnits, setDonationUnits] = useState([]);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventResponse, unitsResponse] = await Promise.all([
          eventService.getEventById(id),
          donationUnitService.getAllUnits(),
        ]);

        if (eventResponse.success) {
          const event = eventResponse.data;
          form.setFieldsValue({
            name: event.name,
            location: event.location,
            eventDate: moment(event.eventDate, "YYYY-MM-DD"),
            startTime: moment(event.eventStartTime, "HH:mm:ss"),
            endTime: moment(event.eventEndTime, "HH:mm:ss"),
            maxRegistrations: event.maxRegistrations,
            status: event.status,
            donationUnit: event.donationUnit,
          });
        } else {
          messageApi.error("Không thể tải thông tin sự kiện");
          navigate("/admin/event-blood-donation");
        }

        if (unitsResponse.success) {
          setDonationUnits(unitsResponse.data);
        } else {
          messageApi.error("Không thể tải danh sách đơn vị hiến máu");
        }
      } catch (error) {
        messageApi.error(error.message || "Không thể tải thông tin");
        navigate("/admin/event-blood-donation");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, form, navigate, messageApi]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formattedValues = {
        name: values.name,
        location: values.location,
        eventDate: values.eventDate.format("YYYY-MM-DD"),
        eventStartTime: values.startTime.format("HH:mm:ss"),
        eventEndTime: values.endTime.format("HH:mm:ss"),
        maxRegistrations: values.maxRegistrations,
        status: values.status,
        donationUnit: values.donationUnit,
      };

      const response = await eventService.updateEvent(id, formattedValues);
      if (response.success) {
        messageApi.success(response.message || "Cập nhật sự kiện thành công!");
        navigate("/admin/event-blood-donation");
      } else {
        messageApi.error(response.message || "Không thể cập nhật sự kiện");
      }
    } catch (error) {
      messageApi.error(
        error.message || "Không thể cập nhật sự kiện. Vui lòng thử lại!"
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
              Sửa thông tin sự kiện hiến máu
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

              <Form.Item
                name="maxRegistrations"
                label="Giới hạn đăng ký"
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Input type="number" placeholder="Nhập giới hạn đăng ký" />
              </Form.Item>

              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: "Chọn trạng thái" }]}
              >
                <Select placeholder="Select status">
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
                    {loading ? "Đang cập nhật..." : "Cập nhật"}
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

export default EventBloodDonationEdit;
