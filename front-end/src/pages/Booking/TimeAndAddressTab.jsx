// import React from "react";
// import { useNavigate } from "react-router-dom";

// const TimeAndAddressTab = ({ onTabChange }) => {
//   const navigate = useNavigate();
//   const event = {
//     eventDate: "2025-03-20",
//     name: "Sự kiện hiến máu tại TP.HCM",
//     eventStartTime: "08:00:00",
//     eventEndTime: "12:00:00",
//   };

//   return (
//     <div className="col-span-1 md:col-span-2">
//       <h2 className="text-xl font-semibold mt-6 text-blue-800">
//         Thời gian & địa điểm
//       </h2>
//       <div className="mt-4">
//         <label className="block text-sm font-medium text-gray-600 pb-0.5">
//           Ngày
//         </label>
//         <input
//           type="date"
//           className="w-full p-2 rounded-lg border-2 border-solid border-[rgb(187,215,253)]"
//           readOnly
//           value={event.eventDate}
//         />
//       </div>

//       <div className="mt-4">
//         <label className="block text-sm font-medium text-gray-600 pb-0.5">
//           Tỉnh/Thành phố
//         </label>
//         <div className="relative">
//           <select className="w-full p-2 rounded-lg border-2 border-solid border-[rgb(187,215,253)] focus:ring-indigo-500 focus:border-indigo-500 appearance-none pr-10">
//             <option>Hồ Chí Minh</option>
//           </select>
//           <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               className="h-5 w-5 text-black m-1"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M19 9l-7 7-7-7"
//               ></path>
//             </svg>
//           </div>
//         </div>
//       </div>

//       <div className="mt-4">
//         <label className="block text-sm font-medium text-gray-600 pb-0.5">
//           Địa điểm
//         </label>
//         <div className="relative">
//           <select
//             readOnly
//             className="w-full p-2 rounded-lg border-2 border-solid border-[rgb(187,215,253)] focus:ring-indigo-500 focus:border-indigo-500 appearance-none pr-10"
//           >
//             <option>{`${event.name}`}</option>
//           </select>
//           <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               className="h-5 w-5 text-black m-1"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M19 9l-7 7-7-7"
//               ></path>
//             </svg>
//           </div>
//         </div>
//       </div>

//       <div className="mt-4">
//         <label className="block pb-0.5">Nhóm máu cần hiến</label>
//         <div className="flex space-x-2 mt-2">
//           <button className="bg-cyan-500 text-white px-4 py-2 rounded-[10px] hover:bg-cyan-600 transition-all duration-300">
//             Nhóm máu A
//           </button>
//           <button className="bg-yellow-500 text-white px-4 py-2 rounded-[10px] hover:bg-yellow-600 transition-all duration-300">
//             Nhóm máu B
//           </button>
//           <button className="bg-red-500 text-white px-4 py-2 rounded-[10px] hover:bg-red-600 transition-all duration-300">
//             Nhóm máu AB
//           </button>
//           <button className="bg-green-500 text-white px-4 py-2 rounded-[10px] hover:bg-green-600 transition-all duration-300">
//             Nhóm máu O
//           </button>
//         </div>
//       </div>

//       <div className="mt-4">
//         <label className="block text-sm font-medium text-gray-600 pb-0.5">
//           Giờ hién máu
//         </label>
//         <div className="relative">
//           <select className="w-full p-2 rounded-lg border-2 border-solid border-[rgb(187,215,253)] focus:ring-indigo-500 focus:border-indigo-500 appearance-none pr-10">
//             <option>
//               {`${event.eventStartTime.slice(
//                 0,
//                 5
//               )} - ${event.eventEndTime.slice(0, 5)}`}
//             </option>
//           </select>
//           <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               className="h-5 w-5 text-black m-1"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M19 9l-7 7-7-7"
//               ></path>
//             </svg>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-between mt-6">
//         <button
//           onClick={() => navigate("/events")}
//           className="bg-gray-200 text-black px-6 py-2 rounded-lg hover:bg-gray-300 transition-all duration-300"
//         >
//           Quay lại
//         </button>
//         <button
//           onClick={() => onTabChange("FORM")}
//           className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
//         >
//           Tiếp tục
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TimeAndAddressTab;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import eventService from "../../service/eventService";

const TimeAndAddressTab = ({ onTabChange }) => {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventId = localStorage.getItem("eventId");
        if (!eventId) {
          message.error("Không tìm thấy thông tin sự kiện!");
          navigate("/events");
          return;
        }

        // Lấy thông tin chi tiết của event
        const response = await eventService.getEventById(eventId);
        if (response && response.success) {
          setEvent(response.data);
        } else {
          throw new Error("Không tìm thấy thông tin sự kiện");
        }
      } catch (error) {
        message.error("Lỗi khi tải thông tin sự kiện: " + error.message);
        navigate("/events");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin tip="Đang tải thông tin..." />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center text-red-500">
        Không tìm thấy thông tin sự kiện. Vui lòng quay lại trang sự kiện.
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };

  return (
    <div className="col-span-1 md:col-span-2">
      <h2 className="text-xl font-semibold mt-6 text-blue-800">
        Thời gian & địa điểm
      </h2>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-600 pb-0.5">
          Ngày
        </label>
        <input
          type="date"
          className="w-full p-2 rounded-lg border-2 border-solid border-[rgb(187,215,253)]"
          readOnly
          value={formatDate(event.eventDate)}
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-600 pb-0.5">
          Tỉnh/Thành phố
        </label>
        <div className="relative">
          <select className="w-full p-2 rounded-lg border-2 border-solid border-[rgb(187,215,253)] focus:ring-indigo-500 focus:border-indigo-500 appearance-none pr-10">
            <option>{event.city || "Hồ Chí Minh"}</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5 text-black m-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-600 pb-0.5">
          Địa điểm
        </label>
        <div className="relative">
          <select
            readOnly
            className="w-full p-2 rounded-lg border-2 border-solid border-[rgb(187,215,253)] focus:ring-indigo-500 focus:border-indigo-500 appearance-none pr-10"
          >
            <option>{event.name}</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5 text-black m-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="block pb-0.5">Nhóm máu cần hiến</label>
        <div className="flex space-x-2 mt-2 flex-wrap">
          <button className="bg-cyan-500 text-white px-4 py-2 rounded-[10px] hover:bg-cyan-600 transition-all duration-300 mb-2">
            Nhóm máu A
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-[10px] hover:bg-yellow-600 transition-all duration-300 mb-2">
            Nhóm máu B
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-[10px] hover:bg-red-600 transition-all duration-300 mb-2">
            Nhóm máu AB
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-[10px] hover:bg-green-600 transition-all duration-300 mb-2">
            Nhóm máu O
          </button>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-600 pb-0.5">
          Giờ hiến máu
        </label>
        <div className="relative">
          <select className="w-full p-2 rounded-lg border-2 border-solid border-[rgb(187,215,253)] focus:ring-indigo-500 focus:border-indigo-500 appearance-none pr-10">
            <option>
              {`${event.eventStartTime?.slice(0, 5) || "08:00"} - ${
                event.eventEndTime?.slice(0, 5) || "12:00"
              }`}
            </option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5 text-black m-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/events")}
          className="bg-gray-200 text-black px-6 py-2 rounded-lg hover:bg-gray-300 transition-all duration-300"
        >
          Quay lại
        </button>
        <button
          onClick={() => onTabChange("FORM")}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default TimeAndAddressTab;