import { Button, Flex, Form, Input, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000"; // Thêm URL gốc

const NewsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        // Sử dụng URL đầy đủ
        const response = await axios.get(`${API_URL}/api/news/${id}`);
        const newsData = response.data.data;
        
        form.setFieldsValue({
          title: newsData.title,
          content: newsData.content,
        });
        
        if (newsData.imageUrl) {
          setImagePreview(newsData.imageUrl);
        }
        
        setLoading(false);
      } catch (error) {
        message.error('Không thể tải dữ liệu tin tức');
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [id, form]);

  const onSubmit = async (values) => {
    const { title, content, photo } = values;
    
    // Nếu người dùng tải lên ảnh mới
    let imageUrl = imagePreview;
    if (photo && photo[0]?.originFileObj) {
      imageUrl = await convertFileToBase64(photo[0].originFileObj);
    }

    try {
      // Sử dụng URL đầy đủ
      await axios.put(`${API_URL}/api/news/${id}`, {
        title,
        content,
        imageUrl
      });
      
      message.success('Cập nhật tin tức thành công!');
      setTimeout(() => {
        navigate('/admin/news');
      }, 1000);
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật tin tức');
    }
  };

  // Hàm chuyển file thành base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <>
      <Flex align="center" justify="space-between">
        <h1 className="font-semibold text-xl">Sửa tin tức</h1>
      </Flex>

      <Form form={form} className="mt-6" layout="vertical" onFinish={onSubmit}>
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
          <Input.TextArea placeholder="Nhập nội dung bài viết" />
        </Form.Item>

        {imagePreview && (
          <div className="mb-4">
            <p>Ảnh hiện tại:</p>
            <img 
              src={imagePreview} 
              alt="Current" 
              style={{ maxWidth: '200px', maxHeight: '200px' }}
            />
          </div>
        )}

        <Form.Item
          name="photo"
          label="Tải lên ảnh mới (tùy chọn)"
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

        <Button htmlType="submit" type="primary">
          Cập nhật
        </Button>
      </Form>
    </>
  );
};

export default NewsEdit;