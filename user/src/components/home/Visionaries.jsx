/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimationControls } from "motion/react";

const RotatingVisionariesSection = () => {
  // Animation setup
  const words = ["Visionaries", "Entrepreneurs", "Changemakers"];
  const colors = [
    { text: "#FF8F6B", opacity: "opacity-10", weight: "font-light" },
    { text: "#FF8F6B", opacity: "opacity-10", weight: "font-light" },
    { text: "#FF8F6B", opacity: "opacity-10", weight: "font-light" },
  ];

  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimationControls();

  // Set container height after measuring the elements
  useEffect(() => {
    if (containerRef.current) {
      const wordHeight =
        containerRef.current.querySelector(".word-item")?.offsetHeight || 60;
      setHeight(wordHeight);
    }
  }, []);

  // Rotation animation timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate positions for each word based on currentIndex
  const calculatePosition = (index) => {
    const isMobile = window.innerWidth <= 768;
    // Calculate relative position (0 = current, 1 = next, 2 = next+1)
    let position = (index - currentIndex + words.length) % words.length;

    // 3D position calculations
    let yTranslation = 0;
    let xRotation = 0;
    let scale = 1;
    let zIndex = 10;
    let opacity = 1;

    if (position === 0) {
      // Current word (center)
      yTranslation = 0;
      xRotation = 0;
      scale = 1;
      zIndex = 30;
      opacity = 1;
    } else if (position === 1) {
      // Next word (below)
      yTranslation = isMobile ? 30 : 50;
      xRotation = -30;
      scale = 0.85;
      zIndex = 20;
      opacity = 0.3;
    } else {
      // Previous word (above)
      yTranslation = isMobile ? -30 : -50;
      xRotation = 30;
      scale = 0.85;
      zIndex = 10;
      opacity = 0.3;
    }

    return {
      y: yTranslation,
      rotateX: xRotation,
      scale,
      zIndex,
      opacity,
    };
  };

  return (
    <div className="w-full  bg-inherit mt-14">
      <div className="text-center">
        <div className="mb-6 flex md:flex-row flex-col items-center justify-center h-fit">
          <p className="md:text-3xl text-2xl font-semibold text-black tracking-wider  transform md:-translate-x-1/2">
            We bring together
          </p>
          <div className="pl-0 ml-0">
            <div
              ref={containerRef}
              className="relative md:h-20 h-10 flex items-center justify-center my-10"
              style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
            >
              {words.map((word, index) => (
                <motion.div
                  key={word}
                  className="word-item absolute md:w-64  text-center md:text-3xl text-2xl tracking-wider ml-0 pl-0 transform -traslate-x-1/2"
                  initial={calculatePosition(index)}
                  animate={calculatePosition(index)}
                  transition={{
                    duration: 0.7,
                    ease: "easeInOut",
                  }}
                  style={{
                    color: colors[index].text,
                    transformOrigin: "center center",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <span
                    className={`opacity-100 font-semibold text-[#E16B33] md:text-start`}
                  >
                    {word}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="text-base text-center max-w-2xl mx-auto text-black px-4">
        with the world's finest healers, guides, and leaders to create journeys
        of deep renewal, connection, and expansion
      </p>
    </div>
  );
};

export default RotatingVisionariesSection;
