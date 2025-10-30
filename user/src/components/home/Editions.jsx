import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "motion/react";
import day0 from "../../assets/day0.jpg";
import x100 from "../../assets/100x.png";
import x10 from "../../assets/10x.png";
import { ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setSelected } from "../../store/slices/authSlice";
import EditionsCarousel from "./EditionsCarousel";

const Editions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isValid, detailsSubmitted } = useSelector((state) => state.auth);
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
      title: "Heal, expand, and bloom into your highest self",
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
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
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
              onClick={() => handleNavigate(item)}
            >
              <div className="px-6 py-10 h-full w-full">
                <div
                  className={`group relative flex flex-col cursor-pointer ${
                    item.category === "BloomX"
                      ? "bg-[#C1E1C1]"
                      : item.category === "Bloom10x"
                      ? "bg-[#9BC3D3]"
                      : "bg-[#c3bad1]"
                  } border border-[#3CA18F] h-full overflow-hidden transition-shadow duration-300 hover:shadow-2xl`}
                >
                  {/* Image */}
                  <motion.div
                    className="rounded-lg overflow-hidden h-[500px] relative"
                    whileInView={{ opacity: [0, 1] }}
                    viewport={{ once: false, amount: 0.2 }}
                  >
                    <img
                      src={item.image}
                      alt={item.category}
                      className="w-full h-full object-cover object-top"
                    />

                    {/* Hover Title Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out flex items-center justify-center p-4 text-center">
                      <h3 className="text-white text-2xl font-bold">{item.title}</h3>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          ))
        )}
      </AnimatePresence>
    </section>
  );
};

export default Editions;




  // <div className=" p-5 h-full flex flex-col justify-between">
  //                   <div>
  //                     <div className=" capitalize mb-6 md:text-[29px] text-3xl font-bold tracking-widest text-black allSeasonFont">
  //                       {item.category} Edition
  //                     </div>
  //                     <h2 className="text-[18px] md:text-[16px] font-medium text-black mb-2">
  //                       {item.title}
  //                     </h2>
  //                     <p className="text-black md:text-[14px] font-light mb-8">
  //                       {item.description}
  //                     </p>
  //                   </div>
  //                   <motion.button
  //                     className=" self w-fit text-black cursor-pointer md:text-lg   pb-3 pl-3 text-lg font-semibold flex gap-1 items-center-safe  "
  //                     whileHover={{ scale: 1.03 }}
  //                     whileTap={{ scale: 0.95 }}
  //                     onClick={() => handleNavigate(item)}
  //                   >
  //                     Join Edition
  //                     <ArrowRight className="arrow-animation" />
  //                     {/* <span className="arrow-animation">→</span> */}
  //                   </motion.button>
  //                 </div>