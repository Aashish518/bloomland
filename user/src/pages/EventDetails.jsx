import React, { useEffect } from "react";
import {
	Calendar,
	Clock,
	MapPin,
	ArrowLeft,
	ExternalLink,
	ChevronLeft,
	ChevronRight,
	CircleCheck,
	Hourglass,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
	joinEvent,
	sendRequest,
	fetchEventById,
} from "../services/operations/event";
import { setSelected } from "../store/slices/authSlice";
import { PayEvent, addUserAllTickets } from "../services/operations/payment";
import { toast } from "react-toastify";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import hourglass from "../assets/hourglass.png";
import EventCarousel from "../components/event/EventCarousel";
import SectionHeader from "../components/common/SectionHeader";
import Faq from "../components/about/Faq";
import Socials from "../components/about/Socials";
import Sun from "../assets/sun.png";
import calendar from "../assets/calendar.png";
import map from "../assets/map.png";
import pin from "../assets/pin.png";
import { format } from "date-fns";
import PriceButton from "../components/EventDetails/PriceButton";
import ImageGallery from "../components/EventDetails/ImageGallery";
import SponsorsSection from "../components/EventDetails/SponsorsSection";
// import { ReactComponent as RazorpayIcon } from "../../assets/razorpay.svg";
import { ReactComponent as RazorpayIcon } from "../assets/razorpay.svg";

export default function EventDetails() {
	const { isValid, detailsSubmitted, token } = useSelector(
		(state) => state.auth
	);

	const user = useSelector((state) => state.user);
	const { level } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id } = useParams();
	const { events } = useSelector((state) => state.event);
	const location = useLocation();
	const [event, setEvent] = useState(null);
	console.log(event);
	const [activeTab, setActiveTab] = useState("description");
	const [name, setName] = useState(user?.name || "");
	const [email, setEmail] = useState(user?.email || "");
	const [showPopup, setShowPopup] = useState(false);
	// const [offsetY, setOffsetY] = useState(0);

	// const handleScroll = () => {
	//   setOffsetY(window.scrollY);
	// };

	// useEffect(() => {
	//   window.addEventListener("scroll", handleScroll);
	//   return () => window.removeEventListener("scroll", handleScroll);
	// }, []);

	useEffect(() => {
		const fetchSingleEvent = async () => {
			const eventData = await dispatch(fetchEventById({ eventId: id, token }));
			if (eventData) setEvent(eventData);
		};
		fetchSingleEvent();
	}, [dispatch, id, token]);

	const isAllowed = (level) => {
		let i;

		if (event?.category === "day0") {
			i = 1;
		} else if (event?.category === "10x") {
			i = 2;
		} else if (event?.category === "100x") {
			i = 3;
		}

		if (level >= i) {
			return true;
		}
		return false;
	};

	const isJoined = () => {
		console.log("user", user);
		let ids = Array.isArray(user?.events)
			? user.events
					.filter((e) => e && e.eventId && e.eventId._id)
					.map((e) => e.eventId._id)
			: [];

		if (ids.length > 0 && ids.includes(id)) {
			return true;
		}

		ids = Array.isArray(user?.approved)
			? user.approved
					.filter((e) => e && e.eventId && e.eventId._id)
					.map((e) => e.eventId._id)
			: [];

		if (ids.length > 0 && ids.includes(id)) {
			return true;
		}

		ids = Array.isArray(user?.requests)
			? user.requests.filter((e) => e && e._id).map((e) => e._id)
			: [];

		if (ids.length > 0 && ids.includes(id)) {
			const foundRequest = user?.requests?.find(
				(i) => i && i.eventId && i.eventId._id === id
			);
			if (foundRequest && foundRequest.status === "pending") {
				return true;
			}
		}
		return false;
	};

	// To check if the event is approved for the current user, you should look at the user's approved array.
	// Each item in user.approved contains an eventId and status.
	// You can check if the eventId matches the current event and status is "paid" or "accepted".

	// Example usage:
	const isEventApproved = () => {
		if (!user?.approved) return false;
		return user.approved.some(
			(a) =>
				a.eventId &&
				(a.eventId._id === id || a.eventId === id) &&
				(a.status === "pending" || a.status === "paid")
		);
	};

	const handleNavigate = async () => {
		// Get eventStatus from userSlice
		const eventStatusArr = user.eventStatus || [];
		const eventStatusObj = eventStatusArr.find((e) => e.eventId === id);

		// If event is public, show 'Request Invite' by default
		if (event?.visibility === "public") {
			setShowPopup(true);
			return;
		}

		// If status exists for this event, show it
		if (eventStatusObj) {
			toast.info(`Event status: ${eventStatusObj.status}`);
			return;
		}

		if (isJoined()) {
			toast(
				<>
					Action already performed!
					<br />
					Check Dashboard
				</>
			);
			return;
		}
		if (isAllowed(level)) {
			dispatch(joinEvent({ token: token, eventId: id, navigate: navigate }));
		} else {
			if (isValid) {
				if (detailsSubmitted) {
					// Send request and update eventStatus in userSlice
					const result = await dispatch(
						sendRequest({ token: token, eventId: id })
					);
					if (result && result.eventId && result.status) {
						dispatch({
							type: "user/setEventStatus",
							payload: { eventId: result.eventId, status: result.status },
						});
						toast.info(`Event status: ${result.status}`);
					}
				} else {
					dispatch(setSelected(location.pathname));
					navigate("/details");
				}
			} else {
				dispatch(setSelected(location.pathname));
				navigate("/auth/login");
			}
		}
	};

	// one
	const handlePayment = async () => {
		const details = {
			name: name,
			email: email,
		};

		await PayEvent({
			token,
			eventId: id,
			user_details: details,
			dispatch: dispatch,
		});
	};

	const TabButton = ({ label, tabKey, isActive, onClick }) => (
		<button
			key={tabKey}
			onClick={onClick}
			className={`flex-1 px-6 py-4 text-lg font-semibold transition-all duration-300 bg-white relative ${
				isActive
					? "text-[#E16B33] bg-white"
					: "text-slate-600 hover:text-slate-800 hover:bg-slate-100 "
			}`}>
			{label}
			{isActive && (
				<div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E16B33]"></div>
			)}
		</button>
	);

	const ItineraryTab = () => {
		return (
			<div>
				<h3 className="text-2xl font-bold text-gray-800 mb-6">
					Detailed Itinerary
				</h3>
				<div className="space-y-8">
					{event.itinerary &&
						event.itinerary.length > 0 &&
						event.itinerary.map((day) => (
							<div key={day.id} className="border-l-4 border-red-500 pl-6">
								<h4 className="text-xl font-bold text-slate-800 mb-3">
									{format(new Date(day.date), "d MMM, yyyy")}:{"  "}
									<span className="text-red-600">{day.title}</span>
								</h4>
								<div className="space-y-3">
									{day.activities.map((item) => (
										<div key={item.id} className="flex items-start space-x-4">
											<span className="font-semibold text-gray-900 min-w-20">
												{item.time}:
											</span>
											<span className="text-gray-700">{item.description}</span>
										</div>
									))}
								</div>
							</div>
						))}
				</div>
			</div>
		);
	};

	const DescriptionTab = () => (
		<div>
			<h3 className="text-2xl font-bold text-gray-800 mb-6">
				Event Description
			</h3>
			<p
				className="text-lg leading-relaxed text-gray-700 mb-6"
				dangerouslySetInnerHTML={{
					__html: event.description?.replace(
						/background-color:\s*[^;]+;?/gi,
						""
					),
				}}></p>

			{/* <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border-l-4 border-cyan-500 mb-6">
        <p className="text-gray-700">
          <strong className="text-gray-900">
            What makes this event unique:
          </strong>{" "}
          Our expert local guides will take you beyond the typical tourist spots
          to discover hidden gems, interact with local artisans, and experience
          the authentic spirit of Ahmedabad.
        </p>
      </div> */}
		</div>
	);

	const IncludedTab = () => {
		return (
			<div>
				<h3 className="text-2xl font-bold text-gray-800 mb-6">
					What's Included
				</h3>
				<div className="space-y-4">
					{event.included &&
						event.included.length > 0 &&
						event.included.map((item) => (
							<div
								key={item.id}
								className="flex items-start space-x-4 py-3 border-b border-gray-200 last:border-b-0">
								<div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
									<span className="text-white text-sm font-bold">✓</span>
								</div>
								<div>
									<span className="font-semibold text-gray-900">
										{item.heading}:
									</span>
									<span className="text-gray-700 ml-2">{item.value}</span>
								</div>
							</div>
						))}
				</div>

				<div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border-l-4 border-cyan-500 mt-8">
					<p className="text-gray-700">
						<strong className="text-gray-900">Not Included:</strong> Personal
						expenses, additional meals not mentioned, travel insurance, and
						transportation to/from Ahmedabad.
					</p>
				</div>
			</div>
		);
	};
	const renderTabContent = () => {
		switch (activeTab) {
			case "description":
				return <DescriptionTab />;
			case "included":
				return <IncludedTab />;
			case "itinerary":
				return <ItineraryTab />;
			default:
				return <DescriptionTab />;
		}
	};

	if (!event) {
		return <div>Loading...</div>;
	}

	const TicketPopup = ({ isOpen, onClose }) => {
		const [selectedTickets, setSelectedTickets] = useState({});

		if (!isOpen) return null;

		// Get tickets data from eventTickets array (structure: [{ eventId, eventType, tickets: [...] }])
		const allTickets =
			Array.isArray(event?.eventTickets) && event.eventTickets.length > 0
				? event.eventTickets.flatMap((et) => et.tickets || [])
				: [];

		// console.log("All tickets data from event:", allTickets);

		const handleTicketCountChange = (ticketIndex, count) => {
			setSelectedTickets((prev) => ({
				...prev,
				[ticketIndex]: Math.max(0, count),
			}));
		};

		const getTotalAmount = () => {
			// Calculate ticket amount
			const ticketAmount = allTickets.reduce((total, ticket, index) => {
				const count = selectedTickets[index] || 0;
				return total + ticket.ticketPrice * count;
			}, 0);

			// Get event total amount (price + commission + GST)
			const eventTotalAmount = event?.totalAmount || 0;

			// Return combined total (event amount + ticket amount)
			return eventTotalAmount + ticketAmount;
		};

		const handleBookTickets = async () => {
			const bookingData = allTickets
				.map((ticket, index) => ({
					ticketId: ticket._id,
					ticketName: ticket.ticketName,
					ticketPrice: ticket.ticketPrice,
					ticketCount: selectedTickets[index] || 0,
				}))
				.filter((ticket) => ticket.ticketCount > 0);

			console.log("Booking data:", bookingData, typeof bookingData);

			// API call for add user all tickets price, total Price and tickets name to add in database etc
			await addUserAllTickets({
				token: token,
				email: user.email,
				amount: getTotalAmount(),
				eventId: id,
				userAllTickets: bookingData,
			});

			const handlePayment = async () => {
				const details = {
					name: name,
					email: email,
				};

				await PayEvent({
					token,
					eventId: id,
					user_details: details,
					dispatch: dispatch,
				});
			};
			handlePayment();

			onClose();
		};

		return (
			<div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
				<div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-bold">Select Tickets</h2>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 text-2xl">
							×
						</button>
					</div>

					<div className="space-y-4">
						{allTickets.length > 0 ? (
							allTickets.map((ticket, index) => (
								<div
									key={ticket._id || index}
									className="border border-gray-200 rounded-lg p-4">
									<div className="flex justify-between items-center mb-2">
										<div>
											<p className="font-medium text-gray-800">
												{ticket.ticketName}
											</p>
											<p className="text-lg font-bold text-[#E16B33]">
												₹{ticket.ticketPrice}
											</p>
										</div>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600">Quantity:</span>
										<div className="flex items-center gap-2">
											<button
												onClick={() =>
													handleTicketCountChange(
														index,
														(selectedTickets[index] || 0) - 1
													)
												}
												className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
												-
											</button>
											<span className="w-8 text-center">
												{selectedTickets[index] || 0}
											</span>
											<button
												onClick={() =>
													handleTicketCountChange(
														index,
														(selectedTickets[index] || 0) + 1
													)
												}
												className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
												+
											</button>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="text-center py-6">
								<p className="text-gray-600 mb-4">
									Direct event booking - No additional tickets required
								</p>
								<div className="bg-gray-50 rounded-lg p-4">
									<p className="text-sm text-gray-600 mb-2">
										Event Total Amount:
									</p>
									<p className="text-2xl font-bold text-[#E16B33]">
										₹{event?.totalAmount || 0}
									</p>
								</div>
							</div>
						)}
					</div>

					<div className="mt-6 pt-4 border-t border-gray-200">
						<div className="flex justify-between items-center mb-4">
							<span className="text-lg font-semibold">Total Amount:</span>
							<span className="text-xl font-bold text-[#E16B33]">
								₹{getTotalAmount()}
							</span>
						</div>
						<button
							onClick={handleBookTickets}
							disabled={getTotalAmount() === 0}
							className="w-full bg-[#E16B33] text-white py-3 rounded-md hover:bg-[#d55a2a] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
							Proceed Tickets
							<RazorpayIcon className="w-full h-7 text-white" />
						</button>
					</div>

					<button
						className="mt-4 w-full text-sm text-gray-600 hover:underline"
						onClick={onClose}>
						Close
					</button>
				</div>
			</div>
		);
	};

	return (
		<div className="relative">
			<Navbar />

			{/* <section className="relative h-[100vh] overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0 transition-transform duration-75"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1747619715083-3db63905a75a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
            transform: `translateY(${offsetY * 0.5}px)`,
          }}
        />

        <div className="relative z-10 flex items-center justify-center h-full bg-transparent bg-opacity-40 text-white text-center px-4">
          <div>
            <h1 className="text-5xl font-bold mb-4">Parallax Effect</h1>
            <p className="text-xl">Scroll down to see the magic 🌟</p>
          </div>
        </div>
      </section> */}

			<div className="md:pt-[53px] pt-[47px]">
				<img
					src={event.poster}
					alt=""
					className="w-full md:h-[50vh] object-cover object-[0_40%] h-[30vh]"
				/>
				<div
					className={`${
						event.category === "day0"
							? "light-green-radial"
							: event.category === "10x"
							? "light-blue-radial"
							: "light-purple-radial"
					}  `}>
					<div className="md:max-w-[80%] max-w-full mx-auto flex flex-col items-center py-20">
						<h1 className="text-2xl text-center text-[#E16B33] font-semibold ">
							{event.title}
						</h1>
						<p
							className=" text-center my-4 text-gray-700 max-w-[75%] bg-inherit"
							dangerouslySetInnerHTML={{
								__html: event.subtitle?.replace(
									/background-color:\s*[^;]+;?/gi,
									""
								),
							}}></p>

						<div className="mt-10 flex text-[#24655A] text-2xl font-semibold">
							<p>{event.price} INR (Ex GST)</p>{" "}
						</div>
					</div>

					{/* DETAILS */}
					<div className="md:max-w-[80%] max-w-[100%] mx-auto flex flex-col">
						<div className="flex md:flex-row flex-col justify-evenly">
							{[
								{
									label: event.category === "day0" ? "Time" : "Dates",
									icon: hourglass,
									value:
										event.category === "day0"
											? `9:30 AM`
											: event.start_date &&
											  event.end_date &&
											  !isNaN(new Date(event.start_date)) &&
											  !isNaN(new Date(event.end_date))
											? `${format(
													new Date(event.start_date),
													"dd MMM yyyy"
											  )} - ${format(new Date(event.end_date), "dd MMM yyyy")}`
											: "Invalid date",
								},
								{ label: "Duration", icon: Sun, value: `${event.duration}` },
								{
									label: "Date",
									icon: calendar,
									value:
										event?.start_date && !isNaN(new Date(event.start_date))
											? format(new Date(event.start_date), "dd MMM yyyy")
											: "Date unavailable",
								},
								{
									label: "Location",
									icon: map,
									value: `${event.location.city}, ${event.location.state}, ${event.location.country}`,
								},
							].map((item, index) => (
								<div key={index} className="flex flex-col items-center w-full">
									<img
										src={item.icon}
										alt="."
										className="w-auto h-56 object-cover my-5 bg-transparent mix-blend-multiply"
									/>
									<p className="font-medium text-[#E16B33] text-lg ">
										{item.label}
									</p>
									<p className="text-[#24655A] font-medium text-lg text-wrap">
										{item.value}
									</p>
								</div>
							))}
							{event.category === "day0" && event.address && (
								<div className="flex flex-col items-center w-full">
									<img
										src={pin}
										alt="."
										className="w-auto h-56 object-cover my-5"
									/>
									<p className="font-medium text-[#E16B33] text-lg ">Address</p>
									<p className="text-[#24655A] font-medium text-lg text-wrap">
										{event.address.venue}, {event.address.landmark},{" "}
										{event.address.area}
									</p>
								</div>
							)}
						</div>
						{/* CALL TO ACTION */}
						<button
							onClick={
								event?.visibility === "public"
									? () => setShowPopup(true)
									: isEventApproved()
									? () => setShowPopup(true)
									: handleNavigate
							}
							className="bg-[#E16B33] cursor-pointer hover:bg-white hover:text-black hover:border border-[#E16B33] text-white text-lg py-1 px-7 rounded-md shadow-md my-15 self-center">
							{event?.visibility === "public"
								? "Buy Tickets"
								: isEventApproved()
								? "Buy Tickets"
								: "Request Invite"}
						</button>
					</div>
				</div>
			</div>

			{/* <div
        className="md:max-w-[80%] max-w-full px-4 mx-auto"
        dangerouslySetInnerHTML={{ __html: event.description }}
      ></div> */}
			<div
				className={`${
					event.category === "day0"
						? "reverse-light-green"
						: event.category === "10x"
						? "reverse-light-blue"
						: "reverse-light-purple"
				}`}>
				<div className="bg-inherit md:max-w-[80%] max-w-full mx-auto">
					{/* Tab Headers */}
					<div className="flex bg-gray-100 border-b-4 border-gray-200">
						<TabButton
							label="Description"
							tabKey="description"
							isActive={activeTab === "description"}
							onClick={() => setActiveTab("description")}
						/>
						<TabButton
							label="What's Included"
							tabKey="included"
							isActive={activeTab === "included"}
							onClick={() => setActiveTab("included")}
						/>
						<TabButton
							label="Itinerary"
							tabKey="itinerary"
							isActive={activeTab === "itinerary"}
							onClick={() => setActiveTab("itinerary")}
						/>
					</div>

					{/* Tab Content */}
					<div className={`p-8 md:p-12 min-h-96 `}>{renderTabContent()}</div>
				</div>

				<SectionHeader title={"Related Events"} lineColor="bg-[#24655A]" />
				<div className="md:max-w-[80%] max-w-full mx-auto">
					<EventCarousel
						events={events.filter(
							(e) => e.category === event.category && e._id !== id
						)}
					/>
				</div>
			</div>

			{/* RELATED EVENTS */}

			<div
				className={`${
					event.category === "day0"
						? "light-green-radial"
						: event.category === "10x"
						? "light-blue-radial"
						: "light-purple-radial"
				}  `}>
				<div className="md:max-w-[80%] max-w-full mx-auto pt-20 pb-10">
					<ImageGallery images={event.images} />
				</div>
				<div className="md:max-w-[80%] max-w-full mx-auto pt-20 pb-10">
					<SponsorsSection sponsors={event.sponsors} />
				</div>
			</div>

			{/* <div
        className={`${
          event.category === "day0"
            ? "reverse-light-green"
            : event.category === "10x"
            ? "reverse-light-blue"
            : "reverse-light-purple"
        }`}
      > */}
			<SectionHeader title={"FAQs"} lineColor="bg-[#24655A]" />
			<div className="md:max-w-[80%] max-w-full mx-auto md:py-10">
				<Faq />
			</div>
			{/* </div> */}

			<div className="md:max-w-[80%] max-w-full mx-auto my-20">
				<Socials />
			</div>
			<Footer />

			{/* <div className="fixed bottom-0 left-0 w-full bg-white z-50 h-[53px] md:h-[66px] flex justify-center gap-6 py-3 md:px-12 items-center border-t-2 ">
        <div className="text-xl font-medium">₹{event.price}</div>
        <button className="py-2 rounded-md cursor-pointer px-6 bg-[#E16B33] text-white">
          Request invite
        </button>
      </div> */}

			<div className="fixed bottom-0 left-0 w-full h-fit">
				<PriceButton
					price={event?.price}
					totalAmount={event?.totalAmount}
					commissionAmount={event?.commissionAmount}
					gstAmount={event?.gstAmount}
					handleNavigate={handleNavigate}
					handlePayment={handlePayment}
					setShowPopup={setShowPopup}
					id={id}
					category={event.category}
					visibility={event?.visibility}
					TicketPopup={TicketPopup} // Pass TicketPopup as a prop
				/>
			</div>

			{/* Ticket Popup */}
			<TicketPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
		</div>
	);
}

/**
 * Functions present in this component and their purpose:
 *
 * 1. **isAllowed**
 *    Checks if the user's level allows them to join the event based on event category.
 *
 * 2. **isJoined**
 *    Checks if the user has already joined, been approved for, or has a pending request for the event.
 *
 * 3. **isEventApproved**
 *    Checks if the event is approved for the user (status is "pending" or "paid").
 *
 * 4. **handleNavigate**
 *    Handles navigation logic when the user tries to join/request the event (shows popup, sends request, or redirects).
 *
 * 5. **handlePayment**
 *    Initiates the payment process for the event.
 *
 * 6. **TabButton**
 *    Renders a tab button for the tab navigation UI.
 *
 * 7. **ItineraryTab**
 *    Renders the itinerary tab content.
 *
 * 8. **DescriptionTab**
 *    Renders the description tab content.
 *
 * 9. **IncludedTab**
 *    Renders the included tab content.
 *
 * 10. **renderTabContent**
 *     Returns the correct tab content based on the active tab.
 *
 * 11. **TicketPopup**
 *     Renders the ticket selection popup and handles ticket booking/payment logic.
 *
 * **Summary:**
 * There are 11 functions in this component, each handling event logic, UI rendering, or user actions.
 *
 *
 * 9. **IncludedTab**
 *    Renders the included tab content.
 *
 * 10. **renderTabContent**
 *     Returns the correct tab content based on the active tab.
 *
 * 11. **TicketPopup**
 *     Renders the ticket selection popup and handles ticket booking/payment logic.
 *
 * **Summary:**
 * There are 11 functions in this component, each handling event logic, UI rendering, or user actions.
 */
