import { format } from "date-fns";
import { Calendar, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Card({ event, type }) {
	const [duration, setDuration] = useState("");
	const navigate = useNavigate();
	const getDuration = (startDate, endDate) => {
		const start = new Date(startDate);
		const end = new Date(endDate);

		if (isNaN(start) || isNaN(end)) {
			console.warn("Invalid date format. Ensure the dates are in ISO format.");
			return "Invalid dates";
		}

		const diffInMs = end - start;
		const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
		const nights = days - 1;

		return `${nights} nights, ${days} days`;
	};

	useEffect(() => {
		if (event?.start_date !== null && event?.end_data !== null) {
			const calculatedDuration = getDuration(event.start_date, event.end_data);
			setDuration(calculatedDuration);
		}
	}, [duration, event]);

	return (
		<div
			className={`relative w-fit max-h- max-w-sm border border-[#A7D4CC] flex flex-col rounded-3xl ${
				event.categor === "day0"
					? "bg-[#C1E1C1]"
					: event.category === "10x"
					? "bg-[#9BC3D3]"
					: "bg-[#c3bad1]"
			} `}>
			<div className="px-6 py-4">
				{/* Background image */}
				<div className="relative ">
					<img
						src={event.poster}
						alt="Conference audience"
						className="object-cover w-full aspect-square rounded-3xl brightness-85"
					/>
					<div className="absolute w-full h-1/4 bg-gradient-to-t  from-black/30 to-transparent bottom-0 rounded-3xl"></div>
				</div>
				<div className="pl-2">
					<h1 className="my-5 font-semibold text-[#E16B33] text-xl">
						{event.title}
					</h1>
					<div className="flex flex-wrap w-fit gap-3 md:mb-2 mb-1">
						<Calendar size={18} className="text-[#E16B33]" />
						<p className="font-medium">
							{event.start_date && !isNaN(new Date(event.start_date))
								? format(new Date(event.start_date), "d MMMM, yyyy")
								: "Invalid date"}
						</p>
						<p>|</p>
						<p className="font-medium">{event.duration}</p>
					</div>
					{type === "day0" && (
						<div className="flex gap-3 my-2">
							<MapPin size={21} className="text-[#E16B33]" />
							<p className="font-medium">
								{event.address?.venue}, {event.address?.landmark},{" "}
								{event.address?.area}
							</p>
						</div>
					)}
					<div className="flex gap-3">
						<MapPin size={18} className="text-[#E16B33]" />

						<p className="font-medium">
							{event.location.city}, {event.location.state},{" "}
							{event.location.country}
						</p>
					</div>
				</div>

				<button
					onClick={() => navigate(`/event/${event._id}`)}
					className="pl-2 md:mt-10 mt-5 text-[#E16B33] font-medium text-lg p-2">
					View Details <span className="arrow-animation">→</span>
				</button>
			</div>
		</div>
	);
}
