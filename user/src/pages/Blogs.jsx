import React from "react";

// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import Navbar from "../components/home/Navbar";
import BannerImg from "../assets/banner.png";
import BlogSection from "../components/blogs/BlogSection";
import Footer from "../components/home/Footer";

const Blogs = () => {
  return (
    <>
      <Navbar />
      <div className="w-full overflow-hidden">
        <motion.div
          // ref={heroRef}
          className="inset-0 z-0"
          // style={{ scale: heroScale }}
        >
          <img
            src={BannerImg}
            alt="Hero Banner"
            className="w-full h-[25vh] object-cover brightness-60"
          />

          {/* This overlay creates the fade effect at the bottom of the image */}
        </motion.div>
        <div className="absolute top-1/8 z-10 w-full">
          <div className="container flex justify-between mx-auto ">
            <h1 className="text-4xl text-white font-semibold ">Blogs</h1>
          </div>
        </div>

        {/* Additional light overlay for text readability if needed */}
        <div className="absolute inset-0 z-5 bg-gradient-to-b from-black/30 via-black/30 to-transparent h-1/4"></div>
      </div>
      <div className="bg-gradient-to-b from-[#EFFFFC] to-white">
        <BlogSection />
      </div>
      <Footer />
    </>
  );
};

export default Blogs;
