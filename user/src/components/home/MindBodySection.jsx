import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "motion/react";
import HikerImg from "../../assets/hiker.webp";
import day0 from "../../assets/mind.png";
import x100 from "../../assets/body.png";
import x10 from "../../assets/soul.png";
import { ArrowRight, ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setSelected } from "../../store/slices/authSlice";
import EditionsCarousel from "./EditionsCarousel";

const MindBodySection = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { isValid, detailsSubmitted } = useSelector((state) => state.auth);
	const [isMobile, setIsMobile] = useState(false);

	const content = [
		{
			id: "01",
			image: day0,
			category: "BloomX",
			title: "Stillness is the medicine your mind forgot it needed.",
			description: "Where healing meets community, and intention meets action.",
		},
		{
			id: "02",
			category: "Bloom10x",
			image: x10,
			title: "Move. Nourish. Rest. Your body is your first home.",
			description: "Across the world’s most inspiring destinations.",
		},
		{
			id: "03",
			category: "Bloom100x",
			image: x100,
			title: "Awaken what already lives within you",
			description: "A Journey Back to Your Purest, Highest Self.",
		},
	];

	// const handleNavigate = (item) => {
	// 	if (isValid) {
	// 		if (detailsSubmitted) {
	// 			navigate(`/editions/${item.category}`);
	// 		} else {
	// 			dispatch(setSelected(`/editions/${item.category}`));
	// 			navigate("/details");
	// 		}
	// 	} else {
	// 		dispatch(setSelected(`/editions/${item.category}`));
	// 		navigate("/auth/login");
	// 	}
	// };

	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth <= 1024);
		};

		checkIfMobile();
		window.addEventListener("resize", checkIfMobile);
		return () => window.removeEventListener("resize", checkIfMobile);
	}, []);

	return (
		<section className="relative bg-inherit xl:max-w-[80%] max-w-full mx-auto flex">
			<AnimatePresence>
				{isMobile ? (
					<EditionsCarousel content={content}  />
				) : (
					content &&
					content.length > 0 &&
					content.map((item) => (
						<section
							className="relative flex flex-col items-center h-auto flex-1"
							key={item.id}
							// onClick={() => handleNavigate(item)	}
							>
							<div className="px-6 py-10 h-full w-full">
								<div
									className={`group relative flex flex-col cursor-pointer ${
										item.category === "BloomX"
											? "bg-[#C1E1C1]"
											: item.category === "Bloom10x"
											? "bg-[#9BC3D3]"
											: "bg-[#c3bad1]"
									} holographic-card border border-[#3CA18F] h-full overflow-hidden transition-shadow duration-300 hover:shadow-2xl`}>
									{/* Image */}
									<motion.div
										className="rounded-lg overflow-hidden h-[380px]"
										whileInView={{ opacity: [0, 1] }}
										viewport={{ once: false, amount: 0.2 }}>
										<img
											src={item.image}
											alt={item.category}
											className="w-full h-full object-cover object-top"
										/>
									</motion.div>

									{/* Overlay Text */}
<div className="absolute inset-0 bg-black/40 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-in-out flex flex-col justify-center items-center text-white text-center p-6">
  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
  <p className="text-sm">{item.description}</p>
</div>

								</div>
							</div>
						</section>
					))
				)}
			</AnimatePresence>
		</section>
	);
};

export default MindBodySection;
