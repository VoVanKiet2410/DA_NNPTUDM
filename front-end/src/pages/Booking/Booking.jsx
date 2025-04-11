// import React, { useState } from "react";
// import TimeAndAddressTab from "./TimeAndAddressTab";
// import FormTab from "./FormTab";
// import classNames from "classnames";

// const Booking = () => {
//   const [tab, setTab] = useState("TIME_ADDRESS");

//   return (
//     <div className="max-w-5xl mx-auto my-6 p-6 bg-white rounded-lg shadow-md">
//       <div className="grid grid-cols-1 gap-4">
//         <div className="col-span-1 md:col-span-2">
//           <h1 className="text-2xl font-bold text-blue-800">
//             Đặt lịch hiến máu
//           </h1>
//           <div className="flex mt-4">
//             <button
//               className={classNames(
//                 "bg-gray-200 text-black px-4 py-2 rounded-tl-md rounded-bl-md",
//                 {
//                   "!bg-blue-500 !text-white": tab === "TIME_ADDRESS",
//                 }
//               )}
//             >
//               Thời gian & địa điểm
//             </button>
//             <button
//               className={classNames(
//                 "bg-gray-200 text-black px-4 py-2 rounded-tr-md rounded-br-md",
//                 {
//                   "!bg-blue-500 !text-white": tab === "FORM",
//                 }
//               )}
//             >
//               Phiếu đăng ký hiến máu
//             </button>
//           </div>
//         </div>

//         {tab === "TIME_ADDRESS" && <TimeAndAddressTab onTabChange={setTab} />}
//         {tab === "FORM" && <FormTab onTabChange={setTab} />}
//       </div>
//     </div>
//   );
// };

// export default Booking;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TimeAndAddressTab from "./TimeAndAddressTab";
import FormTab from "./FormTab";
import classNames from "classnames";
import authService from "../../service/authService";

const Booking = () => {
  const [tab, setTab] = useState("TIME_ADDRESS");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra xem người dùng đã có appointment chưa
    const checkExistingAppointment = async () => {
      try {
        const profileInfo = await authService.getProfile();
        
        if (profileInfo?.hasAppointment) {
          // Nếu đã có appointment, chuyển về trang appointments
          navigate('/appointments');
        }
      } catch (error) {
        console.error("Error checking appointment status:", error);
      } finally {
        setLoading(false);
      }
    };

    // Kiểm tra xem có event ID trong localStorage không
    const eventId = localStorage.getItem("eventId");
    if (!eventId) {
      navigate('/events');
      return;
    }

    checkExistingAppointment();
  }, [navigate]);

  const handleTabChange = (newTab) => {
    setTab(newTab);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto my-6 p-6 bg-white rounded-lg shadow-md flex justify-center items-center h-64">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-6 p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 gap-4">
        <div className="col-span-1 md:col-span-2">
          <h1 className="text-2xl font-bold text-blue-800">
            Đặt lịch hiến máu
          </h1>
          <div className="flex mt-4">
            <button
              onClick={() => handleTabChange("TIME_ADDRESS")}
              className={classNames(
                "bg-gray-200 text-black px-4 py-2 rounded-tl-md rounded-bl-md",
                {
                  "!bg-blue-500 !text-white": tab === "TIME_ADDRESS",
                }
              )}
            >
              Thời gian & địa điểm
            </button>
            <button
              onClick={() => handleTabChange("FORM")}
              className={classNames(
                "bg-gray-200 text-black px-4 py-2 rounded-tr-md rounded-br-md",
                {
                  "!bg-blue-500 !text-white": tab === "FORM",
                }
              )}
            >
              Phiếu đăng ký hiến máu
            </button>
          </div>
        </div>

        {tab === "TIME_ADDRESS" && <TimeAndAddressTab onTabChange={handleTabChange} />}
        {tab === "FORM" && <FormTab onTabChange={handleTabChange} />}
      </div>
    </div>
  );
};

export default Booking;