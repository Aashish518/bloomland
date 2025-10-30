import React, { useState, useEffect, useRef, Suspense } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import Image1 from "../../assets/OurEditions-0x.jpg";
import Image3 from "../../assets/OurEditions-10x.jpg";
import Image2 from "../../assets/OurEditions-100x.jpg";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setSelected } from "../../store/slices/authSlice";
import { X } from "lucide-react";
import Logo from "../../assets/BL_Whitelogo.png";
import UserProfile from "./UserProfile";
import LogoutModal from "../common/LogoutModal";
// import logo from "../../assets/logo.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [isEditionsHovered, setIsEditionsHovered] = useState(false);
  const { token } = useSelector((state) => state.auth);
  // const editionsRef = useRef(null);
  const { isValid, detailsSubmitted } = useSelector((state) => state.auth);
  const dropdownTimeoutRef = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const mergeBgs = ["/", "/blogs", "/about"];

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Better hover handling with delay and cleanup
  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsEditionsHovered(true);
  };

  const handleMouseLeave = () => {
    // Add slight delay before closing to prevent flickering
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsEditionsHovered(false);
    }, 100);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const onClose = () => {
    setConfirmModal(false);
  };

  // Sample editions data
  const editionsData = [
    {
      id: 1,
      title: "Day 0",
      image: Image1,
      description:
        "Begin your blooming journey with Day-0 edition — where healing meets community, and intention meets action.",
      href: "/editions/day0",
    },
    {
      id: 2,
      title: "10x",
      image: Image2,
      description:
        "Heal, expand, and bloom into your highest self — across the world’s most inspiring destinations.",
      href: "/editions/10x",
    },
    {
      id: 3,
      title: "100x",
      image: Image3,
      description:
        "The Ultimate Reset. A Journey Back to Your Purest, Highest Self.",
      href: "/editions/100x",
    },
  ];

  const handleNavigate = () => {
    const pages = location.pathname.split("/");
    const page = pages[pages.length - 1];

    if (isValid) {
      if (detailsSubmitted) {
        navigate("/editions");
      } else {
        let selected;
        if (page === "day0") {
          selected = "/editions/day0";
        } else if (page === "10x") {
          selected = "/editions/10x";
        } else if (page === "100x") {
          selected = "/editions/100x";
        } else {
          selected = "/editions";
        }

        dispatch(setSelected(selected));
        navigate("/details");
      }
    } else {
      let selected;
      if (page === "day0") {
        selected = "/editions/day0";
      } else if (page === "10x") {
        selected = "/editions/10x";
      } else if (page === "100x") {
        selected = "/editions/100x";
      } else {
        selected = "/editions";
      }
      dispatch(setSelected(selected));
      navigate("/auth/login");
    }
  };

  const handleMenuClick = (item) => {
    navigate(item.href);
  };

  return (
    <>
      <motion.div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || !mergeBgs.includes(location.pathname)
            ? "bg-[#E16B33] shadow-md py-2"
            : "bg-transparent py-4"
        }`}
        // initial={{ y: -100 }}
        // animate={{ y: 0 }}
        // transition={{ duration: 0.1 }}
      >
        <div
          className={`md:max-w-[80%] max-w-full mx-auto px-4 flex items-center justify-between `}
        >
          {/* Logo/Brand */}
          <motion.div
            onClick={() => navigate("/")}
            className="flex-1 bg-transparent cursor-pointer p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* <h1
              className={`md:text-2xl text-lg font-bold text-white
            //   scrolled || window.location.pathname === "/" ? "white" : "black"
            // }`}
            >
              BloomLand
            </h1> */}
            <img
              src={Logo}
              alt="LOGO"
              className="w-auto xl:pl-8 md:pr-3 md:h-12 h-10 object-contain p-0"
            />
            {/* <Logo className="h-20 w-20 p-0 m-0" /> */}
          </motion.div>

          {/* Mobile Menu Button - only visible on small screens */}
          <div className="lg:hidden z-50">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Navigation items - centered (desktop) */}
          <motion.div
            className="flex-1 hidden lg:flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ul className={`flex items-center gap-6 text-sm text-white`}>
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Blogs", href: "/blogs" },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
                  onClick={() => navigate(`${item.href}`)}
                >
                  <motion.div
                    className={`hover:text-[#F7C199]
                  } transition-colors relative cursor-pointer`}
                    whileHover="hover"
                    initial="rest"
                    animate="rest"
                  >
                    {item.label}
                    <motion.span
                      className="absolute bottom-0 left-0 h-0.5 bg-[#E16B33] origin-left"
                      variants={{
                        rest: { scaleX: 0 },
                        hover: { scaleX: 1 },
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </motion.li>
              ))}

              {/* Editions with dropdown */}
              <li
                className="relative opacity-100"
                style={{
                  transition: "opacity 0.3s, transform 0.3s",
                  transitionDelay: "0.3s",
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className={`hover:text-[#F7C199] transition-colors relative cursor-pointer ${
                    isEditionsHovered ? "text-[#E16B33]" : ""
                  }`}
                  onClick={() => {
                    // e.stopPropagation();
                    navigate("/editions");
                  }}
                >
                  Editions
                  <span
                    className="absolute bottom-0 left-0 h-0.5 bg-[#E16B33] origin-left"
                    style={{
                      transform: isEditionsHovered ? "scaleX(1)" : "scaleX(0)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                  {/* Mega Dropdown */}
                  <div
                    className="absolute left-1/2 mt-6 w-screen max-w-6xl z-50"
                    style={{
                      opacity: isEditionsHovered ? 1 : 0,
                      visibility: isEditionsHovered ? "visible" : "hidden",
                      transform: `translate(-50%, ${
                        isEditionsHovered ? "0" : "-20px"
                      })`,
                      transition:
                        "opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease",
                      pointerEvents: isEditionsHovered ? "auto" : "none",
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Arrow indicator */}
                    <div
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"
                      style={{
                        opacity: isEditionsHovered ? 1 : 0,
                        transition: "opacity 0.2s ease",
                      }}
                    >
                      <div className="w-4 h-4 bg-[#E16B33] rotate-45 transform origin-bottom-left"></div>
                    </div>

                    {/* Dropdown content */}
                    <div
                      className="bg-[#E16B33] rounded-lg shadow-xl overflow-hidden"
                      style={{
                        opacity: isEditionsHovered ? 1 : 0,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      <div className="flex gap-3 p-8 text-black">
                        {editionsData.map((edition, index) => (
                          <div
                            key={edition.id}
                            className={`flex-1 rounded-lg p-4 ${
                              edition.title === "Day 0"
                                ? "bg-[#C1E1C1]"
                                : edition.title === "10x"
                                ? "bg-[#9BC3D3]"
                                : "bg-[#c3bad1]"
                            }`}
                            style={{
                              opacity: isEditionsHovered ? 1 : 0,
                              transform: isEditionsHovered
                                ? "translateY(0)"
                                : "translateY(15px)",
                              transition:
                                "opacity 0.3s ease, transform 0.3s ease",
                              transitionDelay: `${0.1 * index}s`,
                            }}
                          >
                            <div
                              className="overflow-hidden rounded-lg mb-4"
                              style={{ transition: "transform 0.2s ease" }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.transform =
                                  "scale(1.03)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                              }
                            >
                              <img
                                src={edition.image}
                                alt={edition.title}
                                className="w-full h-64 object-cover object-center"
                                style={{
                                  transform: isEditionsHovered
                                    ? "scale(1)"
                                    : "scale(1.1)",
                                  opacity: isEditionsHovered ? 1 : 0.9,
                                  transition:
                                    "transform 0.4s ease, opacity 0.4s ease",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.transform =
                                    "scale(1.08)")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.transform = "scale(1)")
                                }
                              />
                            </div>
                            <h3
                              className="text-xl font-semibold mb-2 text-black allSeasonFont "
                              style={{
                                opacity: isEditionsHovered ? 1 : 0,
                                transform: isEditionsHovered
                                  ? "translateX(0)"
                                  : "translateX(-10px)",
                                transition:
                                  "opacity 0.3s ease, transform 0.3s ease",
                                transitionDelay: `${0.1 + index * 0.1}s`,
                              }}
                            >
                              {edition.title}
                            </h3>
                            <p
                              className="text-sm text-black"
                              style={{
                                opacity: isEditionsHovered ? 1 : 0,
                                transition: "opacity 0.3s ease",
                                transitionDelay: `${0.2 + index * 0.1}s`,
                              }}
                            >
                              {edition.description}
                            </p>
                            <button
                              className="mt-4 bg-white text-[#E16B33] px-4 py-2 rounded text-sm hover:bg-[#F9A26B] hover:text-white "
                              style={{
                                opacity: isEditionsHovered ? 1 : 0,
                                transform: isEditionsHovered
                                  ? "translateY(0)"
                                  : "translateY(8px)",
                                transition:
                                  "opacity 0.2s ease, transform 0.2s ease, background-color 0.2s ease",
                                transitionDelay: `${0.3 + index * 0.1}s`,
                              }}
                              onMouseDown={(e) =>
                                (e.currentTarget.style.transform =
                                  "scale(0.95)")
                              }
                              onMouseUp={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(edition.href);
                              }}
                            >
                              View Details
                            </button>
                          </div>
                        ))}
                      </div>
                      <div
                        className="bg-gray-50 px-8 py-4 flex justify-between items-center"
                        style={{
                          opacity: isEditionsHovered ? 1 : 0,
                          transition: "opacity 0.3s ease",
                          transitionDelay: "0.2s",
                        }}
                      >
                        <p className="text-sm text-[#E16B33]">
                          Explore all our exclusive editions
                        </p>
                        <button
                          className="text-[#E16B33] hover:text-black font-medium text-sm flex items-center gap-1"
                          style={{
                            transition: "color 0.3s ease, transform 0.2s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform =
                              "translateX(5px)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "translateX(0)")
                          }
                          onClick={() => navigate("/editions")}
                        >
                          View All Editions
                          <span className="arrow-animation">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              {[
                { label: "Contact", href: "/contact" },
                { label: "Pricing", href: "/pricing" },
                { label: "Community", href: "/community" },
              ].map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + 0.1 * index }}
                  onClick={() => navigate(item.href)}
                  className=""
                >
                  <motion.div
                    className="hover:text-[#F7C199] transition-colors relative cursor-pointer"
                    whileHover="hover"
                    initial="rest"
                    animate="rest"
                  >
                    {item.label}
                    <motion.span
                      className="absolute bottom-0 left-0 h-0.5 bg-[#E16B33] origin-left"
                      variants={{
                        rest: { scaleX: 0 },
                        hover: { scaleX: 1 },
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Button (desktop) */}
          <motion.div
            className="flex-1 hidden lg:flex flex-row gap-4 justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button
              className={`bg-[#E16B33] cursor-pointer text-white px-6 py-2 rounded-md flex justify-center items-center hover:text-black hover:bg-white transition-colors ${
                !(mergeBgs.includes(location.pathname) && !scrolled) && "border"
              } border-white`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNavigate}
            >
              <span className="text-sm tracking-wide font-medium whitespace-nowrap ">
                Request Invite
              </span>
            </motion.button>
            {token && <UserProfile setConfirmModal={setConfirmModal} />}
          </motion.div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center lg:hidden z-[1000]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="absolute top-4 right-4"
                  onClick={() => setMenuOpen(false)}
                >
                  <X color="white" />
                </div>
                <motion.ul
                  className="flex flex-col items-center gap-8 text-white text-2xl"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: {},
                    visible: {},
                  }}
                >
                  {[
                    { label: "Home", href: "/" },
                    { label: "About", href: "/about" },
                    { label: "Blogs", href: "/blogs" },
                    { label: "Editions", href: "/editions" },
                    { label: "Contact", href: "/contact" },
                    { label: "Program Fee", href: "/pricing" },
                    { label: "Community", href: "/community" },
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { delay: 0.1 * index },
                        },
                      }}
                      onClick={() => handleMenuClick(item)}
                    >
                      <div className="hover:text-[#E16B33] transition-colors">
                        {item.label}
                      </div>
                    </motion.li>
                  ))}
                  <motion.li
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.5 },
                      },
                    }}
                    className="mt-6"
                  >
                    <motion.button
                      className="bg-[#E16B33] text-white px-8 py-3 rounded-md flex justify-center items-center hover:bg-[#6a1e4c] transition-colors cursor-pointer"
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNavigate}
                    >
                      <span className="text-sm font-semibold whitespace-nowrap ">
                        Request Invite
                      </span>
                    </motion.button>
                  </motion.li>
                </motion.ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <style jsx="true">{`
          .arrow-animation {
            display: inline-block;
            animation: moveArrow 1.2s infinite ease-in-out;
          }

          @keyframes moveArrow {
            0%,
            100% {
              transform: translateX(0);
            }
            50% {
              transform: translateX(4px);
            }
          }
        `}</style>
      </motion.div>

      {confirmModal && <LogoutModal onClose={onClose} isOpen={confirmModal} />}
    </>
  );
};

export default Navbar;
