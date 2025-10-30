import React from "react";
import { useNavigate } from "react-router";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl text-center">ERROR 404! PAGE NOT FOUND</h1>
      <button
        onClick={() => navigate("/")}
        className="bg-[#E16B33] px-4 py-3 rounded-lg my-5 hover:scale-110 transition duration-200 text-white"
      >
        Return to homepage
      </button>
    </div>
  );
};

export default ErrorPage;
