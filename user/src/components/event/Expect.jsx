import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import ExpectCarousel from "./ExpectCarousel";

const Expect = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState(0);

  // Check if the screen size is mobile
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

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === data.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };

  // Swipe handlers for touch devices
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto md:py-20 py-10">
      {isMobile ? (
        // Mobile Carousel View
        // <div className="relative ">
        //   <div className="w-full h-full">
        //     <AnimatePresence initial={false} custom={direction} mode="wait">
        //       <motion.div
        //         key={currentIndex}
        //         custom={direction}
        //         variants={variants}
        //         initial="enter"
        //         animate="center"
        //         exit="exit"
        //         transition={{
        //           x: { type: "spring", stiffness: 300, damping: 30 },
        //           opacity: { duration: 0.2 },
        //         }}
        //         drag="x"
        //         dragConstraints={{ left: 0, right: 0 }}
        //         dragElastic={0.3}
        //         onDragEnd={(e, { offset, velocity }) => {
        //           const swipe = swipePower(offset.x, velocity.x);

        //           if (swipe < -swipeConfidenceThreshold) {
        //             nextSlide();
        //           } else if (swipe > swipeConfidenceThreshold) {
        //             prevSlide();
        //           }
        //         }}
        //         className="flex flex-col justify-center items-center px-4 w-full "
        //       >
        //         <img
        //           src={data[currentIndex].Icon}
        //           className="h-30 w-auto object-cover max-w-[200px]"
        //           alt=""
        //         />
        //         <h1 className="mt-4 mb-4 text-xl text-[#E16B33] font-semibold max-w-[250px] text-center">
        //           {data[currentIndex].title}
        //         </h1>
        //         <p className="text-center text-sm max-w-[250px]">
        //           {data[currentIndex].description}
        //         </p>
        //       </motion.div>
        //     </AnimatePresence>
        //   </div>

        //   {/* Navigation arrows */}
        //   <div className="flex justify-between absolute top-1/2 -translate-y-1/2 w-full px-2 z-10">
        //     <motion.button
        //       onClick={prevSlide}
        //       className="bg-white/80 rounded-full p-2 shadow-md"
        //       whileTap={{ scale: 0.9 }}
        //       aria-label="Previous slide"
        //     >
        //       <ChevronLeft size={20} className="text-gray-700" />
        //     </motion.button>
        //     <motion.button
        //       onClick={nextSlide}
        //       className="bg-white/80 rounded-full p-2 shadow-md"
        //       whileTap={{ scale: 0.9 }}
        //       aria-label="Next slide"
        //     >
        //       <ChevronRight size={20} className="text-gray-700" />
        //     </motion.button>
        //   </div>

        //   {/* Dots indicator */}
        //   <div className="flex justify-center mt-24 gap-2">
        //     {data.map((_, index) => (
        //       <motion.button
        //         key={index}
        //         onClick={() => goToSlide(index)}
        //         className={`w-2 h-2 rounded-full ${
        //           currentIndex === index ? "bg-[#E16B33]" : "bg-gray-300"
        //         }`}
        //         whileHover={{ scale: 1.2 }}
        //         whileTap={{ scale: 0.9 }}
        //         aria-label={`Go to slide ${index + 1}`}
        //       />
        //     ))}
        //   </div>
        // </div>
        <div className="relative">
          <ExpectCarousel datas={data} />
        </div>
      ) : (
        // Desktop View (original layout)
        <div className="flex flex-wrap justify-evenly md:gap-5 lg:gap-0 gap-10">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-center items-center lg:items-start"
            >
              <img
                src={item.Icon}
                className="h-30 w-auto object-cover max-w-[200px]"
                alt=""
              />
              <h1 className="mt-4 mb-4 text-xl text-[#E16B33] font-semibold max-w-[250px] lg:text-start text-center">
                {item.title}
              </h1>
              <p className="text-center lg:text-start text-sm md:text-base max-w-[250px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Expect;
