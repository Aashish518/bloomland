import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setSelected } from "../../store/slices/authSlice";

const Banner = () => {
  const { isValid, detailsSubmitted } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigate = () => {
    if (isValid) {
      if (detailsSubmitted) {
        navigate("/editions");
      } else {
        dispatch(setSelected("/editions"));
        navigate("/details");
      }
    } else {
      dispatch(setSelected("/editions"));
      navigate("/auth/login");
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      {/* Content - Title and Description */}
      <div className="flex flex-col justify-center items-center z-20 px-4 text-center">
        <motion.h1
          className="text-2xl md:text-2xl lg:text-3xl font-semibold mb-2 text-white z-50 allSeasonFont"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Your Gateway to Holistic Health and Conscious Living. */}
          A modern age global holistic health and wellness movement
        </motion.h1>

        <motion.p
          className="text-white text-sm md:text-base max-w-3xl mx-auto mb-2 z-50"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          {/* Curated Holistic healing travel experiences, conscious festivals, and
          a global community for holistic healing and transformation. */}
          Discover Holistic travel experinces, conscious festivals, and a global       community— aligned in purpose and presence.
        </motion.p>

        {/* Call to Action Button with Hover Animation */}
        <motion.button
          className="mt-8 md:py-2 py-3 md:px-8 px-3 bg-[#E16B33] text-white rounded-lg hover:text-black hover:bg-white transition-colors text-base duration-300 cursor-pointer"
          // transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNavigate}
        >
          Request Invite
        </motion.button>
      </div>
    </div>
  );
};

export default Banner;
