import React from "react";

// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import Carousel, {
  Slider,
  SliderContainer,
  SliderDotButton,
} from "../event/Carousel";
import { ArrowRight } from "lucide-react";
const EditionsCarousel = ({ content, handleNavigate }) => {
  const OPTIONS = { loop: false };
  return (
    // Change autoplay delay : searcg "autoplayDelay" in ./Carousel

    <Carousel options={OPTIONS} isAutoPlay={true}>
      <SliderContainer>
        {content &&
          content.map((data, index) => (
            <Slider key={index} className={"w-full"}>
              <section className="relative flex items-center" key={data.id}>
                <div className=" mx-auto px-6 py-10 md:py-10">
                  <div
                    className={`flex flex-col md:flex-row md:gap-12 holographic-card  border   ${
                      data.category === "BloomX"
                        ? "border-[#24655A] bg-[#C1E1C1]"
                        : data.category === "Bloom10x"
                        ? "border-[#2B4F5C] bg-[#9BC3D3]"
                        : "border-[#8E7BA6] bg-[#c3bad1]"
                    }`}
                  >
                    <div className="w-full md:w-1/3">
                      <motion.div
                        className="rounded-lg overflow-hidden md:h-96"
                        whileInView={{ opacity: [0, 1] }}
                        // transition={{ duration: 0.8 }}
                        viewport={{ once: false, amount: 0.2 }}
                      >
                        <img
                          src={data.image}
                          alt="Hiker on mountain path"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </div>

                    <div className="flex-1 md:p-10 p-5 max-h-full flex flex-col justify-between">
                      <div>
                        <div className=" capitalize mb-6 md:text-[41px] text-3xl font-medium text-[#E16B33] ">
                          {data.category} Edition
                        </div>
                        <h2 className="text-[18px] md:text-[25px] font-medium text-black mb-4">
                          {data.title}
                        </h2>
                        <p className="text-black md:text-[20px] font-light mb-8">
                          {data.description}
                        </p>
                      </div>
                      <motion.button
                        className=" w-fit text-[#E16B33] md:text-xl text-lg font-semibold flex gap-1 items-center-safe  "
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleNavigate(data)}
                      >
                        Join Edition
                        <ArrowRight className="arrow-animation" />
                        {/* <span className="arrow-animation">→</span> */}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </section>
            </Slider>
          ))}
      </SliderContainer>

      <div className="flex justify-center py-2">
        <SliderDotButton className={"my-5"} />
      </div>
    </Carousel>
  );
};

export default EditionsCarousel;
