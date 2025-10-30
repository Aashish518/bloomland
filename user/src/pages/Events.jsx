/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import HikerImg from "../assets/hiker.webp";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import Navbar from "../components/home/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { joinEvent, sendRequest } from "../services/operations/event";
import { setSelected } from "../store/slices/authSlice";
import Card from "../components/event/Card";
import Banner from "../assets/banner.png";
import SectionHeader from "../components/common/SectionHeader";
import Footer from "../components/home/Footer";
import GutHealth from "../assets/gut-health.png";
import Expect from "../components/event/Expect";
import Faq from "../components/about/Faq";
import Socials from "../components/about/Socials";
import EventCarousel from "../components/event/EventCarousel";

const EventsPage = () => {
  const location = useLocation();
  const [edition, setEdition] = useState(null);
  const [isAllowed, setIsAllowed] = useState(false);
  const { level } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { token, detailsSubmitted } = useSelector((state) => state.auth);
  const { requests, approved } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const currPage = location.pathname.split("/");
    setEdition(currPage[currPage.length - 1]);
  }, [location]);

  useEffect(() => {
    if (edition === "day0" && level > 0) {
      setIsAllowed(true);
    } else if (edition === "10x" && level > 1) {
      setIsAllowed(true);
    } else if (edition === "100x" && level > 2) {
      setIsAllowed(true);
    } else {
      setIsAllowed(false);
    }
  }, [level, edition]);

  const [events, setEvents] = useState(null);
  const Event = useSelector((state) => state.event);
  useEffect(() => {
    setEvents(
      Event.events.filter(
        (e) => e.category === edition && new Date(e.start_date) > Date.now()
      )
    );
  }, [Event, edition]);

  const editionsData = {
    day0: {
      heading: "Day 0",
      description:
        "The Day-0 Edition is your first step into the world of BloomLand, offering a fun, hands-on experience for anyone curious about wellness or in need of a quick reset. This isn’t your average wellness workshop — it’s designed to help you reconnect with your body, mind, and soul in a supportive community setting. Whether you're just beginning your wellness journey or simply looking for a boost, this edition will leave you feeling lighter, energized, and ready to take the next step",
      duration: "3 - 4 Hours",
      perfect: "First-time explorers of holistic health",
      expect: [
        {
          id: 1,
          Icon: GutHealth,
          title: "Meditation for Clarity",
          description: "Guided meditation to clear your mind",
        },
        {
          id: 2,
          Icon: GutHealth,
          title: "Energy Healing for Rejuvenation",
          description: "Energy healing to feel recharged",
        },
        {
          id: 3,
          Icon: GutHealth,
          title: "Holistic Nutrition Tips",
          description: "Holistic nutrition tips to fuel your body",
        },
        {
          id: 4,
          Icon: GutHealth,
          title: "Connecting with Like-Minded Souls",
          description: "Community connection with like-minded souls",
        },
      ],
    },
    "10x": {
      heading: "10x",
      description:
        "This 3-night, 4-day adventure is the ultimate weekend retreat for anyone seeking a reset of the mind and body while also having fun! Escape to breathtaking, nature-filled locations where you’ll immerse yourself in healing workshops, energy-clearing practices, and community-building activities. You’ll leave feeling recharged, rebalanced, and ready to approach life with a fresh, vibrant perspective.",
      duration: "3 Nights, 4 Days",
      perfect:
        "People looking for a quick getaway that leaves you refreshed and reset",
      expect: [
        {
          id: 1,
          Icon: GutHealth,
          title: "Holistic Health Workshops",
          description: "Gut, Physical and emotional health workshops",
        },
        {
          id: 2,
          Icon: GutHealth,
          title: "Soul-Aligned Experiences",
          description: "Soul-aligned group activities",
        },
        {
          id: 3,
          Icon: GutHealth,
          title: "High-Energy Stress Relief",
          description: "High-energy sessions for stress relief",
        },
        {
          id: 4,
          Icon: GutHealth,
          title: "Wholesome Organic Meals",
          description: "Local, organic meals that will make you feel great!",
        },
      ],
    },
    "100x": {
      heading: "100x",
      description:
        "If you're ready for the ultimate wellness experience, this is it! The Bloom100* Edition offers a full system reset for your body, mind, and soul. Over 7 days in stunning locations, you’ll experience deep healing, energy balancing, and purpose-driven workshops designed to re-align your life. This is the perfect chance to fully immerse yourself in a transformational experience and leave with more clarity, energy, and peace than ever before.",
      duration: "7 Nights, 8 Days",
      perfect:
        "People who are ready to go all-in on their wellness journey and transform from the inside out",
      expect: [
        {
          id: 1,
          Icon: GutHealth,
          title: "Holistic Healing Experience",
          description: "Deep Holistic Healing",
        },
        {
          id: 2,
          Icon: GutHealth,
          title: "Transformational Coaching",
          description: "Transformational Coaching Sessions",
        },
        {
          id: 3,
          Icon: GutHealth,
          title: "Nutrient-Rich Meal Plans",
          description: "Nutrient-Dense Meals",
        },
        {
          id: 4,
          Icon: GutHealth,
          title: "Wellness Immersion",
          description: "Immersive Wellness Activities",
        },
        {
          id: 5,
          Icon: GutHealth,
          title: "Exclusive Support Community",
          description: "Exclusive Community Support",
        },
      ],
    },
  };

  const handleRequest = (eventId) => {
    if (!token) {
      console.log(window.location.pathname);
      dispatch(setSelected(window.location.pathname));
      navigate("/auth/login");
    } else {
      if (!detailsSubmitted) {
        dispatch(setSelected(window.location.pathname));
        navigate("/auth/login");
      } else {
        if (isAllowed) {
          dispatch(joinEvent({ token, eventId }));
        } else {
          dispatch(sendRequest({ token: token, eventId: eventId }));
        }
      }
    }
  };

  const isApproved = (eventId) => {
    const temp = approved.map((e) => e._id);
    if (temp.includes(eventId)) {
      return true;
    } else {
      return false;
    }
  };

  const requestSent = (eventId) => {
    const temp = requests.map((e) => e._id);
    if (temp.includes(eventId)) {
      return true;
    } else {
      return false;
    }
  };

  if (!edition) {
    return <div>Loading....</div>;
  }

  return (
    <div className="bg-white">
      <Navbar />

      <div className="md:mt-[53px] mt-[47px]">
        {/* BANNER SECTION */}
        <div className="bg-gradient-to-b from-[#C1EDF1] to-white md:pt-10 pt-8 via-white ">
          <div className="md:max-w-[80%] max-w-full px-4 mx-auto md:py-10">
            {/* EDITION NAME */}
            <h1 className="text-[#E16B33] md:text-3xl text-3xl font-medium text-center">
              {editionsData[edition].heading} Edition
            </h1>

            {/* DESCRIPTIOM */}
            <p className=" mx-auto text-center md:text-[20px] md:my-10 my-5 font-medium">
              {editionsData[edition].description}
            </p>
          </div>
        </div>
        <div className=" md:max-w-[80%] max-w-full px-4 mx-auto">
          {/* ADDITIONAL DETAILS */}
          <div className="flex gap-4 text-[#E16B33] font-light justify-center items-center md:text-[20px] text-[14px]">
            <div className="flex gap-4">
              <div className="flex md:flex-row  gap-2">
                <p className="md:text-start text-center">Duration: </p>
                <span className="font-semibold md:text-start text-center">
                  {editionsData[edition].duration}
                </span>
              </div>
              <p>|</p>
              <div className="flex md:flex-row gap-2">
                <p className="md:text-start text-center">Perfect For: </p>
                <span className="font-bold md:text-start text-center">
                  {editionsData[edition].perfect}
                </span>
              </div>
            </div>
          </div>

          {/* IMAGE */}
          <div className="my-10 h-[350px]">
            <img
              src={Banner}
              alt=".."
              className="h-full w-full object-cover"
              style={{ objectPosition: "0% 30%" }}
            />
          </div>
        </div>
      </div>

      <section className="">
        <SectionHeader title={"Upcoming Events"} lineColor={"bg-[#3CA18F]"} />
        <div className="container mx-auto ">
          <EventCarousel events={events} />
        </div>
      </section>

      <section className="">
        <SectionHeader title={"What To Expect"} lineColor={"bg-[#3CA18F]"} />
        <Expect data={editionsData[edition].expect} />
        <div className="my-5 h-[350px] container mx-auto px-4">
          <img
            src={Banner}
            alt=".."
            className="h-full w-full object-cover"
            style={{ objectPosition: "0% 30%" }}
          />
        </div>
      </section>

      <section className="container mx-auto">
        <SectionHeader title={"FAQS"} lineColor={"bg-[#3CA18F]"} />
        <div className="pt-20 pb-5 px-4">
          <Faq />
        </div>
      </section>

      <div className="container mx-auto px-4">
        <Socials />
      </div>

      <Footer />
    </div>
  );
};

export default EventsPage;
