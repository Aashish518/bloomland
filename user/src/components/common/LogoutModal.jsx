import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../../store/slices/authSlice";
import { toast } from "react-toastify";

export default function LogoutModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleLogout = () => {
    onClose();
    dispatch(logout());
    toast.success("Logged Out!");
    navigate("/");
  };
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose} // close when clicking outside modal
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-60 pointer-events-none">
        <div
          className="bg-white rounded-lg shadow-lg p-6 w-80 pointer-events-auto"
          onClick={(e) => e.stopPropagation()} // prevent closing on modal click
        >
          <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
          <p className="mb-6 text-gray-700">Are you sure you want to logout?</p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
