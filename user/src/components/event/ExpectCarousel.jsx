import React from "react";
import Carousel, {
  Slider,
  SliderContainer,
  SliderDotButton,
  SliderNextButton,
  SliderPrevButton,
} from "./Carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
export default function ExpectCarousel({ datas }) {
  const OPTIONS = { loop: false };
  return (
    <>
      <Carousel options={OPTIONS}>
        <SliderContainer>
          {datas &&
            datas.map((data, index) => (
              <Slider key={index} className="w-full">
                <div className="flex flex-col justify-center items-center px-4 w-full ">
                  <img
                    src={data.Icon}
                    className="h-30 w-auto object-cover max-w-[200px]"
                    alt=""
                  />
                  <h1 className="mt-4 mb-4 text-xl text-[#E16B33] font-semibold max-w-[250px] text-center">
                    {data.title}
                  </h1>
                  <p className="text-center text-sm max-w-[250px]">
                    {data.description}
                  </p>
                </div>
              </Slider>
            ))}
        </SliderContainer>
        <SliderPrevButton className="absolute top-[30%] p-1 border-2 border-[#E16B33] rounded-full left-4 bg-white/25 dark:bg-black/25 dark:border-white backdrop-blur-sm text-primary disabled:opacity-20">
          <ChevronLeft className="w-8 h-8 text-[#E16B33]" />
        </SliderPrevButton>
        <SliderNextButton className="absolute right-4 p-1 border-2 border-[#E16B33] rounded-full top-[30%] bg-white/25 dark:bg-black/25 dark:border-white backdrop-blur-sm text-primary disabled:opacity-20">
          <ChevronRight className="w-8 h-8 text-[#E16B33]" />
        </SliderNextButton>
        <div className="flex justify-center py-2">
          <SliderDotButton className={"mt-10"} />
        </div>
      </Carousel>
    </>
  );
}
