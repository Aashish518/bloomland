import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { joinCommunity } from "../services/operations/community";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import Faq from "../components/about/Faq";
import SectionHeader from "../components/common/SectionHeader";
import Socials from "../components/about/Socials";
import comm1 from "../assets/comm1.png";
import comm2 from "../assets/comm2.png";
import comm3 from "../assets/comm3.png";
import comm4 from "../assets/comm4.png";
import comm5 from "../assets/comm5.png";
import comm6 from "../assets/comm6.png";
import comm7 from "../assets/comm7.png";
import { setSelected } from "../store/slices/authSlice";
import { ClipLoader } from "react-spinners";

const Community = () => {
  const { token, isValid, detailsSubmitted } = useSelector(
    (state) => state.auth
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const benefits = [
    {
      title: "Early Access to All Bloomland Editions",
      icon: comm1,
      description:
        "Be the first to receive exclusive invitations to our Day-0, Bloom10*, and Bloom100* retreats — before public releases. Limited spots, always aligned.",
    },
    {
      title: "Connect with Bloomers & Bloom Leaders",
      icon: comm2,
      description:
        "Unlock access to a powerful, high-vibration network of like-minded souls, including past participants (Bloomers) and global facilitators (Bloom Leaders). Build deep connections, collaborations, and friendships that grow with you.",
    },
    {
      title: "Members-Only Content Library",
      icon: comm3,
      description:
        "Get access to a growing library of guided rituals, emotional tools, integration practices, and seasonal workshops — created by world-class healers and mentors.",
    },
    {
      title: "Safe, Curated Circles & Community Spaces",
      icon: comm4,
      description:
        "Join closed spaces designed for real talk and real support — from emotional reflections to group meditations and conscious conversations.",
    },
    {
      title: "Personal Growth, Leadership, & Co-Creation",
      icon: comm5,
      description:
        "Step into your next version. Members can grow into Bloom Leaders, help co-create editions, or even host events — shaping the movement from within.",
    },
    {
      title: "Purpose-Driven Experiences Beyond Retreats",
      icon: comm6,
      description:
        "BloomLand is not just a destination — it’s a living wellness ecosystem. Stay engaged through digital events, wellness drop-ins, and a conscious calendar of seasonal moments.",
    },

    {
      title: "One Retreat May Change Your Life — This Tribe Helps You Live It",
      icon: comm7,
      description:
        "Join BloomLand and become part of a lifelong community built on intention, healing, and shared evolution.",
    },
  ];
  const navigate = useNavigate();
  const handleJoin = async () => {
    if (token) {
      if (isValid) {
        if (detailsSubmitted) {
          joinCommunity({ token: token, setLoading: setLoading });
        } else {
          dispatch(setSelected("/community"));
          navigate("/details");
        }
      } else {
        dispatch(setSelected("/community"));
        navigate("/auth/login");
      }
    } else {
      dispatch(setSelected("/community"));
      navigate("/auth/login");
    }
  };

  return (
    <>
      <Navbar />
      <div className="md:mt-[53px] mt-[47px] md:py-20 py-5 md:max-w-[80%] max-w-full mx-auto">
        <div className="flex flex-wrap justify-center gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex max-w-[300px] flex-col items-center text-center space-y-4"
            >
              {/* Placeholder Image */}
              {/* <div className="w-24 h-24 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
                </div>
              </div> */}
              <img src={benefit.icon} alt="" className="p-3 w-40" />

              {/* Title */}
              <h3 className="text-lg font-semibold text-[#E16B33] leading-tight">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full justify-center">
        {loading ? (
          <div className="bg-[#E16B33] px-10 py-2 rounded-md text-white my-10 flex items-center justify-center">
            <ClipLoader size={20} color="#fff" />
          </div>
        ) : (
          <button
            onClick={handleJoin}
            className="bg-[#E16B33] px-4 py-2 rounded-lg text-white my-10 cursor-pointer hover:bg-white hover:text-black hover:border-[#E16B33] border-2 border-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            Join Community!
          </button>
        )}
      </div>

      <SectionHeader title={"FAQ"} lineColor={"bg-[#FF6759]"} />
      <section className="md:max-w-[80%] max-w-full mx-auto md:mt-10 mt-10 px-4">
        <Faq />
      </section>
      <section className="md:max-w-[80%] max-w-full mx-auto md:mt-10 px-4">
        <Socials />
      </section>
      <Footer />

      <div className="fixed bottom-0 left-0 w-full h-fit">
        <div className="flex items-center justify-center w-full bg-transparent md:p-8 p-4">
          <div className="w-full bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              {/* Price Section */}
              <div className="flex md:flex-row flex-col items-center space-x-2">
                <span className="text-3xl text-gray-600 font-medium">₹</span>
                <span className="md:text-4xl text-lg font-bold text-gray-900">
                  0.00
                </span>
              </div>

              {/* Button Section */}
              <button
                onClick={handleJoin}
                disabled={loading}
                className="bg-[#E16B33] hover:bg-white hover:text-black hover:border-[#E16B33] text-white font-semibold py-3 md:px-8 px-2 rounded-xl border-2 border-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                {loading ? (
                  <ClipLoader size={20} color="#fff" />
                ) : (
                  "Join Community"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Community;
