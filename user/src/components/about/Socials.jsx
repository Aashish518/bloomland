import React from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  LinkedinIcon,
  Youtube,
} from "lucide-react";

const Socials = () => {
  return (
    <div className="mx-auto w-full my-10 bg-gradient-to-b from-[#FFF1EB] to-white rounded-lg">
      <div className=" rounded-lg px-8 py-20 flex flex-col items-center ">
        <h2 className="text-xl font-medium text-orange-500 mb-2">
          Follow Us on
        </h2>
        <p className="text-gray-800 mb-6 text-sm">For More & Regular Updates</p>

        <div className="flex space-x-8 items-center">
          <a
            href="https://www.facebook.com/share/16XtU3MZTg/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className=""
          >
            <svg
              fill="#E16B33"
              width="800px"
              height="800px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              data-name="Layer 1"
              //   {...props}
              className="h-9 w-9"
            >
              <path d="M20.9,2H3.1A1.1,1.1,0,0,0,2,3.1V20.9A1.1,1.1,0,0,0,3.1,22h9.58V14.25h-2.6v-3h2.6V9a3.64,3.64,0,0,1,3.88-4,20.26,20.26,0,0,1,2.33.12v2.7H17.3c-1.26,0-1.5.6-1.5,1.47v1.93h3l-.39,3H15.8V22h5.1A1.1,1.1,0,0,0,22,20.9V3.1A1.1,1.1,0,0,0,20.9,2Z" />
            </svg>
          </a>

          <a
            href="https://www.instagram.com/bloomlandproject?igsh=MW5oZW8wdGRkMDU4eA%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E16B33] w-full h-full rounded-md  transition-colors"
          >
            <Instagram size={34} />
          </a>

          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className=" text-[#E16B33] rounded-md  transition-colors"
          >
            <LinkedinIcon size={34} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Socials;
