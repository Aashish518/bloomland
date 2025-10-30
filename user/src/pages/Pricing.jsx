import React, { useState } from "react";
import { Leaf, Star, Heart, Users, CheckCircle, Sparkles } from "lucide-react";
import Footer from "../components/home/Footer";
import Navbar from "../components/home/Navbar";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setSelected } from "../store/slices/authSlice";

const Pricing = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isValid, detailsSubmitted } = useSelector((state) => state.auth);

  const editions = [
    {
      id: "BloomX",
      name: "BloomX",
      subtitle: "Entry point to your wellness journey",
      duration: "3–4 Hours",
      priceINR: "₹2,000–₹5,000",
      priceUSD: "$25–$60",
      description:
        "A short, immersive event offering a taste of holistic healing, guided sessions, and community energy. Ideal for first-timers who want to explore.",
      gradient: "from-[#C1E1C1] to-[#A8D5A8]",
      bgGradient: "from-[#F0F8F0] to-[#E8F5E8]",
      icon: Leaf,
      popular: false,
      navigate: "/editions/day0",
    },
    {
      id: "bloom10x",
      name: "Bloom10x",
      subtitle: "The ultimate weekend reset",
      duration: "3 Nights, 4 Days",
      priceINR: "₹85,000–₹1.2L",
      priceUSD: "$1,000–$1,500",
      description:
        "This edition is packed with high-impact sessions on gut health, emotional release, and energy work — all in premium healing locations with handpicked global facilitators.",
      gradient: "from-[#9BC3D3] to-[#7BADC7]",
      bgGradient: "from-[#F0F6F9] to-[#E8F2F6]",
      icon: Star,
      popular: true,
      navigate: "/editions/10x",
    },
    {
      id: "bloom100x",
      name: "Bloom100x",
      subtitle: "Your full-system life reset",
      duration: "7 Nights, 8 Days",
      priceINR: "₹2.5L–₹3.5L",
      priceUSD: "$3,000–$4,500",
      description:
        "The most immersive and transformational BloomLand experience. Includes full-circle healing, life design coaching, energy clearing, personal mentorship, and lifetime access to post-retreat integration tools.",
      gradient: "from-[#3F3351] to-[#2D2440]",
      bgGradient: "from-[#F5F4F6] to-[#EFEFF2]",
      icon: Sparkles,
      popular: false,
      navigate: "/editions/100x",
    },
  ];

  const included = [
    "Curated healing experiences with expert facilitators",
    "Clean, gut-nourishing meals prepared with intention",
    "Energy practices, meditations, movement, and emotional release",
    "Access to the BloomLand community post-retreat",
    "Integration tools and optional follow-ups",
  ];

  const testimonials = [
    "This was not a trip. This was a reset button I didn't know I needed.",
    "The value I received is 10x what I paid — emotionally, physically, and spiritually.",
  ];

  const handleNavigate = (item) => {
    if (isValid) {
      if (detailsSubmitted) {
        navigate(`${item.navigate}`);
      } else {
        dispatch(setSelected(`${item.navigate}`));
        navigate("/details");
      }
    } else {
      dispatch(setSelected(`${item.navigate}`));
      navigate("/auth/login");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#FFF1EB]  to-white md:mt-[53px] mt-[47px]">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b text-black">
          {/* <div className="absolute inset-0 bg-black opacity-10"></div> */}
          <div className="relative max-w-6xl mx-auto px-6 py-20">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
                <Leaf className="w-4 h-4" />
                <span>Program Fees</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Program Fees That Reflect
                <span className="block bg-gradient-to-r from-[#E16B33] to-orange-300 bg-clip-text text-transparent">
                  Real Transformation
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-black max-w-3xl mx-auto leading-relaxed">
                We don't price for the experience — we price for the impact it
                creates in your life.
              </p>
            </div>
          </div>
          {/* <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent"></div> */}
        </div>

        {/* Why Our Editions Section */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Why Our Editions Are Priced the Way They Are
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At BloomLand, we believe true wellness isn't a luxury — it's a
              life reset.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: Heart,
                title: "Depth of Transformation",
                desc: "Real, lasting change you receive",
              },
              {
                icon: Star,
                title: "Global Facilitators",
                desc: "Quality coaches and healers involved",
              },
              {
                icon: Leaf,
                title: "Curated Environment",
                desc: "World-class venues to gut-healthy meals",
              },
              {
                icon: Users,
                title: "Aligned Community",
                desc: "Intimate, connected experiences",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-[#E16B33] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl transition-shadow">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl p-8">
            <p className="text-lg text-gray-700 italic">
              This isn't just about what happens during the experience — it's
              about what stays with you long after.
            </p>
          </div>
        </div>

        {/* Edition Pricing Tiers */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-[#FFF1EB] rounded-full px-6 py-2 text-[#E16B33] font-medium mb-4">
              <Leaf className="w-4 h-4" />
              <span>Our Edition Pricing Tiers</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800">
              Choose Your Transformation Journey
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {editions.map((edition) => {
              const IconComponent = edition.icon;
              return (
                <div
                  key={edition.id}
                  className={`relative rounded-3xl overflow-hidden transition-all duration-500 ${
                    hoveredCard === edition.id
                      ? "scale-105 shadow-2xl"
                      : "shadow-lg hover:shadow-xl"
                  } ${edition.popular ? "" : ""}`}
                  onMouseEnter={() => setHoveredCard(edition.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* {edition.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )} */}

                  <div
                    className={`bg-gradient-to-br ${edition.bgGradient} p-8 h-full`}
                  >
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${edition.gradient} rounded-xl flex items-center justify-center`}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">
                            {edition.name}
                          </h3>
                          <p className="text-gray-600 font-medium">
                            {edition.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <span className="font-medium">Duration:</span>
                          <span>{edition.duration}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div
                          className={`text-3xl font-bold bg-gradient-to-r ${edition.gradient} bg-clip-text text-transparent`}
                        >
                          {edition.priceINR}
                        </div>
                        <div className="text-lg text-gray-600">
                          {edition.priceUSD}
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed">
                        {edition.description}
                      </p>

                      <button
                        onClick={() => handleNavigate(edition)}
                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r ${edition.gradient} text-white hover:shadow-lg transform hover:-translate-y-1 cursor-pointer`}
                      >
                        Choose This Edition
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* What's Included Section */}
        <div className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                What's Always Included
              </h2>
              <p className="text-lg text-gray-600">
                Every BloomLand experience comes with these essential elements
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {included.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 rounded-xl bg-[#FFF1EB] hover:bg-[#edc5b2] transition-colors"
                >
                  <CheckCircle className="w-6 h-6 text-[#E16B33] flex-shrink-0 mt-1" />
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-16 text-black">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Why People Say It's Worth It
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-[#FFF1EB] hover:bg-[#edc5b2] backdrop-blur-sm rounded-2xl p-8  transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 fill-[#E16B33]" />
                    </div>
                    <blockquote className="text-lg italic leading-relaxed">
                      "{testimonial}"
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className=" py-20 text-black">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 text-2xl font-bold">
                <Leaf className="w-8 h-8" />
                <span>We Price With Purpose. We Deliver With Heart.</span>
              </div>

              <p className="text-xl leading-relaxed text-black">
                We believe your growth deserves a space that is intentionally
                built, thoughtfully curated, and deeply transformative.
              </p>

              <p className="text-lg text-black">
                Every rupee or dollar you invest in a BloomLand edition is an
                investment in your health, clarity, and life force.
              </p>

              <div className="pt-8">
                <button className="bg-white text-[#E16B33] px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Not sure which edition is right for you? Let us help you
                  choose the path that fits your current chapter.
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Pricing;
