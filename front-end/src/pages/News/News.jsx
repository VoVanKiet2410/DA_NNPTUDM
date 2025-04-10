import React from "react";

function TinTuc() {
  // Dữ liệu tĩnh thay vì gọi API
  const newsList = [
    {
      id: 1,
      images: "/assets/img/blood.png",
      title: "Chiến dịch hiến máu toàn quốc 2025",
      content: "Chiến dịch nhằm khuyến khích mọi người tham gia hiến máu để cứu sống hàng ngàn bệnh nhân cần máu mỗi ngày.",
    },
    {
      id: 2,
      images: "/assets/img/blood.png",
      title: "Ngày hội hiến máu tại TP.HCM",
      content: "Hơn 500 người đã tham gia ngày hội hiến máu tại TP.HCM, đóng góp lượng máu lớn cho cộng đồng.",
    },
    {
      id: 3,
      images: "/assets/img/blood.png",
      title: "Câu chuyện cảm động từ người hiến máu",
      content: "Một người hiến máu lâu năm chia sẻ hành trình giúp đỡ người khác qua từng giọt máu.",
    },
  ];

  return (
    <div className="container my-6 mx-auto px-4 max-w-5xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {newsList.length > 0 &&
          newsList.map((news) => (
            <a
              key={news.id}
              href="#"
              className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={news.images}
                alt={`News Image ${news.id}`}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                  {news.title}
                </h2>
                <p className="mt-2 text-gray-600 line-clamp-3">
                  {news.content}
                </p>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
}

export default TinTuc;