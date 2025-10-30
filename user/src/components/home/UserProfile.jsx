import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export default function UserProfile({ setConfirmModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const { name, journey } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Handler to detect clicks outside of dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the listener on unmount or when isOpen changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className="flex items-center justify-center bg-inherit"
      ref={dropdownRef}
    >
      <div className="relative">
        {/* Profile Avatar Button */}
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-center cursor-pointer"
        >
          <div className="md:h-[36px] w-auto rounded-full overflow-hidden border-2 border-white">
            <img
              src={`https://api.dicebear.com/9.x/initials/svg?seed=${
                name ? name : "Sample"
              }`}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-10 right-0 w-64 bg-white rounded-lg shadow-lg py-4 z-10">
            {/* User Info */}
            <div className="px-4 pb-3 border-b border-gray-200">
              <p className="text-lg font-medium text-gray-800">
                {name ? name : "John Doe"}
              </p>
              <p className="text-sm text-gray-400">
                {journey ? journey : "Profession"}
              </p>
            </div>

            {/* Menu Items */}
            <div className="mt-2 px-4">
              <div
                onClick={() => {
                  setIsOpen(false);
                  navigate("/dashboard");
                }}
                className="flex items-center px-4 py-3 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <svg
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="7" r="4" />
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                </svg>
                <span className="ml-3 text-sm text-gray-700">My profile</span>
              </div>

              <div
                onClick={() => {
                  setIsOpen(false);
                  navigate("/contact");
                }}
                className="flex items-center px-4 py-3 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <svg
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span className="ml-3 text-sm text-gray-700">Help</span>
              </div>

              <div
                onClick={() => {
                  setIsOpen(false);
                  setConfirmModal(true);
                }}
                className="flex items-center px-4 py-3 bg-[#ff7b7b] hover:bg-[#ff0000] rounded-lg cursor-pointer"
              >
                <svg
                  className="h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span className="ml-3 text-sm text-white">Logout</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
