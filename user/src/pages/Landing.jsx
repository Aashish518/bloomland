import React, { useEffect, useState, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from "motion/react";
import Navbar from "../components/home/Navbar";
import Banner from "../components/home/Banner";
import Footer from "../components/home/Footer";
import BannerImg from "../assets/banner.png";
import HikerImg from "../assets/hiker.webp";
import Editions from "../components/home/Editions";
import OurEditions from "../components/home/OurEditions";
import About from "../components/home/About";
import SectionHeader from "../components/common/SectionHeader";
import Problem from "../components/home/Problem";
import Seen from "../components/home/Seen";
import Benefits from "../components/home/Benefits";
import Fomo from "../components/home/Fomo";
import MindBodySection from "../components/home/MindBodySection";

const Landing = () => {
	const [windowHeight, setWindowHeight] = useState(0);
	const { scrollY } = useScroll();
	const heroRef = useRef(null);

	// Set up responsive values
	useEffect(() => {
		setWindowHeight(window.innerHeight);

		const handleResize = () => {
			setWindowHeight(window.innerHeight);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Transform values based on scroll
	const heroScale = useTransform(scrollY, [0, windowHeight * 0.4], [1, 1.3]);

	return (
		<div className="thin-scrollbar overflow-x-hidden overflow-y-auto relative ">
			{/* Hero Image with Bottom Fade Effect */}
			<div className="absolute top-0 left-0 w-full h-[130vh] overflow-hidden">
				<motion.div
					ref={heroRef}
					className="absolute inset-0 z-0"
					style={{ scale: heroScale }}>
					<img
						src={BannerImg}
						alt="Hero Banner"
						className="w-full h-screen object-cover brightness-85"
					/>

					{/* This overlay creates the fade effect at the bottom of the image */}
				</motion.div>

				{/* Additional light overlay for text readability if needed */}
				{/* <div className="absolute inset-0 z-5 bg-gradient-to-b from-black/30 via-black/30 to-transparent"></div> */}
				{/* <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#EFFFFC] to-transparent" /> */}
			</div>

			{/* Main Content */}
			<div className="relative z-20">
				<Navbar />
				<Banner />
				{/* <div className="h-24 bg-gradient-to-b from-transparent to-[#EFFFFC]"></div> */}

				<div className="tomorrowland-radial pb-5">
					<div className="bg-radient-to-b from-[#EFFFFC] to-white md:pt-0 ">
						<SectionHeader subtitle={"Our Editions"} lineColor="bg-[#3CA18F]" />
						<OurEditions />
					</div>
				</div>

				<div className="tomorrowland-radial pb-5">
					<div className="bg-radient-to-b from-[#EFFFFC] to-white md:pt-0 ">
						<SectionHeader
							subtitle={"upcoming editions"}
							lineColor="bg-[#3CA18F]"
						/>
						<Editions />
            
            <SectionHeader
							subtitle={"Mind body soul "}
							lineColor="bg-[#3CA18F]"
						/>
            <MindBodySection /> 
            
					</div>
					<div className="b-white ">
						<SectionHeader
							// subtitle={"5 Dimensions and Facts"}
							title={"Holistic Health Problems"}
							lineColor="bg-[#3CA18F]"
						/>
						<Problem />
					</div>
				</div>



				{/* <div className="bg-gradient-to-b from-[#FAF0E9] to-white w-full h-[300px] " /> */}

				<div className="reverse-tomorrowland">
					<div className=" flex flex-col md:pb-20 ">
						{/* <div className="  md:h-[150px] h-[50px] bg-gradient-to-b to-[#FFE8DE] from-transparent" /> */}
						{/* <div className="bg-gradient-to-b from-[#FFE8DE] to-white"> */}
						<Seen />
						{/* <div className="  h-[100px] bg-gradient-to-t to-[#FFE8DE] from-transparent" /> */}
					</div>
				</div>

				<div className="tomorrowland-radial">
					<div className=" ">
						<Benefits />
					</div>

					<div className="md:max-w-[80%] max-w-full mx-auto md:py-40">
						<Fomo />
					</div>
				</div>
				{/* Additional sections */}
				<Footer />
			</div>
		</div>
	);
};

export default Landing;
