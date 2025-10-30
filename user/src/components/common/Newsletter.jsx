import React, { useState } from "react";
import { newslettter } from "../../services/operations/ticket";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleNewsletter = async (e) => {
    e.preventDefault();
    await newslettter(email);
    setEmail("");
  };

  return (
    <>
      <h3 className="text-lg md:font-medium font-medium mb-3 text-[#E16B33] w-full">
        Subscribe to our Newsletter
      </h3>
      <p className="text-gray-600 mb-4 text-sm md:font-normal font-light">
        Get the latest React tips and tutorials delivered to your inbox
      </p>
      <form
        onSubmit={handleNewsletter}
        className="flex md:flex-row flex-col gap-3"
      >
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email"
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E16B33] text-sm"
        />
        <button
          type="submit"
          className="bg-[#E16B33] text-sm text-white px-4 py-2 rounded-md hover:bg-[#e16b33]/80 transition-colors cursor-pointer"
        >
          Subscribe
        </button>
      </form>
    </>
  );
};

export default Newsletter;
