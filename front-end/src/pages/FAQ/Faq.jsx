import React from "react";
import ContentSection from "./ContentSection";

const Faq = () => {
  const faqs = [
    {
      title: "Ai có thể hiến máu?",
      description: "Người từ 18-60 tuổi, khỏe mạnh, không mắc bệnh truyền nhiễm.",
    },
    {
      title: "Hiến máu có ảnh hưởng đến sức khỏe không?",
      description: "Không, hiến máu không gây hại nếu bạn đủ điều kiện sức khỏe.",
    },
    {
      title: "Tôi cần chuẩn bị gì trước khi hiến máu?",
      description: "Ăn nhẹ, ngủ đủ giấc, và không uống rượu bia trước 24 giờ.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-4xl font-semibold mb-6 text-blue-800 text-center">
        Lưu ý quan trọng
      </h2>
      
      <div className="space-y-4">
        {faqs.map((it, index) => (
          <ContentSection
            key={index}
            title={`${index + 1}. ${it.title}`} // Câu hỏi là title
            description={it.description} // Truyền description là chuỗi
          />
        ))}
      </div>
    </div>
  );
};

export default Faq;