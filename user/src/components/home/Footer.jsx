import React from "react";
import {
  Facebook,
  Instagram,
  Github,
  Youtube,
  LucideLinkedin,
  Linkedin,
} from "lucide-react";
import { useNavigate } from "react-router";
import Newsletter from "../common/Newsletter";
import { format } from "date-fns";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="py-12 border-t border-gray-200 bg-white">
      <div className="flex flex-col   md:max-w-[80%] max-w-full mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center">
          {/* Support Column */}
          <div className="w-full md:w-1/5">
            <h3 className="font-medium text-gray-900 mb-4">Editions</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <div
                  onClick={() => navigate("/editions/day0")}
                  className="text-gray-600 hover:text-[#e16b33] cursor-pointer"
                >
                  BloomX
                </div>
              </li>
              <li>
                <div
                  onClick={() => navigate("/editions/10x")}
                  className="text-gray-600 hover:text-[#e16b33] cursor-pointer"
                >
                  Bloom10x
                </div>
              </li>
              <li>
                <div
                  onClick={() => navigate("/editions/100x")}
                  className="text-gray-600 hover:text-[#e16b33] cursor-pointer"
                >
                  Bloom100x
                </div>
              </li>
              <li>
                <div
                  onClick={() => navigate("/editions")}
                  className="text-gray-600 hover:text-[#e16b33] cursor-pointer"
                >
                  All Editions
                </div>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="w-full md:w-1/5 md:mt-0 mt-10">
            <h3 className="font-medium text-gray-900 mb-4">Company</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <div
                  onClick={() => navigate("/about")}
                  className="text-gray-600 hover:text-[#e16b33] cursor-pointer"
                >
                  About
                </div>
              </li>
              <li>
                <div
                  onClick={() => navigate("/blogs")}
                  className="text-gray-600 hover:text-[#e16b33] cursor-pointer"
                >
                  Blog
                </div>
              </li>
              <li>
                <div
                  onClick={() => navigate("/pricing")}
                  className="text-gray-600 hover:text-[#e16b33] cursor-pointer"
                >
                  Program Fee
                </div>
              </li>
              <li>
                <div
                  onClick={() => navigate("/community")}
                  className="text-gray-600 hover:text-[#e16b33] cursor-pointer"
                >
                  Community
                </div>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          {/* <div>
            <h3 className="font-medium text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#e16b33]">
                  Terms of service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#e16b33]">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#e16b33]">
                  License
                </a>
              </li>
            </ul>
          </div> */}

          {/* Newsletter Column */}
          <div className="w-full md:w-1/5">
            {/* <h3 className="font-medium text-gray-900 mb-4">
              Subscribe to our newsletter
            </h3>
            <p className="text-gray-600 mb-4">
              The latest news, articles, and resources, sent to your inbox
              weekly.
            </p> */}
            {/* <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-[#e16b33] focus:border-[#e16b33]"
                required
              />
              <button
                type="submit"
                className="bg-[#e16b33] text-white px-4 py-2 rounded-md hover:bg-[#F9A26B] transition-colors"
              >
                Subscribe
              </button>
            </form> */}
            <div>
              <Newsletter />
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © {format(new Date(Date.now()), "yyyy")} Antinoob Solutions, All
            rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="https://www.facebook.com/share/16XtU3MZTg/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#e16b33]"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://www.instagram.com/bloomlandproject?igsh=MW5oZW8wdGRkMDU4eA%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#e16b33]"
            >
              <Instagram size={20} />
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#e16b33]"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
