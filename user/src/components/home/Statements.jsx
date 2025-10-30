import React from "react";
import aviey from "../../assets/aviey.jpg";
import shaini from "../../assets/shaini.jpg";
import helly from "../../assets/helly.jpg";
import khevna from "../../assets/khevna.jpg";
import palak from "../../assets/palak.jpg";

// eslint-disable-next-line no-unused-vars
import { motion, useAnimationControls } from "motion/react";

const Statements = () => {
  const content = [
    {
      name: "Aviey Verma",
      position: "Founder",
      company: "AR Fitness",
      image: aviey,
      statement:
        "In fitness, we focus on reps—but real transformation runs deeper. That’s why Bloomland stands out. It’s not just shaping bodies, it’s reshaping lives. As a wellness enthusiast, I’m excited to see it redefine true health for our generation",
    },
    {
      name: "shaini shah",
      position: "Founder",
      company: "celebrations by lilac",
      image: shaini,
      statement:
        "Having worked with several wellness and health brands through event curation, I’ve seen many trends come and go. But Bloomland feels different—grounded, intentional, and truly holistic. It carries the kind of energy that can spark real, lasting wellbeing.",
    },
    {
      name: "Helly Govani",
      position: "Student",
      company: "Nirma university",
      image: helly,
      statement:
        "I find Bloomland’s approach to holistic health incredibly refreshing. In a world where wellness is often reduced to just physical fitness, Bloomland stands out by nurturing the mind, body, gut, soul, and our social connections. It’s exciting to see a brand that truly understands what young people need to thrive—not just survive.",
    },
    {
      name: "Khevna",
      position: "Entrepreneur",
      image: khevna,
      statement:
        "As someone building a business around conscious choices and mindful living, Bloomland instantly resonated with me. It’s not just promoting wellness—it’s embodying a lifestyle that aligns with purpose, sustainability, and inner balance. There’s something real about it.",
    },
    {
      name: "Palak Sharma",
      position: "Content writer",
      image: palak,
      statement:
        "In a world full of wellness buzzwords, Bloomland stands out with something real. As a storyteller, I’m drawn to brands that walk their talk—and this one feels like it’s building a movement that actually moves people",
    },
  ];

  // Duplicate content to create a seamless loop
  const allContent = [...content, ...content];

  // const containerRef = useRef(null);
  // const controls = useAnimationControls();

  // useEffect(() => {
  //   const startAnimation = async () => {
  //     // Get the width of the container to determine how far to animate
  //     const containerWidth = containerRef.current?.offsetWidth || 0;

  //     // First, set the initial position to the left
  //     await controls.set({ x: -containerWidth / 2 });

  //     // Then animate towards the right
  //     await controls.start({
  //       x: 0, // Move towards right (from -containerWidth/2 to 0)
  //       transition: {
  //         duration: 35, // Seconds for one complete rotation
  //         ease: "linear", // Constant speed
  //         repeat: Infinity, // Repeat forever
  //       },
  //     });
  //   };

  //   startAnimation();

  //   // Handle window resize
  //   const handleResize = () => {
  //     startAnimation();
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, [controls]);

  // ref={containerRef}

  return (
    <div className="w-full flex flex-col items-center justify-center mb-5">
      <h1 className="text-lg font-semibold  text-center">
        Statements from our Bloom leaders and Bloomers
      </h1>
      <div className="relative w-full overflow-hidden">
        <div className="w-full relative">
          <motion.div className="flex gap-5 my-10 w-max animate-slide-reverse">
            {allContent.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 md:max-w-xs max-w-3xs p-6 bg-white rounded-3xl shadow-sm"
                style={{ backgroundColor: "#F9FEFF" }}
              >
                <div className="flex items-center mb-7">
                  <div className="md:w-12 md:h-12 h-8 w-8 bg-gray-500 rounded-full mr-3 overflow-hidden">
                    <img
                      src={item.image}
                      alt={`${item.name}'s profile`}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </div>
                  <div>
                    <h3 className="md:text-base text-[14px] font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm">
                      <span className="text-[#F7751E] text-[10px]">
                        {item.position}
                      </span>
                      {item.company && (
                        <>
                          <span className="mx-1">•</span>
                          <span className="text-[#F7751E] font-semibold  text-[10px]">
                            {item.company}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <p className="text-black font-semibold leading-relaxed text-sm">
                  {item.statement}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Statements;
