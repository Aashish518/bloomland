import { addAttendee } from "@/services/admin";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { ClipLoader } from "react-spinners";

export default function ModalFormComponent({ setEvent }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    eventId: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      eventId: id,
    }));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addAttendee({
      token: token,
      data: formData,
      setLoading: setLoading,
      setEvent: setEvent,
    });
    // Reset form and close modal
    setFormData({ name: "", email: "", phone: "", password: "" });
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      {/* Trigger Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-black hover:bg-black/70 cursor-pointer text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
      >
        Add Attendee
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Add Attendee
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Phone Number Field */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* Form Actions */}

              {loading ? (
                <div className="flex w-full justify-center">
                  <ClipLoader className="" />
                </div>
              ) : (
                <div className="flex gap-3 mt-6 w-full justify-center">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 cursor-pointer text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
