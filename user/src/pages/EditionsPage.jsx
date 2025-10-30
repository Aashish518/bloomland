import React, { useEffect, useState } from "react";
import Editions from "../components/home/Editions";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import SectionHeader from "../components/common/SectionHeader";
import Socials from "../components/about/Socials";
import { useSelector } from "react-redux";
import EventCarousel from "../components/event/EventCarousel";

const EditionsPage = () => {
  const [events, setEvents] = useState(null);
  const Event = useSelector((state) => state.event.events);
  // useEffect(() => {
  //   setEvents(
  //     [...Event.events]
  //       .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
  //       .filter((e) => new Date(e.start_date) > Date.now())
  //   );
  // }, [Event]);
  return (
    <div>
      <Navbar />
      <div className="lg:mt-[53px] mt-[47px]">
        <div className="md:pb-10">
          <SectionHeader title={"Our Editions"} lineColor={"bg-[#3CA18F]"} />
        </div>
        <Editions />
      </div>

      <section className="">
        <SectionHeader title={"Upcoming Events"} lineColor={"bg-[#3CA18F]"} />
        <div className="container mx-auto ">
          <EventCarousel events={Event} />
        </div>
      </section>

      <div className="container mx-auto px-4">
        <Socials />
      </div>
      <Footer />
    </div>
  );
};

export default EditionsPage;
