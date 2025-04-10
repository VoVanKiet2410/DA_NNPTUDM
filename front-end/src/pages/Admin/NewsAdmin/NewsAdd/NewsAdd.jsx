import React, { useState } from "react";
import { Button, Flex, Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import newsService from "../../../../service/newsService";

const NewsAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const { title, content, photo } = values;

      // Đọc file ảnh thành base64
      let imageUrl = "";
      if (photo && photo[0]?.originFileObj) {
        imageUrl = await convertFileToBase64(photo[0].originFileObj);
      }

      // Đảm bảo URL API đúng
      const response = await newsService.createNews({
        title,
        content,
        imageUrl: imageUrl,
      });
      if (response.success) {
        message.success("Thêm tin tức thành công!");
        navigate("/admin/news");
      } else {
        message.error(response.message || "Không thể thêm đơn vị");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error(
        `Có lỗi xảy ra khi thêm tin tức: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Hàm chuyển file thành base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <>
      <Flex align="center" justify="space-between">
        <h1 className="font-semibold text-xl">Thêm tin tức</h1>
      </Flex>

      <Form className="mt-6" layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Trường này là bắt buộc" }]}
        >
          <Input placeholder="Nhập tiêu đề" />
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung bài viết"
          rules={[{ required: true, message: "Không được để trống" }]}
        >
          <Input.TextArea placeholder="Nhập nội dung bài viết" rows={6} />
        </Form.Item>

        <Form.Item
          name="photo"
          label="Tải Lên Ảnh"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Vui lòng tải lên ảnh" }]}
        >
          <Upload
            name="photo"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false} // Prevent automatic upload
          >
            <Button icon={<UploadOutlined />}>Nhấn để tải lên</Button>
          </Upload>
        </Form.Item>

        <Button htmlType="submit" type="primary" loading={loading}>
          Gửi
        </Button>
      </Form>
    </>
  );
};

export default NewsAdd;
