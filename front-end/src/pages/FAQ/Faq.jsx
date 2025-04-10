import React from "react";
import ContentSection from "./ContentSection";
import { useEffect, useState } from "react";
import axios from "axios";

const Faq = () => {
  const [newsFaq, setFaqList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/faq");
        setFaqList(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching faqs:", error);
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <div className="container my-6 mx-auto px-4 max-w-5xl text-center">
        Đang tải FAQs...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-4xl font-semibold mb-6 text-blue-800 text-center">
        Lưu ý quan trọng
      </h2>
      
      <div className="space-y-4">
        {newsFaq.map((it, index) => (
          <ContentSection
            key={index}
            title={`${index + 1}. ${it.title}`}
            description={it.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Faq;