import React, { useEffect, useState } from "react";
import GutHealth from "../../assets/gut-health.png";
import BenefitsCarousel from "../event/BenefitsCarousel";
const Benefits = () => {
  const [isMobile, setIsMobile] = useState(false);

  const content = [
    {
      id: 1,
      Icon: GutHealth,
      title: "Reset Your Health, Body, and Energy",
      description:
        "Heal beyond surface symptoms — awaken your vitality at the root.",
    },
    {
      id: 2,
      Icon: GutHealth,
      title: "Expand Your Purpose and Leadership",
      description:
        "Step into conscious living, clarity, and true self-activation.",
    },
    {
      id: 3,
      Icon: GutHealth,
      title: "Find Your Conscious Tribe",
      description:
        "Belong to an exclusive global community of healers, entrepreneurs, visionaries, healers and creators",
    },
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);
  return (
    <div className={`${isMobile && "pt-20 my-0 relative w-full mx-auto"}`}>
      {isMobile ? (
        <BenefitsCarousel datas={content} />
      ) : (
        <div className="flex px-4 md:px-16 md:flex-row lg:flex-nowrap flex-wrap flex-col lg:container items-center mx-auto w-full justify-evenly py-2 gap-4 pt-10">
          {content.map((item, index) => (
            <div
              key={index}
              className="flex flex-col  justify-center items-center lg:items-start max-w-xs mx-auto md:mx-0 px-10 md:px-0 my-2 md:my-0"
            >
              <img
                src={item.Icon}
                className="h-1/3 w-1/3 object-cover"
                alt=""
              />
              <h1 className="mt-4 mb-4 text-lg text-[#E16B33] font-semibold">
                {item.title}
              </h1>
              <p className="text-center lg:text-start text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Benefits;
