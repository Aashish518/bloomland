// import { useState } from 'react';
import ImgSrc from "../../assets/day0.jpg";

export default function BloomlandRetreatCards() {
  // Sample image URL (placeholder)
  const imageUrl = ImgSrc;

  // Card data
  const cards = [
    {
      id: 1,
      title: "Our Belief",
      content:
        "At BloomLand, we believe today's overwhelm isn't solved by doing more — it's solved by deep remembering.",
    },
    {
      id: 2,
      title: "Who You Are",
      content:
        "Remembering who you are when you're fully nourished, fully rested, fully seen, and deeply valued.",
    },
    {
      id: 3,
      title: "Curated Journeys",
      content:
        "That's why we design curated journeys — from immersive retreats and one-day experiences to our annual festival.",
    },
    {
      id: 4,
      title: "Transformative Alignment",
      content:
        "Each journey is crafted to help you slow down, heal deeply, and realign with purpose and clarity.",
    },
    {
      id: 5,
      title: "Global Facilitation",
      content:
        "Led by global facilitators in breathtaking natural settings, our journeys help you release patterns and awaken energy.",
    },
    {
      id: 6,
      title: "Space to Bloom",
      content:
        "We don't just offer wellness; we create the space for you to bloom and thrive from within.",
    },
  ];

  return (
    <div className="w-full md:py-12 pt-12 px-4 pb-6">
      <div className="md:max-w-[80%] max-w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-10 gap-5">
        {cards.map((card) => (
          <div
            key={card.id}
            className="max-w-3xl mx-auto rounded-xl  flex flex-col  group"
          >
            {/* Background image */}
            <div className="w-full relative">
              <img
                src={imageUrl}
                className="w-full h-full object-cover aspect-square "
              />
              <div className="absolute inset-0 pointer-events-none ">
                <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0)_40%,rgba(255,255,255,0.8)_100%)] " />
              </div>
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-b from-transparent via-transparent to-white/90" />
              </div>
            </div>

            <div className="-translate-y-1/4 px-5 transition transform group-hover:-translate-y-1/2 duration-500 ease-in-out ">
              <h1 className="text-[#E16B33] md:text-[24px] text-xl font-medium">
                {card.title}
              </h1>
              <p className="md:text-[16px] text-base font-medium">
                {card.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
