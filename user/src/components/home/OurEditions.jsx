import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "motion/react";
import HikerImg from "../../assets/hiker.webp";
import day0 from "../../assets/OurEditions-0x.jpg";
import x100 from "../../assets/OurEditions-10x.jpg";
import x10 from "../../assets/OurEditions-100x.jpg";
import { ArrowRight, ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setSelected } from "../../store/slices/authSlice";
import EditionsCarousel from "./EditionsCarousel";

const OurEditions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isValid, detailsSubmitted } = useSelector((state) => state.auth);
  const OPTIONS = { loop: false };
  const [isMobile, setIsMobile] = useState(false);
  const content = [
    {
      id: "01",
      image: day0,
      category: "day0",
      title: "Begin your blooming journey with Day-0 edition",
      description: "where healing meets community, and intention meets action.",
    },
    {
      id: "02",
      category: "10x",
      image: x10,

      title: "Heal, expand, and bloom into your highest self ",
      description: "across the world’s most inspiring destinations.",
    },
    {
      id: "03",
      category: "100x",
      image: x100,

      title: "The Ultimate Reset.",
      description: "A Journey Back to Your Purest, Highest Self.",
    },
  ];

  const handleNavigate = (item) => {
    if (isValid) {
      if (detailsSubmitted) {
        navigate(`/editions/${item.category}`);
      } else {
        dispatch(setSelected(`/editions/${item.category}`));
        navigate("/details");
      }
    } else {
      dispatch(setSelected(`/editions/${item.category}`));
      navigate("/auth/login");
    }
  };

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <section className="relative bg-inherit xl:max-w-[80%] max-w-full mx-auto flex">
      <AnimatePresence>
        {isMobile ? (
          <EditionsCarousel content={content} handleNavigate={handleNavigate} />
        ) : (
          content &&
          content.length > 0 &&
          content.map((item) => (
            <section
              className="relative flex flex-col items-center h-auto flex-1"
              key={item.id}
            >
              <div className="px-6 py-10 h-full ">
                <div
                  className={`flex flex-col   ${
                    item.category === "BloomX"
                      ? "bg-[#C1E1C1]"
                      : item.category === "Bloom10x"
                      ? "bg-[#9BC3D3]"
                      : "bg-[#c3bad1]"
                  } holographic-card  border border-[#3CA18F] h-full overflow-hidden`}
                >
                  <div className="w-full h-full flex flex-col ">
                    <motion.div
                      className="rounded-lg overflow-hidden md:h-86"
                      whileInView={{ opacity: [0, 1] }}
                      // transition={{ duration: 0.8 }}
                      viewport={{ once: false, amount: 0.2 }}
                    >
                      <img
                        src={item.image}
                        alt="Hiker on mountain path"
                        className="w-full h-auto object-cover aspect-square object-top"
                      />
                    </motion.div>
                  </div>

                  <div className=" p-5 h-full flex flex-col justify-between">
                    <div>
                      <div className=" capitalize mb-6 md:text-[29px] text-3xl font-bold tracking-widest text-black allSeasonFont">
                        {item.category} Edition
                      </div>
                      <h2 className="text-[18px] md:text-[16px] font-medium text-black mb-2">
                        {item.title}
                      </h2>
                      <p className="text-black md:text-[14px] font-light mb-8">
                        {item.description}
                      </p>
                    </div>
                    <motion.button
                      className=" self w-fit text-black cursor-pointer md:text-lg   pb-3 pl-3 text-lg font-semibold flex gap-1 items-center-safe  "
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNavigate(item)}
                    >
                      Join Edition
                      <ArrowRight className="arrow-animation" />
                      {/* <span className="arrow-animation">→</span> */}
                    </motion.button>
                  </div>
                </div>
              </div>
            </section>
          ))
        )}
      </AnimatePresence>
    </section>
  );
};

export default OurEditions;
