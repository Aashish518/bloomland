import React from "react";
import Carousel, {
  Slider,
  SliderContainer,
  SliderDotButton,
  SliderNextButton,
  SliderPrevButton,
} from "./Carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "./Card";

const EventCarousel = ({ events }) => {
  const OPTIONS = { loop: false };
  return (
    <div className="relative pt-4 md:pt-20 md:pb-5 flex gap-5 ">
      {events && events.length > 0 ? (
        <Carousel options={OPTIONS}>
          <SliderContainer className={"flex-1 "}>
            {events &&
              events.map((data, index) => (
                <Slider key={index} className="w-fit px-4">
                  <Card type={data.category} event={data} key={index} />
                </Slider>
              ))}
          </SliderContainer>

          <SliderPrevButton className="absolute top-[40%] p-1 border-2 border-[#E16B33] rounded-full left-4 bg-white/25 dark:bg-black/25 dark:border-white backdrop-blur-sm text-primary disabled:opacity-20">
            <ChevronLeft className="w-8 h-8 text-[#E16B33]" />
          </SliderPrevButton>

          <SliderNextButton className="absolute right-4 p-1 border-2 border-[#E16B33] rounded-full top-[40%] bg-white/25 dark:bg-black/25 dark:border-white backdrop-blur-sm text-primary disabled:opacity-20">
            <ChevronRight className="w-8 h-8 text-[#E16B33]" />
          </SliderNextButton>

          <div className="flex justify-center py-2">
            <SliderDotButton className={"mt-10"} />
          </div>
        </Carousel>
      ) : (
        <div className="text text-center w-full mx-auto text-xl font-medium tracking-wider text-gray-700">
          No Upcoming Events
        </div>
      )}
    </div>
  );
};

export default EventCarousel;
