import axios from "axios";
import { useEffect, useState } from "react";

function TinTuc() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/news");
        setNewsList(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="container my-6 mx-auto px-4 max-w-5xl text-center">
        Đang tải tin tức...
      </div>
    );
  }

  return (
    <div className="container my-6 mx-auto px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Tin tức mới nhất</h1>
      
      {newsList.length === 0 ? (
        <div className="text-center text-gray-500">
          Chưa có tin tức nào được đăng.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {newsList.map((news) => (
            <div
              key={news._id}
              className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={news.imageUrl || "/assets/img/default.png"}
                alt={news.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                  {news.title}
                </h2>
                <p className="mt-2 text-gray-600 line-clamp-3">
                  {news.content}
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  Đăng bởi: {news.author} • {new Date(news.timestamp).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TinTuc;