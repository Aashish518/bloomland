import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ReactComponent as RazorpayIcon } from "../../assets/razorpay.svg";

const PriceButton = ({
  price,
  totalAmount,
  commissionAmount,
  gstAmount,
  handleNavigate,
  setShowPopup,
  id,
  category,
  visibility,
  userJoinStatus,
}) => {
  const { requests, approved, events, level } = useSelector(
    (state) => state.user
  );

  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const statusCheck = () => {
      if (!id || !events || !approved || !requests) return;

      const joined = events.map((i) => i.eventId?._id);
      const req = requests.map((i) => i.eventId?._id);
      const app = approved.map((i) => i.eventId?._id);

      if (joined.includes(id)) {
        return "joined";
      }

      if (app.includes(id)) {
        return "approved";
      }

      if (req.includes(id)) {
        return "requested";
      }

      return "pending";
    };

    const newStatus = statusCheck();
    setStatus(newStatus);
  }, [events, approved, requests, id]);

  useEffect(() => {
    const getAllowed = () => {
      if (category === "100x") {
        if (level >= 3) return true;
      }

      if (category === "10x") {
        if (level >= 2) return true;
      }

      if (category === "day0") {
        if (level >= 1) return true;
      }

      return false;
    };

    const all = getAllowed();
    setAllowed(all);
  }, [level, category]);

  return (
    <div className="flex items-center justify-center w-full bg-transparent md:p-8 p-4">
      <div
        className={`w-full bg-white rounded-2xl shadow-lg p-6 border ${
          category === "day0"
            ? "border-[#24655A]"
            : category === "100x"
            ? "border-[#2B4F5C]"
            : "border-[#8E7BA6]"
        }`}
      >
        {/* Price Section */}
        {userJoinStatus?.success && userJoinStatus?.isJoined ? (
          <div className="text-center text-xl">
            You have already joined this event!{" "}
            <span
              onClick={() => navigate("/dashboard")}
              className="text-[#E16B33] font-medium cursor-pointer"
            >
              Check Dashboard
            </span>
          </div>
        ) : status === "joined" ? (
          <div className="text-center text-xl">
            You have already joined the event,{" "}
            <span
              onClick={() => navigate("/dashboard")}
              className="text-[#E16B33] font-medium cursor-pointer"
            >
              Check Dashboard
            </span>
          </div>
        ) : status === "approved" ? (
          <div className="flex w-full items-center md:justify-between md:flex-row flex-col gap-5">
            <div className="text-center text-xl">
              You have already been approved for the event,{" "}
              <span
                onClick={() => navigate("/dashboard")}
                className="text-[#E16B33] font-medium cursor-pointer"
              >
                Check Dashboard
              </span>{" "}
              for payment
            </div>

            <button
              onClick={
                userJoinStatus?.success && userJoinStatus?.isJoined
                  ? () => {}
                  : () => setShowPopup()
              }
              disabled={userJoinStatus?.success && userJoinStatus?.isJoined}
              className={`flex flex-col md:py-2 px-4 rounded-md hover:scale-101 transition-all duration-300 ${
                userJoinStatus?.success && userJoinStatus?.isJoined
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-200 cursor-pointer hover:bg-gray-300"
              }`}
            >
              {/* Razorpay Logo SVG */}
              <p>
                {userJoinStatus?.success && userJoinStatus?.isJoined
                  ? "Already Joined"
                  : "Pay Now"}
              </p>
              {!(userJoinStatus?.success && userJoinStatus?.isJoined) && (
                <RazorpayIcon className="w-full h-7 text-white" />
              )}
            </button>
          </div>
        ) : status === "requested" ? (
          <div className="text-center text-xl">
            You have already requested invite for the event,{" "}
            <span
              onClick={() => navigate("/dashboard")}
              className="text-[#E16B33] font-medium cursor-pointer"
            >
              Check Dashboard
            </span>{" "}
            to check the status
          </div>
        ) : allowed ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex md:flex-row flex-col items-baseline space-x-2">
                <span className="text-sm text-gray-600 font-medium">
                  Total Amount
                </span>
                <span className="md:text-4xl text-lg font-bold text-gray-900">
                  {totalAmount}
                </span>
              </div>

              {/* Button Section */}
              <button
                onClick={
                  userJoinStatus?.success && userJoinStatus?.isJoined
                    ? () => {}
                    : visibility === "public"
                    ? () => setShowPopup()
                    : handleNavigate
                }
                disabled={userJoinStatus?.success && userJoinStatus?.isJoined}
                className={`font-semibold py-3 md:px-8 px-2 rounded-xl border-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                  userJoinStatus?.success && userJoinStatus?.isJoined
                    ? "bg-gray-400 cursor-not-allowed"
                    : `cursor-pointer ${
                        category === "day0"
                          ? "btn-light-green-light"
                          : category === "10x"
                          ? "btn-light-blue-light"
                          : "btn-dark-purple-light"
                      }`
                }`}
              >
                {userJoinStatus?.success && userJoinStatus?.isJoined
                  ? "Already Joined"
                  : visibility === "public"
                  ? "Buy Tickets "
                  : "Join Event"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex md:flex-row flex-col items-baseline space-x-2">
                <span className="text-sm text-gray-600 font-medium">
                  Total Amount
                </span>
                <span className="md:text-4xl text-lg font-bold text-gray-900">
                  {parseFloat(totalAmount?.toString())}
                </span>
                <span className="text-sm text-gray-600 font-medium">
                  {" "}
                  ( price {price}
                </span>
                <span className="text-sm text-gray-600 font-medium">
                  {" "}
                  + commissionAmount {commissionAmount} +{" "}
                </span>
                <span className="text-sm text-gray-600 font-medium">
                  {" "}
                  gstAmount {gstAmount} )
                </span>
              </div>

              {/* Button Section */}
              <button
                onClick={
                  userJoinStatus?.success && userJoinStatus?.isJoined
                    ? () => {}
                    : visibility === "public"
                    ? () => setShowPopup(true)
                    : () => handleNavigate()
                }
                disabled={userJoinStatus?.success && userJoinStatus?.isJoined}
                className={`font-semibold py-3 md:px-8 px-2 rounded-xl border-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                  userJoinStatus?.success && userJoinStatus?.isJoined
                    ? "bg-gray-400 cursor-not-allowed"
                    : `cursor-pointer ${
                        category === "day0"
                          ? "btn-light-green-light"
                          : category === "10x"
                          ? "btn-light-blue-light"
                          : "btn-dark-purple-light"
                      }`
                }`}
              >
                {userJoinStatus?.success && userJoinStatus?.isJoined
                  ? "Already Joined"
                  : visibility === "public"
                  ? "Buy Tickets "
                  : "Request Invite"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PriceButton;
