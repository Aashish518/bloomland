import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { submitDetails } from "../services/operations/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import logo from "../assets/BL_Whitelogo.png";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { logout } from "../store/slices/authSlice";

export default function Details() {
  // Current section state
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const { token, isValid, detailsSubmitted, selected } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const checkIsValid = () => {
  //     if (!token) {
  //       navigate("/auth/login");
  //       return;
  //     }
  //     if (!isValid) {
  //       dispatch(logout());
  //       navigate("/auth/login");
  //       return;
  //     }
  //     if (detailsSubmitted) {
  //       navigate("/dashboard");
  //     }
  //   };
  //   checkIsValid();
  // }, [token, isValid, detailsSubmitted]);

  // Form state
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState(new Date().toISOString().split("T")[0]);
  const [journey, setJourney] = useState("");
  const [experience, setExperience] = useState([]);
  const [reason, setReason] = useState([]);
  const [reasonOther, setReasonOther] = useState("");
  const [area, setArea] = useState([]);
  const [state, setState] = useState("");
  const [bloom, setBloom] = useState([]);
  const [ready, setReady] = useState("");
  const [notes, setNotes] = useState("");
  const [insta, setInsta] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // Validation errors
  const [errors, setErrors] = useState({});

  const sections = [
    { title: "About You", icon: "👤", subtitle: "Tell us about yourself" },
    {
      title: "Your Journey",
      icon: "🌱",
      subtitle: "Share your personal growth experience",
    },
    {
      title: "Focus Areas",
      icon: "🎯",
      subtitle: "What matters most to you right now",
    },
    { title: "Final Touch", icon: "✨", subtitle: "Connect and share more" },
  ];

  // Validation functions
  const validateSection = (sectionIndex) => {
    const newErrors = {};

    switch (sectionIndex) {
      case 0: // About You
        if (!name.trim()) newErrors.name = "Full name is required";
        if (!mobile.trim()) newErrors.mobile = "Mobile number is required";
        if (!dob) newErrors.dob = "Date of birth is required";
        break;

      case 1: // Your Journey
        if (!journey) newErrors.journey = "Please select your current journey";
        if (experience.length === 0)
          newErrors.experience = "Please select at least one experience";
        if (reason.length === 0)
          newErrors.reason = "Please select at least one reason";
        break;

      case 2: // Focus Areas
        if (area.length === 0)
          newErrors.area = "Please select at least one focus area";
        if (!state) newErrors.state = "Please select your present state";
        if (bloom.length === 0)
          newErrors.bloom = "Please select what you hope to bloom into";
        if (!ready) newErrors.ready = "Please indicate your readiness level";
        break;

      case 3: // Final Touch - all optional
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextSection = () => {
    if (validateSection(currentSection)) {
      setCurrentSection((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevSection = () => {
    setCurrentSection((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!loading) {
      setLoading(true);
      if (validateSection(currentSection)) {
        const data = {
          name,
          mobile,
          dob,
          journey,
          experience,
          reason: [...reason, reasonOther].filter(Boolean),
          area,
          state,
          bloom,
          ready,
          notes,
          insta,
          linkedin,
        };
        console.log("Form submitted:", data);
        dispatch(submitDetails(data, token, navigate, selected));
        setLoading(false);
      } else {
        toast.loading("Submitting details");
      }
    }
  };

  // Check if a checkbox is checked
  const isChecked = (name, value) => {
    let arr = null;
    if (name === "experience") arr = experience;
    else if (name === "reason") arr = reason;
    else if (name === "area") arr = area;
    else if (name === "bloom") arr = bloom;
    return arr?.includes(value) || false;
  };

  const CheckboxInput = ({ name, value, label, checked, onChange }) => (
    <div className="flex items-center group hover:bg-orange-50 p-2 rounded-lg transition-colors">
      <input
        type="checkbox"
        id={`${name}-${value}`}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="opacity-0 absolute h-5 w-5"
      />
      <div
        className={`border-2 rounded h-5 w-5 flex flex-shrink-0 justify-center items-center mr-3 transition-all ${
          checked
            ? "bg-[#E16B33] border-[#E16B33]"
            : "bg-white border-orange-200 group-hover:border-[#E16B33]"
        }`}
      >
        {checked && (
          <svg
            className="fill-current w-3 h-3 text-white pointer-events-none"
            viewBox="0 0 20 20"
          >
            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
          </svg>
        )}
      </div>
      <label
        htmlFor={`${name}-${value}`}
        className="text-sm text-gray-700 cursor-pointer"
      >
        {label}
      </label>
    </div>
  );

  const RadioInput = ({ name, value, label, checked, onChange }) => (
    <div className="flex items-center group hover:bg-orange-50 p-2 rounded-lg transition-colors">
      <input
        type="radio"
        id={`${name}-${value}`}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="opacity-0 absolute h-5 w-5"
      />
      <div
        className={`border-2 rounded-full h-5 w-5 flex flex-shrink-0 justify-center items-center mr-3 transition-all ${
          checked
            ? "border-[#E16B33]"
            : "border-orange-200 group-hover:border-[#E16B33]"
        }`}
      >
        {checked && (
          <div className="rounded-full h-2.5 w-2.5 bg-[#E16B33]"></div>
        )}
      </div>
      <label
        htmlFor={`${name}-${value}`}
        className="text-sm text-gray-700 cursor-pointer"
      >
        {label}
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-xl"></div>
      {/* <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-amber-200/30 to-orange-300/30 rounded-full blur-xl"></div> */}

      <div className="flex min-h-screen">
        {/* Left side - Illustration */}
        <div className="w-1/2 lg:fixed hidden lg:flex top-0 left-0 h-screen items-center justify-center bg-gradient-to-br from-[#E16B33] to-[#F9A26B]">
          <div className="text-center text-white p-12">
            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm mx-auto mb-8 flex items-center justify-center text-6xl">
              {sections[currentSection].icon}
            </div>
            <h2 className="text-4xl font-bold mb-4 allSeasonFont">
              {sections[currentSection].title}
            </h2>
            <p className="text-xl opacity-90">
              {sections[currentSection].subtitle}
            </p>
            <div className="mt-12 flex justify-center space-x-2">
              {sections.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSection ? "bg-white" : "bg-white/40"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 lg:ml-auto md:p-6 p-4 lg:p-12">
          <div className="md:max-w-2xl w-full mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#E16B33] to-[#F9A26B] mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                <img
                  src={logo}
                  alt="."
                  className="h-auto w-[80%] object-cover"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 allSeasonFont">
                Personal Growth Journey
              </h1>
              <p className="text-gray-600">
                Step {currentSection + 1} of {sections.length}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className={`text-xs font-medium  ${
                      index <= currentSection
                        ? "text-[#E16B33]"
                        : "text-gray-400"
                    }`}
                  >
                    {section.title}
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#E16B33] to-[#F9A26B] h-2 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${((currentSection + 1) / sections.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-2xl shadow-xl md:p-8 p-4 mb-6">
              <div onSubmit={handleSubmit}>
                {/* Section 0: About You */}
                {currentSection === 0 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2 ">
                        Tell us about yourself
                      </h2>
                      <p className="text-gray-600">
                        Let's start with the basics
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="fullName"
                        className="block mb-2 text-sm font-medium text-[#E16B33]"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#E16B33]/20 ${
                          errors.name
                            ? "border-red-300 bg-red-50"
                            : "border-orange-100 focus:border-[#E16B33]"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="mobile"
                        className="block mb-2 text-sm font-medium text-[#E16B33]"
                      >
                        Mobile Number *
                      </label>
                      <PhoneInput
                        country={"in"}
                        value={mobile}
                        onChange={setMobile}
                        inputStyle={{
                          width: "100%",
                          height: "48px",
                          border: errors.mobile
                            ? "2px solid #fca5a5"
                            : "2px solid #fed7aa",
                          borderRadius: "12px",
                          fontSize: "16px",
                          paddingLeft: "48px",
                        }}
                        containerStyle={{
                          backgroundColor: errors.mobile ? "#fef2f2" : "white",
                          borderRadius: "12px",
                        }}
                        placeholder="Enter phone number"
                      />
                      {errors.mobile && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.mobile}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="dob"
                        className="block mb-2 text-sm font-medium text-[#E16B33]"
                      >
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        id="dob"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#E16B33]/20 ${
                          errors.dob
                            ? "border-red-300 bg-red-50"
                            : "border-orange-100 focus:border-[#E16B33]"
                        }`}
                      />
                      {errors.dob && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.dob}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Section 1: Your Journey */}
                {currentSection === 1 && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Your Journey
                      </h2>
                      <p className="text-gray-600">
                        Share your personal growth experience
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="journey"
                        className="block mb-3 text-sm font-medium text-[#E16B33]"
                      >
                        What best describes your current journey? *
                      </label>
                      <select
                        id="journey"
                        value={journey}
                        onChange={(e) => setJourney(e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#E16B33]/20 ${
                          errors.journey
                            ? "border-red-300 bg-red-50"
                            : "border-orange-100 focus:border-[#E16B33]"
                        }`}
                      >
                        <option value="">Select your journey</option>
                        <option value="entrepreneur">Entrepreneur</option>
                        <option value="creative">Creative</option>
                        <option value="professional">Professional</option>
                        <option value="wellness">Wellness Explorer</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.journey && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.journey}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block mb-3 text-sm font-medium text-[#E16B33]">
                        What has been the most beautiful experience for your
                        personal growth? *
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: "retreat", label: "A Retreat" },
                          { value: "book", label: "A Life-Changing Book" },
                          {
                            value: "mentor",
                            label: "A Transformational Mentor",
                          },
                          { value: "travel", label: "Deep Travel" },
                          { value: "healing", label: "Personal Healing" },
                          { value: "searching", label: "Still Searching" },
                        ].map((item) => (
                          <CheckboxInput
                            key={item.value}
                            name="experience"
                            value={item.value}
                            label={item.label}
                            checked={isChecked("experience", item.value)}
                            onChange={() =>
                              setExperience((prev) =>
                                prev.includes(item.value)
                                  ? prev.filter((i) => i !== item.value)
                                  : [...prev, item.value]
                              )
                            }
                          />
                        ))}
                      </div>
                      {errors.experience && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.experience}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block mb-3 text-sm font-medium text-[#E16B33]">
                        What made you realize it's time to shift something
                        within you? *
                      </label>
                      <div className="space-y-2">
                        {[
                          {
                            value: "restlessness",
                            label: "Inner Restlessness",
                          },
                          { value: "burnout", label: "Burnout Signs" },
                          {
                            value: "health",
                            label: "Desire for a Healthier Life",
                          },
                          {
                            value: "disconnected",
                            label: "Feeling Disconnected",
                          },
                          { value: "meaning", label: "Craving Deeper Meaning" },
                          { value: "intuitive", label: "Intuitive Calling" },
                        ].map((item) => (
                          <CheckboxInput
                            key={item.value}
                            name="reason"
                            value={item.value}
                            label={item.label}
                            checked={isChecked("reason", item.value)}
                            onChange={() =>
                              setReason((prev) =>
                                prev.includes(item.value)
                                  ? prev.filter((i) => i !== item.value)
                                  : [...prev, item.value]
                              )
                            }
                          />
                        ))}
                        <div className="flex items-center group hover:bg-orange-50 p-2 rounded-lg">
                          <CheckboxInput
                            name="reason"
                            value="other"
                            label="Other"
                            checked={isChecked("reason", "other")}
                            onChange={() =>
                              setReason((prev) =>
                                prev.includes("other")
                                  ? prev.filter((i) => i !== "other")
                                  : [...prev, "other"]
                              )
                            }
                          />
                          {isChecked("reason", "other") && (
                            <input
                              type="text"
                              value={reasonOther}
                              onChange={(e) => setReasonOther(e.target.value)}
                              placeholder="Please specify"
                              className="ml-3 px-3 py-2 border-2 border-orange-100 rounded-lg flex-1 focus:border-[#E16B33] outline-none"
                            />
                          )}
                        </div>
                      </div>
                      {errors.reason && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.reason}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Section 2: Focus Areas */}
                {currentSection === 2 && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Your Focus Areas
                      </h2>
                      <p className="text-gray-600">
                        What matters most to you right now
                      </p>
                    </div>

                    <div>
                      <label className="block mb-3 text-sm font-medium text-[#E16B33]">
                        What areas of your life need the most love and
                        attention? *
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: "clarity", label: "Mental Clarity" },
                          { value: "energy", label: "Physical Energy" },
                          { value: "emotional", label: "Emotional Healing" },
                          { value: "peace", label: "Inner Peace" },
                          { value: "purpose", label: "Connection to Purpose" },
                          {
                            value: "community",
                            label: "A Conscious Community",
                          },
                        ].map((item) => (
                          <CheckboxInput
                            key={item.value}
                            name="area"
                            value={item.value}
                            label={item.label}
                            checked={isChecked("area", item.value)}
                            onChange={() =>
                              setArea((prev) =>
                                prev.includes(item.value)
                                  ? prev.filter((i) => i !== item.value)
                                  : [...prev, item.value]
                              )
                            }
                          />
                        ))}
                      </div>
                      {errors.area && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.area}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block mb-3 text-sm font-medium text-[#E16B33]">
                        Which statement best reflects your present state? *
                      </label>
                      <div className="space-y-2">
                        {[
                          {
                            value: "thriving",
                            label: "I'm thriving but seeking deeper meaning",
                          },
                          {
                            value: "turning",
                            label: "I feel I'm at a turning point",
                          },
                          {
                            value: "reset",
                            label: "I'm ready for a full reset and renewal",
                          },
                        ].map((item) => (
                          <RadioInput
                            key={item.value}
                            name="state"
                            value={item.value}
                            label={item.label}
                            checked={state === item.value}
                            onChange={() => setState(item.value)}
                          />
                        ))}
                      </div>
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block mb-3 text-sm font-medium text-[#E16B33]">
                        What are you hoping to bloom into through this journey?
                        *
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: "recharged", label: "A Recharged Self" },
                          { value: "vision", label: "A Clearer Vision" },
                          {
                            value: "health",
                            label: "A Healthier Body and Mind",
                          },
                          { value: "joy", label: "Deeper Inner Joy" },
                          {
                            value: "friendships",
                            label: "Lifelong Conscious Friendships",
                          },
                        ].map((item) => (
                          <CheckboxInput
                            key={item.value}
                            name="bloom"
                            value={item.value}
                            label={item.label}
                            checked={isChecked("bloom", item.value)}
                            onChange={() =>
                              setBloom((prev) =>
                                prev.includes(item.value)
                                  ? prev.filter((i) => i !== item.value)
                                  : [...prev, item.value]
                              )
                            }
                          />
                        ))}
                      </div>
                      {errors.bloom && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.bloom}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block mb-3 text-sm font-medium text-[#E16B33]">
                        How ready are you to invest in yourself during this
                        journey? *
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: "100", label: "100% Ready" },
                          { value: "mostly", label: "Mostly Ready" },
                          { value: "opening", label: "Still Opening to It" },
                        ].map((item) => (
                          <RadioInput
                            key={item.value}
                            name="ready"
                            value={item.value}
                            label={item.label}
                            checked={ready === item.value}
                            onChange={() => setReady(item.value)}
                          />
                        ))}
                      </div>
                      {errors.ready && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.ready}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Section 3: Final Touch */}
                {currentSection === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Final Touch
                      </h2>
                      <p className="text-gray-600">
                        Connect with us and share more (optional)
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="insta"
                        className="block mb-2 text-sm font-medium text-[#E16B33]"
                      >
                        Instagram ID
                      </label>
                      <input
                        type="text"
                        id="insta"
                        value={insta}
                        onChange={(e) => setInsta(e.target.value)}
                        placeholder="@yourusername"
                        className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:outline-none focus:border-[#E16B33] focus:ring-2 focus:ring-[#E16B33]/20 transition-all"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="linkedin"
                        className="block mb-2 text-sm font-medium text-[#E16B33]"
                      >
                        LinkedIn Profile
                      </label>
                      <input
                        type="text"
                        id="linkedin"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        placeholder="linkedin.com/in/yourprofile"
                        className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:outline-none focus:border-[#E16B33] focus:ring-2 focus:ring-[#E16B33]/20 transition-all"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="notes"
                        className="block mb-2 text-sm font-medium text-[#E16B33]"
                      >
                        Anything else you'd like us to know?
                      </label>
                      <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="4"
                        placeholder="Share any additional thoughts, questions, or special requirements..."
                        className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:outline-none focus:border-[#E16B33] focus:ring-2 focus:ring-[#E16B33]/20 transition-all resize-none"
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex md:flex-row flex-col gap-5 justify-between items-center mt-10">
                <button
                  onClick={prevSection}
                  disabled={currentSection === 0}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    currentSection === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-[#E16B33] border-2 border-[#E16B33] hover:bg-[#E16B33] hover:text-white shadow-lg"
                  }`}
                >
                  Previous
                </button>

                {currentSection < 3 ? (
                  <button
                    onClick={nextSection}
                    className="px-8 py-3 bg-gradient-to-r from-[#E16B33] to-[#F9A26B] text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className={`px-8 ${
                      loading ? "py-3 flex items-center" : "py-3"
                    } bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all`}
                  >
                    {loading ? (
                      <ClipLoader size={20} color="#fff" />
                    ) : (
                      "🌟 Begin Your Journey"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}
