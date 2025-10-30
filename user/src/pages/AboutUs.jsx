import React from "react";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import Problem from "../components/home/Problem";
import SectionHeader from "../components/common/SectionHeader";
import Solution from "../components/about/Solution";
import Mission from "../components/about/Mission";
import Faq from "../components/about/Faq";
import Socials from "../components/about/Socials";
import Banner from "../assets/benefit.png";

const AboutUs = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-[45vh]  w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            className="h-full w-full object-cover"
            src={Banner}
            alt="Mountain landscape with person sitting on cliff edge"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30 bg-opacity-30"></div>
        </div>

        {/* Navigation */}
        <div className="">
          <Navbar />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4">
          {/* Navigation breadcrumbs */}
          {/* <div className="mb-8">
            <nav className="flex items-center justify-center space-x-2 text-white text-sm md:text-base">
              <span className="hover:text-[#C1EDF1] cursor-pointer transition-colors">
                Editions
              </span>
              <span className="text-white/70">•</span>
              <span className="hover:text-[#C1EDF1] cursor-pointer transition-colors">
                About Us
              </span>
              <span className="text-white/70">•</span>
              <span className="text-[#C1EDF1] font-medium">Blog</span>
            </nav>
          </div> */}

          {/* BloomLand Logo/Title */}
          {/* <div className="mb-6">
            <h1 className="text-white text-4xl md:text-6xl font-light tracking-wide">
              Bloomland
            </h1>
          </div> */}

          {/* Main Heading */}
          <div className="max-w-4xl mx-auto mb-6">
            <h2 className="text-white text-3xl md:text-5xl font-medium leading-tight">
              About Bloomland
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-3xl mx-auto">
            <p className="text-white text-lg md:text-xl leading-relaxed">
              BloomLand is a global wellness movement
            </p>
          </div>

          {/* Description */}
          <div className="max-w-4xl mx-auto">
            <p className="text-white/90 text-base md:text-lg leading-relaxed">
              Reimagining holistic health and conscious living and a call to
              reset, reimagine and rise
            </p>
          </div>
        </div>
      </div>

      {/* Rest of the content */}
      <div className="relative z-30 bg-white">
        <div className="md:pt-[1rem] pt-[3rem]">
          <div>
            <SectionHeader
              title={"Holistic Health Problems"}
              lineColor="bg-[#3CA18F]"
            />
            <Problem />
          </div>
        </div>

        <div>
          <div className="md:my-10">
            <SectionHeader
              title={"The Solution"}
              subtitle={"A Space to Reset, Reconnect, and Rise."}
              lineColor={"bg-[#3CA18F]"}
            />
          </div>
          <Solution />
        </div>

        <div className="md:my-10 md:max-w-[80%] max-w-full mx-auto px-4">
          <Mission />
        </div>

        <div className="md:max-w-[80%] max-w-full mx-auto px-4">
          <div className="my-10">
            <SectionHeader title={"FAQS"} lineColor={"bg-[#3CA18F]"} />
          </div>
          <Faq />
        </div>

        <div className="md:max-w-[80%] max-w-full mx-auto px-4">
          <Socials />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AboutUs;
