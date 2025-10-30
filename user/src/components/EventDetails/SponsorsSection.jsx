import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

const SponsorsSection = ({ sponsors }) => {
  // Sample sponsor data for demonstration
  const defaultSponsors = [
    {
      id: 1,
      name: "TechCorp",
      logo: "https://picsum.photos/100/100?random=1",
      tier: "platinum",
    },
    {
      id: 2,
      name: "InnovateLabs",
      logo: "https://picsum.photos/100/100?random=2",
      tier: "gold",
    },
    {
      id: 3,
      name: "Digital Solutions",
      logo: "https://picsum.photos/100/100?random=3",
      tier: "silver",
    },
    {
      id: 4,
      name: "Future Systems",
      logo: "https://picsum.photos/100/100?random=4",
      tier: "bronze",
    },
    {
      id: 5,
      name: "CloudTech",
      logo: "https://picsum.photos/100/100?random=5",
      tier: "silver",
    },
    {
      id: 6,
      name: "AI Dynamics",
      logo: "https://picsum.photos/100/100?random=6",
      tier: "gold",
    },
    {
      id: 7,
      name: "DataFlow",
      logo: "https://picsum.photos/100/100?random=7",
      tier: "platinum",
    },
    {
      id: 8,
      name: "NextGen",
      logo: "https://picsum.photos/100/100?random=8",
      tier: "bronze",
    },
  ];

  const sponsorData = sponsors || defaultSponsors;

  if (!sponsorData || sponsorData.length === 0) {
    return null;
  }

  // Create multiple copies for truly seamless infinite scroll
  const allSponsors = [...sponsorData, ...sponsorData, ...sponsorData];

  return (
    <section className="w-full bg-inherit py-16 overflow-hidden">
      <div className="px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Sponsors
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We're proud to partner with these amazing organizations who make our
            work possible
          </motion.p>
        </div>

        {/* Animated Sponsors Strip */}
        <div className="relative w-full overflow-hidden">
          <div className="w-full relative">
            <div className="animate-slide flex w-max">
              {allSponsors.map((sponsor, index) => (
                <motion.div
                  key={`${sponsor.id}-${Math.floor(
                    index / sponsorData.length
                  )}-${index}`}
                  className="flex-shrink-0 bg-inherit rounded-xl transition-all duration-300 hover:scale-110 "
                  style={{ width: "150px", minHeight: "140px" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: (index % sponsorData.length) * 0.1,
                  }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex flex-col items-center justify-center h-full ">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="w-16 h-16 object-contain mb-3 rounded-lg"
                    />
                    <h3 className="text-sm font-semibold text-gray-800 text-center">
                      {sponsor.name}
                    </h3>
                    {/* <div className="mt-1">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          sponsor.tier === "platinum"
                            ? "bg-gray-200 text-gray-800"
                            : sponsor.tier === "gold"
                            ? "bg-yellow-100 text-yellow-800"
                            : sponsor.tier === "silver"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {sponsor.tier}
                      </span>
                    </div> */}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        .animate-slide {
          animation: slide 60s linear infinite;
        }

        .animate-slide:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default SponsorsSection;
