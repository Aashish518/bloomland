// faq.jsx
import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-[#6DB8AB] rounded-lg mb-4 overflow-hidden h-auto bg-white">
      <button
        className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-900 md:text-base text-sm">
          {title}
        </span>
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronRight className="h-5 w-5 text-[#6DB8AB]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ position: "relative" }}
          >
            <div className="p-4 pt-0 text-gray-700 text-sm md:text-base">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Faq = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-2 flex-col md:flex-row flex-wrap ">
      {/* <div className="flex flex-col w-full md:w-[calc(50%-12px)]"> */}
      <div className="col-span-1">
        <AccordionItem title="What is BloomLand?">
          <p>
            BloomLand is a global community dedicated to holistic health,
            emotional healing, and conscious living. We offer transformative
            retreats, festivals, and wellness experiences that help individuals
            reset their body, mind, and soul while connecting with a supportive,
            like-minded tribe..
          </p>
        </AccordionItem>
      </div>

      <div className="col-span-1">
        <AccordionItem title="Who can join BloomLand experiences?">
          <p>
            Our experiences are invite-only, curated for individuals who are
            aligned with BloomLand’s values of growth, healing, and
            authenticity. Whether you are just starting your journey or you’re
            experienced in wellness, we welcome all who are ready for deep
            transformation.
          </p>
        </AccordionItem>
      </div>

      <div className="col-span-1">
        <AccordionItem title="How do I apply for an invite to BloomLand editions?">
          <p>
            To join any of our exclusive BloomLand editions, you can apply by
            filling out an application form where we ask about your personal
            journey, goals, and readiness for transformation. Once reviewed,
            you’ll receive an invitation if you’re aligned with our community’s
            energy.
          </p>
        </AccordionItem>
      </div>
      {/* </div> */}

      {/* <div className="flex flex-col w-full md:w-[calc(50%-12px)]"> */}
      <div className="col-span-1">
        <AccordionItem title="How is BloomLand different from other wellness retreats?">
          <p>
            BloomLand doesn’t just offer a retreat — it offers a full-system
            reset. We combine ancient healing practices with modern wellness
            science, guided by world-class facilitators. We focus on
            long-lasting transformation rather than temporary fixes, and provide
            a safe, supportive community to hold space for your growth.
          </p>
        </AccordionItem>
      </div>

      <div className="col-span-1">
        <AccordionItem title="What can I expect from a BloomLand edition?">
          <p>
            Expect holistic health resets, gut-health optimization, emotional
            release, soulful workshops, and a vibrant, supportive community.
            Each experience blends physical, emotional, and spiritual healing
            practices that will leave you feeling rejuvenated, aligned, and
            inspired.
          </p>
        </AccordionItem>
      </div>

      <div className="col-span-1">
        <AccordionItem title="Is BloomLand only for entrepreneurs or founders?">
          <p>
            While many of our participants are entrepreneurs, leaders, and
            creators, BloomLand is open to anyone who is ready for deep personal
            growth and holistic healing. Our community includes people from all
            walks of life who are on a path to personal transformation.
          </p>
        </AccordionItem>
      </div>
      <div className="col-span-1">
        <AccordionItem title="What if I’m new to holistic health and wellness? Is BloomLand still the right fit for me?">
          <p>
            Absolutely! No prior experience is needed to join BloomLand. Whether
            you're just beginning your journey or have been exploring wellness
            for years, our experiences are designed to meet you exactly where
            you are. BloomLand provides a safe, supportive environment for
            anyone committed to growth, healing, and transformation — regardless
            of experience level. We’re here to guide you every step of the way.
          </p>
        </AccordionItem>
      </div>

      <div className="col-span-1">
        <AccordionItem title="How does the cost of a BloomLand experience compare to other retreats?">
          <p>
            At BloomLand, we believe in Fair pricing and offering premium value
            through deeply transformative experiences. While many retreats focus
            on temporary relaxation, our holistic healing journeys provide
            lasting change and emotional growth. Our pricing reflects the
            curated expertise, world-class facilitators, and luxury settings
            that make BloomLand a one-of-a-kind experience. We ensure that every
            participant receives not only a retreat but a life-changing reset,
            designed to bring clarity, energy, and alignment to your
            journey.While some retreats may be more accessible, BloomLand offers
            unmatched depth, personalization, and lifelong benefits — making it
            an investment in your mind, body, and spirit.
          </p>
        </AccordionItem>
      </div>

      <div className="col-span-1">
        <AccordionItem title="How do I stay connected to BloomLand after the retreat?">
          <p>
            As a BloomLand community member, you will have access to a global
            network, online events, workshops, and future retreats. We are
            committed to creating lifelong connections, so even after your
            retreat, BloomLand remains a part of your ongoing journey.
          </p>
        </AccordionItem>
      </div>

      <div className="col-span-1">
        <AccordionItem title="How can I stay updated on upcoming BloomLand events?">
          <p>
            To stay updated on our latest retreats, festivals, and community
            events, simply sign up for our newsletter or follow us on Instagram
            and other social media platforms. You’ll get exclusive updates,
            invitations, and early access to events.
          </p>
        </AccordionItem>
      </div>

      <div className="col-span-1">
        <AccordionItem title="What if I have more questions or need help applying?">
          <p>
            If you have any further questions or need assistance with your
            application, feel free to reach out to us via our Contact Page or
            email us directly. We are here to guide and support you on your
            transformative journey with BloomLand.
          </p>
        </AccordionItem>
      </div>
    </div>
    // </div>
  );
};

export default Faq;
