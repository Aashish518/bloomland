import React, { useEffect, useState } from "react";
import MentalHealth from "../../assets/serenity.png";
import PhysicalHealth from "../../assets/physical-therapy.png";
import GutHealth from "../../assets/gut-health.png";
import SpiritualHealth from "../../assets/spiritual-wellness.png";
import SocialHealth from "../../assets/community.png";
import ProblemCarousel from "../event/ProblemCarousel";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setSelected } from "../../store/slices/authSlice";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Problem = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { isValid, detailsSubmitted } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const content = [
    {
      id: 1,
      title: "Mental Health",
      icon: MentalHealth,
      description:
        "Burnout now impacts 77% of the global workforce, damaging energy, focus, and emotional resilience.(Deloitte 2024)",
    },

    {
      id: 2,
      title: "Physical Health",
      icon: PhysicalHealth,
      description:
        "Preventable lifestyle diseases like diabetes and heart disease cause over 70% of global deaths today. (WHO 2024)",
    },

    {
      id: 3,
      title: "Gut Health",
      icon: GutHealth,
      description:
        "Gut imbalance triggers mood disorders in 42% of adults, influencing anxiety, depression, and brain fog.(Harvard Health 2023)",
    },

    {
      id: 4,
      title: "Spiritual Health",
      icon: SpiritualHealth,

      description:
        "61% of people report feeling disconnected from meaning, directly lowering life satisfaction and mental health.(Pew Research)",
    },

    {
      id: 5,
      title: "Social Health",
      icon: SocialHealth,

      description:
        "Chronic loneliness affects 1 in 3 adults globally, now classified as a major health risk factor. (Cigna 2024)",
    },
  ];
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

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
    <div className={`${isMobile && "my-10 relative"} flex flex-col`}>
      {isMobile ? (
        <ProblemCarousel datas={content} />
      ) : (
        <div className="flex  px-4 md:flex-row lg:flex-nowrap flex-wrap flex-col container items-center mx-auto w-full lg:justify-between justify-center py-2 gap-4 pt-10 md:pt-20">
          {content.map((item, index) => (
            <div
              key={index}
              className="flex flex-col  justify-center items-center lg:items-start max-w-md mx-auto md:mx-0 px-10 md:px-0 my-2 md:my-0"
            >
              <img
                src={item.icon}
                className="h-1/3 w-1/3 object-cover"
                alt=""
              />
              <h1 className="mt-4 mb-4 text-lg text-[#E16B33] font-semibold sansFont tracking-wide">
                {item.title}
              </h1>
              <p className="text-center lg:text-start text-sm ">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
      <motion.button
        className="mt-8 cursor-pointer md:py-2 py-3 md:px-8 px-3 bg-[#E16B33] text-white rounded-lg   transition-colors text-base duration-300 w-fit self-center"
        // transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNavigate}
      >
        Request Invite
      </motion.button>
    </div>
  );
};

export default Problem;
