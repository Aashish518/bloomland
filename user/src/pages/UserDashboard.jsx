import { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  PenSquare,
  LogOut,
  ChevronDown,
  ChevronUp,
  Edit,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import { useDispatch, useSelector } from "react-redux";
import { editUser } from "../services/operations/auth";
import { useNavigate } from "react-router";
import { PayEvent } from "../services/operations/payment";
import { ReactComponent as RazorpayIcon } from "../assets/razorpay.svg";
import { withdrawRequest } from "../services/operations/event";
import PhoneInput from "react-phone-input-2";
import { ClipLoader } from "react-spinners";

export default function UserDashboard() {
  const user = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [expandedSection, setExpandedSection] = useState("approved");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState();
  const [loading, setLoading] = useState({
    element: null,
    value: false,
  });
  const { token, isValid, detailsSubmitted } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchFormData = () => {
      if (!user) return;
      setFormData({
        name: user.name,
        phone: user.phone,
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        insta: user.insta,
        linkedin: user.linkedin,
      });
    };
    fetchFormData();
  }, [user]);

  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
      return;
    }
    if (!isValid) {
      navigate("/auth/login");
      return;
    }

    if (!detailsSubmitted) {
      navigate("/details");
      return;
    }
  }, [token, isValid, detailsSubmitted]);

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleWithdrawRequest = (eventId) => {
    const req = user.requests.find(
      (i) => i.eventId._id === eventId && i.status === "pending"
    );

    dispatch(
      withdrawRequest({
        token: token,
        req: req,
        setLoading: setLoading,
      })
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUserData = new FormData();

    newUserData.append("name", formData.name);
    newUserData.append("dob", formData.dob);
    newUserData.append("phone", formData.phone);
    newUserData.append("insta", formData.insta);
    newUserData.append("linkedin", formData.linkedin);
    dispatch(
      editUser({ data: newUserData, token: token, setLoading: setLoading })
    );
    setEditMode(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePayment = async (eventId) => {
    const details = {
      name: user.name,
      email: user.email,
    };
    await PayEvent({
      token,
      eventId: eventId,
      user_details: details,
      dispatch: dispatch,
      setLoading: setLoading,
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:mt-[53px] mt-[47px]">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "dashboard"
                    ? "border-[#E16B33]] text-[#E16B33]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-[#E16B33]] text-[#E16B33]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Profile
              </button>
            </nav>
          </div>

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Requests Section */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div
                  className="px-4 py-5 border-b border-gray-200 sm:px-6 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleSection("requests")}
                >
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <Clock className="mr-2" size={20} />
                    Requested Events
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      {
                        user.requests.filter((i) => i.status === "pending")
                          .length
                      }
                    </span>
                  </h3>
                  {expandedSection === "requests" ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
                {expandedSection === "requests" && (
                  <div className="px-4 py-5 sm:p-6">
                    {user &&
                    user.requests &&
                    user.requests.filter((i) => i.status === "pending").length >
                      0 ? (
                      <ul className="divide-y divide-gray-200">
                        {user.requests
                          .filter((i) => i.status === "pending")
                          .map((event) => (
                            <li key={event.eventId._id} className="py-4">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/event/${event.eventId._id} `);
                                }}
                                className="flex gap-8 items-center md:flex-row flex-col md:justify-between bg-gray-100 rounded-xl  cursor-pointer hover:bg-gray-100 transition-all  duration-300 p-6"
                              >
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">
                                    {event.eventId.title}
                                  </h4>
                                  <div className="mt-1 flex items-center text-sm text-gray-500">
                                    <Calendar size={16} className="mr-1" />
                                    <p>
                                      {formatDate(event.eventId.start_date)}
                                    </p>
                                    <span className="mx-2">•</span>
                                    <p>
                                      {event.eventId.location.city},{" "}
                                      {event.eventId.location.state},{" "}
                                      {event.eventId.location.country}
                                    </p>
                                  </div>
                                </div>

                                {loading.element === "withdraw" ? (
                                  <div className="ml-4 px-10 py-3 text-xs font-medium rounded-sm text-red-700 bg-red-100 hover:bg-red-200">
                                    <ClipLoader size={20} />
                                  </div>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleWithdrawRequest(event.eventId._id);
                                    }}
                                    className="ml-4 px-3 py-3 text-xs font-medium rounded-sm text-red-700 bg-red-100 hover:bg-red-200"
                                  >
                                    Withdraw Request
                                  </button>
                                )}
                              </div>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">
                        No pending requests
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Approved Section */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div
                  className="px-4 py-5 border-b border-gray-200 sm:px-6 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleSection("approved")}
                >
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <CheckCircle className="mr-2" size={20} />
                    Approved Events
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {
                        user.approved.filter((i) => i.status === "pending")
                          .length
                      }
                    </span>
                  </h3>
                  {expandedSection === "approved" ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
                {expandedSection === "approved" && (
                  <div className="px-4 py-5 sm:p-6">
                    {user &&
                    user.approved &&
                    user.approved.filter((i) => i.status === "pending").length >
                      0 ? (
                      <ul className="divide-y divide-gray-200">
                        {user.approved
                          .filter((i) => i.status === "pending")
                          .map((event,index) => (
                            <li key={index} className="py-4 ">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/event/${event.eventId._id} `);
                                }}
                                className="flex items-center justify-between bg-gray-100 rounded-xl hover:scale-101 hover:bg-gray-100 transition-all  duration-300 p-6"
                              >
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">
                                    {event.eventId?.title}
                                  </h4>
                                  <div className="mt-1 flex items-center text-sm text-gray-500">
                                    <Calendar size={16} className="mr-1" />
                                    <p>
                                      {formatDate(event.eventId?.start_date)}
                                    </p>
                                    <span className="mx-2">•</span>
                                    <p>
                                      {event.eventId?.location.city},{" "}
                                      {event.eventId?.location.state},{" "}
                                      {event.eventId?.location.country}
                                    </p>
                                  </div>
                                </div>

                                {loading.element === "payment" ? (
                                  <div className="flex flex-col md:py-2 px-10 bg-gray-300 rounded-md hover:scale-101 cursor-pointer hover:bg-gray-400 transition-all  duration-300">
                                    {/* Razorpay Logo SVG */}
                                    {/* <p>Pay Now</p>
                                    <RazorpayIcon className="w-full h-7 text-white" /> */}

                                    <ClipLoader size={20} />
                                  </div>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePayment(event.eventId._id);
                                    }}
                                    className="flex flex-col md:py-2 px-4 bg-gray-300 rounded-md hover:scale-101 cursor-pointer hover:bg-gray-400 transition-all  duration-300"
                                  >
                                    {/* Razorpay Logo SVG */}
                                    <p>Pay {event.eventId?.price} Now</p>
                                    <RazorpayIcon className="w-full h-7 text-white" />

                                    {/* <ClipLoader size={20} /> */}
                                  </button>
                                )}
                              </div>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No approved events</p>
                    )}
                  </div>
                )}
              </div>

              {/* Joined Section */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div
                  className="px-4 py-5 border-b border-gray-200 sm:px-6 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleSection("joined")}
                >
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <User className="mr-2" size={20} />
                    Joined Events
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {
                        user?.events?.filter((i) => i.status === "pending")
                          .length
                      }
                    </span>
                  </h3>
                  {expandedSection === "joined" ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
                {expandedSection === "joined" && (
                  <div className="px-4 py-5 sm:p-6">
                    {user?.events?.filter((i) => i.status === "pending")
                      .length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {user.events
                          .filter((i) => i.status === "pending")
                          .map((event) => (
                            <li key={event.eventId._id} className="py-4">
                              <div
                                onClick={() =>
                                  navigate(`/event/${event.eventId._id} `)
                                }
                                className="flex items-center justify-between p-6 bg-gray-100 rounded-xl hover:scale-101 cursor-pointer hover:bg-gray-100 transition-all  duration-300"
                              >
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">
                                    {event.eventId.title}
                                  </h4>
                                  <div className="mt-1 flex items-center text-sm text-gray-500">
                                    <Calendar size={16} className="mr-1" />
                                    <p>
                                      {formatDate(event.eventId.start_date)}
                                    </p>
                                    <span className="mx-2">•</span>
                                    <p>
                                      {event.eventId.location.city},{" "}
                                      {event.eventId.location.state},{" "}
                                      {event.eventId.location.country}
                                    </p>
                                  </div>
                                </div>
                                <span className="ml-4 px-3 py-1 text-xs font-medium rounded-md text-green-700 bg-green-100">
                                  Joined 
                                </span>
                              </div>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No joined events</p>
                    )}
                  </div>
                )}
              </div>

              {/* PAST EVENTS */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div
                  className="px-4 py-5 border-b border-gray-200 sm:px-6 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleSection("past")}
                >
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <Clock className="mr-2" size={20} />
                    Past Events
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      {user.events.filter((i) => i.status === "entered").length}
                    </span>
                  </h3>
                  {expandedSection === "past" ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
                {expandedSection === "past" && (
                  <div className="px-4 py-5 sm:p-6">
                    {user &&
                    user.events &&
                    user.events.filter((i) => i.status === "entered").length >
                      0 ? (
                      <ul className="divide-y divide-gray-200">
                        {user.events
                          .filter((i) => i.status === "entered")
                          .map((event) => (
                            <li key={event.eventId._id} className="py-4">
                              <div className="flex items-center justify-between bg-gray-100 rounded-xl hover:scale-101 cursor-pointer hover:bg-gray-100 transition-all  duration-300 p-6">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">
                                    {event.eventId.title}
                                  </h4>
                                  <div className="mt-1 flex items-center text-sm text-gray-500">
                                    <Calendar size={16} className="mr-1" />
                                    <p>
                                      {formatDate(event.eventId.start_date)}
                                    </p>
                                    <span className="mx-2">•</span>
                                    <p>
                                      {event.eventId.location.city},{" "}
                                      {event.eventId.location.state},{" "}
                                      {event.eventId.location.country}
                                    </p>
                                  </div>
                                </div>
                                {/* <button
                                  onClick={() =>
                                    handleWithdrawRequest(event.eventId._id)
                                  }
                                  className="ml-4 px-3 py-3 text-xs font-medium rounded-sm text-red-700 bg-red-100 hover:bg-red-200"
                                >
                                  Withdraw Request
                                </button> */}
                              </div>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">
                        No pending requests
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Quota Display */}
              {/* <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Event Quota
                </h3>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{
                        width: `${(user.joined.length / user.allowed) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-4 text-sm font-medium text-gray-700">
                    {user.joined.length} / {user.allowed} events
                  </span>
                </div>
              </div>
            </div> */}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-[#E16B33] flex items-center">
                  <User className="mr-2" size={20} />
                  My Profile
                </h3>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit Profile
                  </button>
                )}
              </div>
              <div className="px-4 py-5 sm:p-6">
                {loading.element === "edit" ? (
                  <>
                    <div className="min-h-[50vh] flex items-center justify-center">
                      <ClipLoader size={40} />
                    </div>
                  </>
                ) : editMode ? (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={user.email}
                          disabled
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 sm:text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Email cannot be changed
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone
                        </label>
                        {/* <input
                          type="text"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        /> */}
                        <PhoneInput
                          country={"in"} // Default country Thailand (matches the flag in your image)
                          value={formData.phone}
                          onChange={(value) => {
                            setFormData((prev) => ({
                              ...prev,
                              phone: value, // update the phone field with the new value
                            }));
                          }}
                          inputStyle={{
                            width: "100%",
                            height: "calc(2.5rem + 2px)",
                            outline: "none",
                            // border: "1px solid #f9a26b",
                          }}
                          dropdownStyle={{ maxHeight: 200, overflowY: "auto" }}
                          enableAreaCodes={true}
                          disableCountryCode={false}
                          countryCodeEditable={false}
                          placeholder="Enter phone number"
                          className="border border-orange-100 rounded-lg"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="dob"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dob"
                          id="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Instagram ID
                        </label>
                        <input
                          type="text"
                          name="insta"
                          id="insta"
                          value={formData.insta}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="linkedin"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Linkedin Profile
                        </label>
                        <input
                          type="text"
                          name="linkedin"
                          id="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      {/* <div>
                      <label
                        htmlFor="journey"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Journey
                      </label>
                      <input
                        type="text"
                        name="journey"
                        id="journey"
                        value={formData.journey}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Separate multiple values with commas
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="experience"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Experience
                      </label>
                      <input
                        type="text"
                        name="experience"
                        id="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Separate multiple values with commas
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="reason"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Reason
                      </label>
                      <input
                        type="text"
                        name="reason"
                        id="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Separate multiple values with commas
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="area"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Area
                      </label>
                      <input
                        type="text"
                        name="area"
                        id="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Separate multiple values with commas
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="bloom"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Bloom
                      </label>
                      <input
                        type="text"
                        name="bloom"
                        id="bloom"
                        value={formData.bloom}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Separate multiple values with commas
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="ready"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Ready
                      </label>
                      <input
                        type="text"
                        name="ready"
                        id="ready"
                        value={formData.ready}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        id="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        id="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="isCommunity"
                          id="isCommunity"
                          checked={formData.isCommunity}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="isCommunity"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Join Community
                        </label>
                      </div>
                    </div> */}
                    </div>

                    <div className="mt-6 flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#E16B33] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Date of Birth
                      </p>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(user.dob)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        What best describes your current journey?
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {user &&
                          user.journey &&
                          user.journey.map((item, index) => (
                            <span
                              key={`journey-${index}`}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {item}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        What has been the most beautiful experience you've had
                        for your personal growth so far?
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {user &&
                          user.experience &&
                          user.experience.map((item, index) => (
                            <span
                              key={`exp-${index}`}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              {item}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        What made you realize it's time to adapt or shift
                        something within you?
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {user &&
                          user.reason &&
                          user.reason
                            .filter((r) => r !== "")
                            .map((item, index) => (
                              <span
                                key={`reason-${index}`}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                              >
                                {item}
                              </span>
                            ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        What areas of your life are calling for the most love
                        and attention right now?
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {user &&
                          user.area &&
                          user.area.map((item, index) => (
                            <span
                              key={`area-${index}`}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                            >
                              {item}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        What are you most hoping to bloom into through this
                        journey?
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {user &&
                          user.bloom &&
                          user.bloom.map((item, index) => (
                            <span
                              key={`bloom-${index}`}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
                            >
                              {item}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        How ready are you to invest time, energy, and intention
                        into yourself during this edition?
                      </p>
                      <p className="mt-1 text-sm text-gray-900">{user.ready}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Which statement best reflects your present state?
                      </p>
                      <p className="mt-1 text-sm text-gray-900">{user.state}</p>
                    </div>

                    {/* <div className="sm:col-span-2"> */}
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Instagram ID
                      </p>
                      <p className="mt-1 text-sm text-gray-900">{user.insta}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Linkedin Profile
                      </p>
                      <p className="mt-1 text-sm text-gray-900">
                        {user.linkedin}
                      </p>
                    </div>
                    {/* </div> */}

                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-gray-500">Notes</p>
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                        {user.notes || "No notes available"}
                      </p>
                    </div>

                    <div className="">
                      <p className="text-sm font-medium text-gray-500">
                        Community Member
                      </p>
                      <p className="mt-1 text-sm text-gray-900">
                        {user.isCommunity ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
