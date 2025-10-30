import { useState } from "react";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import { X } from "lucide-react";
import { createTicket } from "../services/operations/ticket";
import Socials from "../components/about/Socials";

export default function ContactUs() {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    message: "",
    subject: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    setImages((prev) => [...prev, ...imageFiles]);
  };

  const handleImageRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("email", formData.email);
    data.append("category", formData.subject);
    data.append("description", formData.message);

    if (images && images.length > 0) {
      // If there's only one image
      if (images.length === 1) {
        data.append("images", images[0]);
      }
      // If there are multiple images
      else {
        images.forEach((image) => {
          data.append("images", image);
        });
      }
    }

    await createTicket({ data });
    setFormData({
      email: "",
      subject: "",
      message: "",
    });
    setImages([]);
  };

  return (
    <>
      <Navbar />
      <div className="w-full md:max-w-[80%] max-w-full mx-auto min-h-screen flex items-center justify-center bg-white p-4 lg:mt-[53px] mt-[47px]">
        <div className="w-full flex flex-col md:flex-row z-10">
          {/* Left section - Company info */}
          <div className="w-full md:w-1/2 md:p-8 py-8 flex flex-col justify-center">
            <div className="max-w-md">
              <h1 className="text-3xl font-semibold text-[#E16B33] mb-4">
                Let's get in touch with us
              </h1>
              <p className=" text-gray-600 mb-8">
                Email, call or complete the form to connect with us
                <br />
                We'll get back to you within 24 hours.
              </p>

              <div className="mb-6">
                <h2 className="text-sm text-gray-500 font-medium">Phone</h2>
                <p className="text-[#E16B33] text-sm">+(91) 9099661460</p>
              </div>

              <div className="mb-6">
                <h2 className="text-sm text-gray-500 font-medium">Email</h2>
                <p className="text-[#E16B33] text-sm">bloomland@gmail.com</p>
              </div>

              <div>
                <h2 className="text-sm text-gray-500 font-medium">Office</h2>
                <p className="text-[#E16B33] text-sm">
                  230 Norman Street New York,
                </p>
                <p className="text-[#E16B33] text-sm">QC (USA) H8R 1A1</p>
              </div>
            </div>
          </div>

          {/* Right section - Contact form */}
          <div className="w-full max-w-xl bg-white rounded-lg md:shadow-lg md:p-8  py-8">
            <div className="bg-white md:p-8 rounded-lg">
              <h2 className="text-xl font-bold text-[#E16B33] mb-2">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                We'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-[#F9A26B] mb-2 text-sm"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="yourname@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E16B33]"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-[#F9A26B] mb-2 text-sm"
                  >
                    Subject
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {["inquiry", "auth", "event"].map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="subject"
                          value={option}
                          checked={formData.subject === option}
                          onChange={handleChange}
                          className="mr-2 appearance-none w-4 h-4 rounded-full border border-gray-300 checked:bg-[#E16B33] checked:border-transparent focus:outline-none relative"
                        />
                        <span className="text-sm capitalize">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="message"
                    className="block text-[#F9A26B] mb-2 text-sm"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    placeholder="Type your message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-sm  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E16B33]"
                  ></textarea>
                </div>

                <label className="block text-[#F9A26B] mb-3 text-sm">
                  Screenshot
                </label>
                <div
                  onDrop={(e) => {
                    e.preventDefault();
                    handleImageUpload(e);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className="w-full border-b border-gray-300 py-6 px-4 text-gray-600 text-xs text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <label>
                    Drag & drop images here or{" "}
                    <span className="text-black underline">
                      click to select
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {images.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          className="w-20 h-20 rounded border border-gray-200 relative  overflow-visible"
                        >
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`upload-${idx}`}
                            className="w-full h-full object-cover"
                          />
                          <div
                            onClick={() => handleImageRemove(idx)}
                            className="rounded-full bg-black absolute -top-1 -right-1"
                          >
                            <X size={15} className="text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#E16B33] text-white text-sm py-3 px-4 rounded-md hover:bg-[#F9A26B] transition duration-300 mt-8"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="md:max-w-[80%] max-w-full px-4 md:px-0 mx-auto">
        <Socials />
      </div>
      <Footer />
    </>
  );
}
