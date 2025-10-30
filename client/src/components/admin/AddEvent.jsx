/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import {
	CalendarIcon,
	PlusCircle,
	X,
	Clock,
	MapPin,
	Trash2,
	Plus,
	Package,
	DollarSign,
} from "lucide-react";
import { format } from "date-fns";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addEvent } from "@/services/event";
import { useDispatch, useSelector } from "react-redux";
import { Editor } from "primereact/editor";
import LogoImageInput from "../LogoImageInput";

// Simple Date Picker Component
const DatePicker = ({ date, setDate, label, disabled }) => {
	const [open, setOpen] = useState(false);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"w-full justify-start text-left font-normal",
						!date && "text-gray-400"
					)}>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "PPP") : label || "Pick a date"}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={date}
					// onSelect={setDate}
					initialFocus
					disabled={disabled}
					onSelect={(selected) => {
						setDate(selected);
						setOpen(false); // Close the popover after selection
					}}
				/>
			</PopoverContent>
		</Popover>
	);
};

// Time Picker Component
const TimePicker = ({ selectedTime, setSelectedTime }) => {
	const hours = Array.from({ length: 24 }, (_, i) => i);
	const minutes = ["00", "15", "30", "45"];

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"w-full justify-start text-left font-normal",
						!selectedTime && "text-gray-400"
					)}>
					<Clock className="mr-2 h-4 w-4" />
					{selectedTime || "Select a time"}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-64 p-0" align="start">
				<div className="p-2 max-h-64 overflow-y-auto">
					{hours.map((hour) => {
						const displayHour = hour % 12 === 0 ? 12 : hour % 12;
						const amPm = hour < 12 ? "AM" : "PM";

						return minutes.map((minute) => {
							const timeString = `${displayHour}:${minute} ${amPm}`;

							return (
								<div
									key={`${hour}-${minute}`}
									className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded-md"
									onClick={() => {
										setSelectedTime(timeString);
									}}>
									{timeString}
								</div>
							);
						});
					})}
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default function AddEventModal() {
	const [open, setOpen] = useState(false);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [scheduleDate, setScheduleDate] = useState(null);
	const [scheduleTime, setScheduleTime] = useState(null);
	const [itinerary, setItinerary] = useState([
		{
			id: 1,
			date: "",
			title: "",
			activities: [
				{
					id: 1,
					time: "",
					description: "",
					location: "",
				},
			],
		},
	]);
	const [inclusion, setInclusion] = useState([
		{
			id: 1,
			heading: "",
			value: "",
		},
	]);

	const [sponsor, setSponsor] = useState([
		{
			id: 1,
			name: "",
			logo: "",
		},
	]);
	const [errors, setErrors] = useState({});
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef(null);
	const posterInputRef = useRef(null);
	const [duration, setDuration] = useState("");
	const [address, setAddress] = useState({});
	const [commission, setCommission] = useState(0);
	const [eventTicket, setEventTicket] = useState([
		{
			id: 1,
			ticketName: "",
			ticketPrice: 0,
		},
	]);

	const dispatch = useDispatch();
	const token = useSelector((state) => state.auth.token);
	const [subtitle, setSubtitle] = useState(null);
	const [poster, setPoster] = useState(null);
	const [posterPreview, setPosterPreview] = useState(null);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		subtitle: "",
		location: {
			city: "",
			state: "",
			country: "",
		},
		address: {
			venue: "",
			landmark: "",
			area: "",
		},
		price: 0,
		duration: "",
		inclusions: [],
		itinerary: [
			{
				id: 1,
				date: "",
				title: "",
				activities: [
					{
						id: 1,
						time: "",
						description: "",
						location: "",
					},
				],
			},
		],
		sponsors: [
			{
				id: 1,
				name: "",
				logo: "",
			},
		],
		images: [],
		poster: null,
		posterPreview: null,
		eventType: "day0",
		scheduleDate: null,
		scheduleTime: null,
		visibility: "public",
		commission: 0,
		commissionAmount: 0,
		gstAmount: 0,
		totalAmount: 0,
		eventTicket: [],
		specialFunctionalities: [
		{
			id: 1,
			name: "",
			price: "",
		},
	],
	});

	// Add new functionality
const addSpecialFunctionality = () => {
	setFormData((prev) => ({
		...prev,
		specialFunctionalities: [
			...prev.specialFunctionalities,
			{ id: Date.now(), name: "", price: "" },
		],
	}));
};

// Remove a functionality
const removeSpecialFunctionality = (id) => {
	setFormData((prev) => ({
		...prev,
		specialFunctionalities: prev.specialFunctionalities.filter(
			(func) => func.id !== id
		),
	}));
};

// Update name or price
const updateSpecialFunctionality = (id, field, value) => {
	setFormData((prev) => ({
		...prev,
		specialFunctionalities: prev.specialFunctionalities.map((func) =>
			func.id === id ? { ...func, [field]: value } : func
		),
	}));
};


	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		if (name === "city") {
			setFormData((prev) => ({
				...prev,
				location: { ...prev.location, city: value },
			}));
		} else if (name === "state") {
			setFormData((prev) => ({
				...prev,
				location: { ...prev.location, state: value },
			}));
		} else if (name === "country") {
			setFormData((prev) => ({
				...prev,
				location: { ...prev.location, country: value },
			}));
		}

		// Recalculate amounts when price changes
		if (name === "price") {
			const amounts = calculateAmounts(value, formData.commission);
			setFormData((prev) => ({
				...prev,
				[name]: value,
				commissionAmount: amounts.commissionAmount,
				gstAmount: amounts.gstAmount,
				totalAmount: amounts.totalAmount,
			}));
		}

		// Clear error when field is being edited
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: null }));
		}
	};

	// Function to calculate GST and total amount (GST only on commission)
	const calculateAmounts = (price, commissionPercent) => {
		if (!price || isNaN(price))
			return { gstAmount: 0, totalAmount: 0, commissionAmount: 0 };

		const basePrice = parseFloat(price);
		const commissionAmount = (basePrice * commissionPercent) / 100;
		const gstAmount = (commissionAmount * 18) / 100; // 18% GST only on commission
		const totalAmount = basePrice + commissionAmount + gstAmount;

		return {
			commissionAmount: parseFloat(commissionAmount.toFixed(2)),
			gstAmount: parseFloat(gstAmount.toFixed(2)),
			totalAmount: parseFloat(totalAmount.toFixed(2)),
		};
	};

	const handleAddInclusion = () => {
		if (inclusion.trim() === "") return;

		setFormData((prev) => ({
			...prev,
			inclusions: [...prev.inclusions, inclusion.trim()],
		}));
		setInclusion("");
	};

	const handleRemoveInclusion = (index) => {
		setFormData((prev) => ({
			...prev,
			inclusions: prev.inclusions.filter((_, i) => i !== index),
		}));
	};

	const handleImageUpload = (e) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		addImagesToFormData(Array.from(files));
	};

	const handlePosterUpload = (e) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		const file = files[0];
		setPoster(file);
		setPosterPreview(URL.createObjectURL(file));
	};

	const addImagesToFormData = (files) => {
		const newImages = files.map((file) => ({
			file,
			preview: URL.createObjectURL(file),
			name: file.name,
		}));

		setFormData((prev) => ({
			...prev,
			images: [...prev.images, ...newImages],
		}));

		if (errors.images) {
			setErrors((prev) => ({ ...prev, images: null }));
		}
	};

	const handleRemoveImage = (index) => {
		setFormData((prev) => {
			const newImages = [...prev.images];
			// Revoke object URL to prevent memory leaks
			URL.revokeObjectURL(newImages[index].preview);
			newImages.splice(index, 1);
			return { ...prev, images: newImages };
		});
	};

	const handleDragEnter = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const files = Array.from(e.dataTransfer.files);
		const imageFiles = files.filter((file) => file.type.startsWith("image/"));

		if (imageFiles.length > 0) {
			addImagesToFormData(imageFiles);
		}
	};

	const handleDragPosterEnter = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragPosterLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDragPosterOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handlePosterDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const files = Array.from(e.dataTransfer.files);
		const imageFiles = files.filter((file) => file.type.startsWith("image/"));
		if (imageFiles.length > 0) {
			const file = imageFiles[0];
			console.log(file);
			setPoster(file);
			setPosterPreview(URL.createObjectURL(file));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.title.trim()) newErrors.title = "Title is required";
		if (!formData.description.trim())
			newErrors.description = "Description is required";
		if (!formData.location.city.trim()) {
			newErrors.city = "City is required";
		}
		if (!startDate) newErrors.startDate = "Start date is required";
		if (!formData.price.trim()) newErrors.price = "Starting price is required";
		else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
			newErrors.price = "Price must be a valid positive number";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const formatDate = (date) => {
		return date.toISOString().split("T")[0]; // "2025-04-24"
	};

	function convertTo24HrFormat(timeString) {
		const [time, modifier] = timeString.split(" ");
		let [hours, minutes] = time.split(":");

		if (modifier === "PM" && hours !== "12") hours = String(+hours + 12);
		if (modifier === "AM" && hours === "12") hours = "00";

		return `${hours.padStart(2, "0")}:${minutes}`;
	}

	const formatTimestamp = (date, time) => {
		if (!date || !time) return null;

		const day = date.toISOString().split("T")[0]; // "YYYY-MM-DD"
		const fullTime = convertTo24HrFormat(time); // "HH:mm"
		return `${day} ${fullTime}:00`; // "YYYY-MM-DD HH:mm:ss"
	};

	const handleSubmit = (status) => {
		// console.log("submit data start", formData);

		// if (validateForm()) return;

		// Prepare data for submission
		console.log("iti", itinerary);
		console.log("inc", inclusion);

		const data = new FormData();

		// Add basic text fields
		data.append("title", formData.title);
		data.append("description", formData.description);
		data.append("price", formData.price);
		data.append("type", formData.eventType);
		data.append("visibility", formData.visibility);
		data.append("commission", formData.commission);
		data.append("commissionAmount", formData.commissionAmount);
		data.append("gstAmount", formData.gstAmount);
		data.append("totalAmount", formData.totalAmount);

		// Add location as JSON string
		data.append("location", JSON.stringify(formData.location));

		// Add dates
		if (startDate) data.append("startDate", formatDate(startDate));
		if (endDate) data.append("endDate", formatDate(endDate));

		// Add scheduling information if applicable
		if (status === "scheduled" && scheduleDate && scheduleTime) {
			const scheduledFor = formatTimestamp(scheduleDate, scheduleTime);
			data.append("scheduledFor", scheduledFor);
		}

		// Add inclusions as JSON string
		if (inclusion.length > 0) {
			// formData.inclusions.forEach((inclusion) => {
			console.log("parsed", JSON.stringify(inclusion));
			data.append("inclusions", JSON.stringify(inclusion));
			// });

			// data.append("inclusions", formData.inclusions);
		}

		if (poster) {
			data.append("poster", poster);
		}

		if (subtitle) {
			data.append("subtitle", subtitle);
		}

		if (duration) {
			data.append("duration", duration);
		}
		if (
		formData.specialFunctionalities &&
		formData.specialFunctionalities.length > 0
	) {
		data.append(
			"specialFunctionalities",
			JSON.stringify(formData.specialFunctionalities)
		);
	}

		if (itinerary) {
			// formData.inclusions.forEach((it) => {
			data.append("itinerary", JSON.stringify(itinerary));
			// });
		}

		// if (address !== null) {
		data.append("address", JSON.stringify(address));
		// }

		// Add images
		formData.images.forEach((imageObj) => {
			// Append the actual file object, not the preview object
			data.append("images", imageObj.file);
		});

		// Process sponsors data
		const sponsorDataWithoutFiles = sponsor.map((sp) => ({
			id: sp.id,
			name: sp.name,
			// Don't include the logo file object in JSON
		}));

		// Add sponsors JSON data
		data.append("sponsors", JSON.stringify(sponsorDataWithoutFiles));


		// Add sponsor logo files with specific field names
		sponsor.forEach((sp) => {
			if (sp.logo && sp.logo instanceof File) {
				data.append(`sponsorLogo`, sp.logo);
			}
		});


		// sponsor testing code here
		// if (sponsor && sponsor.length > 0) {
		// 	const sponsorsData = sponsor.map((sp) => {
		// 		// Append actual File to FormData
		// 		if (sp.logo && sp.logo instanceof File) {
		// 			data.append(`sponsorLogo_${sp.id}`, sp.logo);
		// 		}

		// 		// Return metadata, including filename
		// 		return {
		// 			id: sp.id,
		// 			name: sp.name || "", // or sp.name if you have a separate name field
		// 			logo: sp.logo || "", // add logo file name here
		// 		};
		// 	});

		// 	data.append("sponsorlist", JSON.stringify(sponsorsData));
		// }




		// Add tickets data
		if (eventTicket && eventTicket.length > 0) {
			const ticketsData = eventTicket.map((ticket) => ({
				ticketName: ticket.ticketName,
				ticketPrice: ticket.ticketPrice,
				ticketCount: 0, // Default count, will be managed by users
			}));
			data.append("eventTicket", JSON.stringify(ticketsData));
		}


		console.log("FormData contents:");
		for (let [key, value] of data.entries()) {
			console.log(`${key}:`, value, typeof value);
		}

		// console.log("submit data End", data);

		dispatch(addEvent({ event: data, token: token }));

		// let message = "";
		// if (status === "published") message = "Event published!";
		// else if (status === "draft") message = "Event saved as draft!";
		// else if (status === "scheduled")
		//   message = `Event scheduled for ${format(
		//     scheduleDate,
		//     "PPP"x`

		//   )} at ${scheduleTime}!`;

		// alert(message);

		// Reset the form
		// setFormData({
		//   title: "",
		//   description: "",
		//   city: "",
		//   state: "",
		//   country: "",
		//   price: "",
		//   inclusions: [],
		//   images: [],
		//   location: {
		//     city: "",
		//     state: "",
		//     country: "",
		//   },
		// });
		// setItinerary([
		//   {
		//     id: 1,
		//     date: "",
		//     title: "",
		//     activities: [
		//       {
		//         id: 1,
		//         time: "",
		//         description: "",
		//         location: "",
		//       },
		//     ],
		//   },
		// ]);
		// setInclusion([
		//   {
		//     id: 1,
		//     heading: "",
		//     value: "",
		//   },
		// ]);
		// setStartDate(null);
		// setEndDate(null);
		// setScheduleDate(null);
		// setScheduleTime(null);
		// setOpen(false);
		// setDescription(null);
	};

	const addDay = () => {
		const newDay = {
			id: Date.now(),
			date: "",
			title: "",
			activities: [
				{
					id: Date.now() + 1,
					time: "",
					description: "",
					location: "",
				},
			],
		};
		setItinerary([...itinerary, newDay]);
	};

	const removeDay = (dayId) => {
		if (itinerary.length > 1) {
			setItinerary(itinerary.filter((day) => day.id !== dayId));
		}
	};

	const updateDay = (dayId, field, value) => {
		setItinerary(
			itinerary.map((day) =>
				day.id === dayId ? { ...day, [field]: value } : day
			)
		);
	};

	const addActivity = (dayId) => {
		const newActivity = {
			id: Date.now(),
			time: "",
			description: "",
			location: "",
		};
		setItinerary(
			itinerary.map((day) =>
				day.id === dayId
					? { ...day, activities: [...day.activities, newActivity] }
					: day
			)
		);
	};

	const removeActivity = (dayId, activityId) => {
		setItinerary(
			itinerary.map((day) =>
				day.id === dayId
					? {
							...day,
							activities: day.activities.filter(
								(activity) => activity.id !== activityId
							),
					  }
					: day
			)
		);
	};

	const updateActivity = (dayId, activityId, field, value) => {
		setItinerary(
			itinerary.map((day) =>
				day.id === dayId
					? {
							...day,
							activities: day.activities.map((activity) =>
								activity.id === activityId
									? { ...activity, [field]: value }
									: activity
							),
					  }
					: day
			)
		);
	};

	const addInclusion = () => {
		const newInclusion = {
			id: Date.now(),
			heading: "",
			value: "",
		};
		setInclusion([...inclusion, newInclusion]);
	};

	const removeInclusion = (id) => {
		if (inclusion.length > 1) {
			setInclusion(inclusion.filter((inclusion) => inclusion.id !== id));
		}
	};

	const updateInclusion = (id, field, value) => {
		setInclusion(
			inclusion.map((inclusion) =>
				inclusion.id === id ? { ...inclusion, [field]: value } : inclusion
			)
		);
	};

	const addSponsor = () => {
		const newSponsor = {
			id: Date.now(),
			name: "",
			logo: "",
		};
		setSponsor([...sponsor, newSponsor]);
	};

	const removeSponsor = (id) => {
		if (sponsor.length > 1) {
			setSponsor(sponsor.filter((inclusion) => inclusion.id !== id));
		}
	};

	const updateSponsor = (id, field, value) => {
		setSponsor(
			sponsor.map((inclusion) =>
				inclusion.id === id ? { ...inclusion, [field]: value } : inclusion
			)
		);
	};

	const handleLogoChange = (id, newLogo) => {
		setSponsor((prevSponsors) =>
			prevSponsors.map((sponsor) =>
				sponsor.id === id ? { ...sponsor, logo: newLogo } : sponsor
			)
		);
	};

	// Ticket management functions
	const addTicket = () => {
		const newTicket = {
			id: Date.now(),
			ticketName: "",
			ticketPrice: 0,
		};
		setEventTicket([...eventTicket, newTicket]);
	};

	const removeTicket = (id) => {
		if (eventTicket.length > 1) {
			setEventTicket(eventTicket.filter((ticket) => ticket.id !== id));
		}
	};

	const updateTicket = (id, field, value) => {
		setEventTicket(
			eventTicket.map((ticket) =>
				ticket.id === id ? { ...ticket, [field]: value } : ticket
			)
		);
	};
	return (
		<>
			<div className="flex justify-end mb-6">
				<button
					onClick={() => setOpen(true)}
					className="bg-black text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-800 transition">
					+ Add Event
				</button>
			</div>

			{open && (
				<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3">
					<div className="bg-white rounded-md w-full max-w-3xl relative max-h-[90vh] overflow-y-auto thin-scrollbar">
						<button
							onClick={() => setOpen(false)}
							className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-2xl">
							×
						</button>

						<div className="p-6">
							<h2 className="text-xl font-bold text-gray-800 mb-1">
								Add New Event
							</h2>
							<p className="text-sm text-gray-600 mb-4">
								Create a new event by filling in the details below.
							</p>

							{/* Add Public/Private Event Buttons */}
							<div className="flex gap-2 mb-4">
								<button
									type="button"
									className={`w-32 py-2 rounded-md transition text-white ${
										formData.visibility === "public"
											? "bg-blue-600"
											: "bg-gray-400 hover:bg-blue-500"
									}`}
									onClick={() =>
										setFormData((prev) => ({ ...prev, visibility: "public" }))
									}>
									Public Event
								</button>
								<button
									type="button"
									className={`w-32 py-2 rounded-md transition text-white ${
										formData.visibility === "private"
											? "bg-blue-600"
											: "bg-gray-400 hover:bg-blue-500"
									}`}
									onClick={() =>
										setFormData((prev) => ({ ...prev, visibility: "private" }))
									}>
									Private Event
								</button>
							</div>

							<div className="space-y-4">
								{/* Title */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Title <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="title"
										placeholder="Event title"
										value={formData.title}
										onChange={handleChange}
										className={`w-full border ${
											errors.title ? "border-red-500" : "border-gray-300"
										} rounded-md px-3 py-2 text-gray-700`}
									/>
									{errors.title && (
										<p className="text-red-500 text-xs mt-1">{errors.title}</p>
									)}
								</div>

								{/* Description */}
								<div>
									<label
										htmlFor="description"
										className="block text-sm font-medium text-gray-700 mb-1">
										Description
									</label>
									<Editor
										value={formData.description}
										name="description"
										className=""
										onTextChange={(e) =>
											setFormData((prevFormData) => ({
												...prevFormData,
												description: e.htmlValue,
											}))
										}
										style={{ height: "320px" }}
									/>
								</div>

								<div>
									<label
										htmlFor="subtitle"
										className="block text-sm font-medium text-gray-700 mb-1">
										Subtitle
									</label>
									<Editor
										value={subtitle}
										name="subtitle"
										className=""
										onTextChange={(e) => setSubtitle(e.htmlValue)}
										style={{ height: "120px" }}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Event Type
									</label>
									<select
										name="eventType"
										value={formData.eventType}
										onChange={handleChange}
										className={`w-full border ${
											errors.eventType ? "border-red-500" : "border-gray-300"
										} rounded-md px-3 py-2 text-gray-700`}>
										<option value="day0">Day 0</option>
										<option value="10x">10x</option>
										<option value="100x">100x</option>
									</select>
								</div>

								{/* Dates */}
								<div className="grid grid-cols-2 gap-4 justify-between">
									<div className="w-full">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Start Date <span className="text-red-500">*</span>
										</label>
										<DatePicker
											date={startDate}
											setDate={setStartDate}
											label="Select start date"
											disabled={(date) =>
												date < new Date(new Date().setHours(0, 0, 0, 0))
											}
										/>
										{errors.startDate && (
											<p className="text-red-500 text-xs mt-1">
												{errors.startDate}
											</p>
										)}
									</div>
									{formData.eventType !== "day0" && (
										<div className="w-full">
											<label className="block text-sm font-medium text-gray-700 mb-1">
												End Date
											</label>
											<DatePicker
												date={endDate}
												setDate={setEndDate}
												label="Select end date"
												disabled={(date) =>
													!startDate ||
													date <= new Date(startDate.setHours(0, 0, 0, 0))
												}
											/>
										</div>
									)}
								</div>

								{/* Starting Price */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Starting Price <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<span className="absolute left-3 top-2.5 text-gray-500">
											₹
										</span>
										<input
											type="number"
											name="price"
											placeholder="0.00"
											value={formData.price}
											onChange={handleChange}
											className={`w-full border ${
												errors.price ? "border-red-500" : "border-gray-300"
											} rounded-md pl-7 pr-3 py-2 text-gray-700`}
										/>
									</div>
									{errors.price && (
										<p className="text-red-500 text-xs mt-1">{errors.price}</p>
									)}
								</div>

								{/* Commission Slider */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Commission (%)
									</label>
									<div className="flex items-center gap-4">
										<input
											type="range"
											min={0}
											max={10}
											step={1}
											value={formData.commission}
											onChange={(e) => {
												const value = Number(e.target.value);
												setCommission(value);
												const amounts = calculateAmounts(formData.price, value);
												setFormData((prev) => ({
													...prev,
													commission: value,
													commissionAmount: amounts.commissionAmount,
													gstAmount: amounts.gstAmount,
													totalAmount: amounts.totalAmount,
												}));
											}}
											className="w-full"
										/>
										<span className="w-10 text-right">
											{formData.commission}%
										</span>
									</div>
								</div>

								{/* Commission Amount Display */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Commission Amount
									</label>
									<div className="relative">
										<span className="absolute left-3 top-2.5 text-gray-500">
											₹
										</span>
										<input
											type="text"
											value={formData.commissionAmount || 0}
											readOnly
											className="w-full border border-gray-300 rounded-md pl-7 pr-3 py-2 text-gray-700 bg-gray-50"
										/>
									</div>
								</div>

								{/* GST Amount Display (18% on Commission) */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										GST Amount (18% on Commission)
									</label>
									<div className="relative">
										<span className="absolute left-3 top-2.5 text-gray-500">
											₹
										</span>
										<input
											type="text"
											value={formData.gstAmount || 0}
											readOnly
											className="w-full border border-gray-300 rounded-md pl-7 pr-3 py-2 text-gray-700 bg-gray-50"
										/>
									</div>
								</div>

								{/* Total Amount Display */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Total Amount (Price + Commission + GST on Commission)
									</label>
									<div className="relative">
										<span className="absolute left-3 top-2.5 text-gray-500">
											₹
										</span>
										<input
											type="text"
											value={formData.totalAmount || 0}
											readOnly
											className="w-full border border-gray-300 rounded-md pl-7 pr-3 py-2 text-gray-700 bg-gray-100 font-semibold"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Duration
									</label>
									<div className="relative">
										<input
											type="text"
											name="duration"
											placeholder="hours or days"
											value={duration}
											onChange={(e) => setDuration(e.target.value)}
											className={`w-full border ${
												errors.price ? "border-red-500" : "border-gray-300"
											} rounded-md pl-3 pr-3 py-2 text-gray-700`}
										/>
									</div>
									{errors.price && (
										<p className="text-red-500 text-xs mt-1">
											{errors.duration}
										</p>
									)}
								</div>

								{/* Ticket Booking Section - Only for 10x and 100x events */}
								{(formData.eventType === "10x" ||
									formData.eventType === "100x") && (
									<div className="grid grid-cols-1 gap-8">
										<h1 className="text-blue-600 text-xl font-medium">
											Ticket Management
										</h1>
										<div className="space-y-6">
											<div className="space-y-4">
												{eventTicket.map((ticket, index) => (
													<div
														key={ticket.id}
														className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
														<div className="flex items-center justify-between mb-4">
															<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
																<Package className="w-5 h-5 text-blue-600" />	
																Ticket {index + 1}
															</h3>
															{eventTicket.length > 1 && (
																<button
																	type="button"
																	onClick={() => removeTicket(ticket.id)}
																	className="text-red-500 hover:text-red-700 p-1 transition-colors"
																	title="Remove Ticket">
																	<Trash2 className="w-4 h-4" />
																</button>
															)}
														</div>

														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															<div>
																<label className="block text-sm font-medium text-gray-700 mb-2">
																	Ticket Name
																</label>
																<input
																	type="text"
																	value={ticket.ticketName}
																	onChange={(e) =>
																		updateTicket(
																			ticket.id,
																			"ticketName",
																			e.target.value
																		)
																	}
																	placeholder="e.g., Early Bird, VIP, General"
																	className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
																/>
															</div>

															<div>
																<label className="block text-sm font-medium text-gray-700 mb-2">
																	Ticket Price
																</label>
																<div className="relative">
																	<span className="absolute left-3 top-3 text-gray-500">
																		₹
																	</span>
																	<input
																		type="number"
																		value={ticket.ticketPrice}
																		onChange={(e) =>
																			updateTicket(
																				ticket.id,
																				"ticketPrice",
																				Number(e.target.value)
																			)
																		}
																		placeholder="0.00"
																		className="w-full pl-7 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
																	/>
																</div>
															</div>
														</div>
													</div>
												))}
											</div>

											<div className="flex gap-4">
												<button
													type="button"
													onClick={addTicket}
													className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
													<Plus className="w-4 h-4" />
													Add Ticket
												</button>
											</div>
										</div>
									</div>
								)}

								<div className="grid grid-cols-1  gap-8 ">
									{/* Form Section */}
									<div className="space-y-6 ">
										<div className="space-y-6 ">
											{itinerary.map((day, dayIndex) => (
												<div
													key={day.id}
													className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm w-full">
													<div className="flex items-center justify-between mb-4">
														<h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
															{/* <Calendar className="w-5 h-5 text-blue-600" /> */}
															Day {dayIndex + 1}
														</h2>
														{itinerary.length > 1 && (
															<button
																type="button"
																onClick={() => removeDay(day.id)}
																className="text-red-500 hover:text-red-700 p-1"
																title="Remove Day">
																<Trash2 className="w-4 h-4" />
															</button>
														)}
													</div>

													<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-1">
																Date
															</label>
															<input
																type="date"
																value={day.date}
																onChange={(e) =>
																	updateDay(day.id, "date", e.target.value)
																}
																className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
															/>
														</div>
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-1">
																Day Title
															</label>
															<input
																type="text"
																value={day.title}
																onChange={(e) =>
																	updateDay(day.id, "title", e.target.value)
																}
																placeholder="e.g., Arrival & Old City Exploration"
																className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
															/>
														</div>
													</div>

													<div className="space-y-3">
														<h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
															<Clock className="w-4 h-4" />
															Activities
														</h3>

														{day.activities.map((activity) => (
															<div
																key={activity.id}
																className="border border-gray-100 rounded-md p-4 bg-gray-50">
																<div className="flex items-start gap-4">
																	<div className="flex-1 space-y-3">
																		<div className="grid grid-cols-2 gap-3">
																			<div>
																				<label className="block text-xs font-medium text-gray-600 mb-1">
																					Time
																				</label>
																				<input
																					type="time"
																					value={activity.time}
																					onChange={(e) =>
																						updateActivity(
																							day.id,
																							activity.id,
																							"time",
																							e.target.value
																						)
																					}
																					className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
																				/>
																			</div>
																			<div>
																				<label className="block text-xs font-medium text-gray-600 mb-1">
																					Location
																				</label>
																				<div className="relative">
																					<MapPin className="absolute left-2 top-1.5 w-3 h-3 text-gray-400" />
																					<input
																						type="text"
																						value={activity.location}
																						onChange={(e) =>
																							updateActivity(
																								day.id,
																								activity.id,
																								"location",
																								e.target.value
																							)
																						}
																						placeholder="Location"
																						className="w-full pl-7 pr-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
																					/>
																				</div>
																			</div>
																		</div>
																		<div>
																			<label className="block text-xs font-medium text-gray-600 mb-1">
																				Activity Description
																			</label>
																			<textarea
																				value={activity.description}
																				onChange={(e) =>
																					updateActivity(
																						day.id,
																						activity.id,
																						"description",
																						e.target.value
																					)
																				}
																				placeholder="Describe the activity..."
																				rows="2"
																				className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
																			/>
																		</div>
																	</div>
																	{day.activities.length > 1 && (
																		<button
																			type="button"
																			onClick={() =>
																				removeActivity(day.id, activity.id)
																			}
																			className="text-red-500 hover:text-red-700 p-1 mt-4"
																			title="Remove Activity">
																			<Trash2 className="w-3 h-3" />
																		</button>
																	)}
																</div>
															</div>
														))}

														<button
															type="button"
															onClick={() => addActivity(day.id)}
															className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
															<Plus className="w-4 h-4" />
															Add Activity
														</button>
													</div>
												</div>
											))}

											<div className="flex gap-4">
												<button
													type="button"
													onClick={addDay}
													className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
													<Plus className="w-4 h-4" />
													Add Day
												</button>
											</div>
										</div>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-8">
									{/* Form Section */}
									<h1 className="text-green-600 text-xl font-medium">
										Inclusions
									</h1>
									<div className="space-y-6">
										<div className="space-y-4">
											{inclusion.map((inclusio, index) => (
												<div
													key={inclusio.id}
													className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
													<div className="flex items-center justify-between mb-4">
														<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
															<Package className="w-5 h-5 text-green-600" />
															Inclusion {index + 1}
														</h3>
														{inclusion.length > 1 && (
															<button
																type="button"
																onClick={() => removeInclusion(inclusio.id)}
																className="text-red-500 hover:text-red-700 p-1 transition-colors"
																title="Remove Inclusion">
																<Trash2 className="w-4 h-4" />
															</button>
														)}
													</div>

													<div className="space-y-4">
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Heading/Category
															</label>
															<input
																type="text"
																value={inclusio.heading}
																onChange={(e) =>
																	updateInclusion(
																		inclusio.id,
																		"heading",
																		e.target.value
																	)
																}
																placeholder="e.g., Accommodation, Meals, Transportation"
																className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
															/>
														</div>

														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Description/Details
															</label>
															<textarea
																value={inclusio.value}
																onChange={(e) =>
																	updateInclusion(
																		inclusio.id,
																		"value",
																		e.target.value
																	)
																}
																placeholder="e.g., 2 nights in a premium heritage hotel with modern amenities"
																rows="3"
																className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-vertical"
															/>
														</div>
													</div>
												</div>
											))}
										</div>

										<div className="flex gap-4">
											<button
												type="button"
												onClick={addInclusion}
												className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
												<Plus className="w-4 h-4" />
												Add Inclusion
											</button>
										</div>
									</div>
								</div>

								{formData.specialFunctionalities.map((func, index) => (
	<div key={func.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
		<div className="flex items-center justify-between mb-4">
			<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
				<Package className="w-5 h-5 text-green-600" />
				Special Functionality {index + 1}
			</h3>
			{formData.specialFunctionalities.length > 1 && (
				<button
					type="button"
					onClick={() => removeSpecialFunctionality(func.id)}
					className="text-red-500 hover:text-red-700 p-1 transition-colors"
					title="Remove Functionality">
					<Trash2 className="w-4 h-4" />
				</button>
			)}
		</div>

		<div className="space-y-4">
			{/* Name Field */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Functionality Name
				</label>
				<input
					type="text"
					value={func.name}
					onChange={(e) =>
						updateSpecialFunctionality(func.id, "name", e.target.value)
					}
					placeholder="e.g., Live Chat Support, AI Recommendation Engine"
					className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
				/>
			</div>

			{/* Price Field */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Price
				</label>
				<input
					type="number"
					value={func.price}
					onChange={(e) =>
						updateSpecialFunctionality(func.id, "price", e.target.value)
					}
					placeholder="e.g., 4999"
					className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
				/>
			</div>
		</div>
	</div>
))}

<div className="flex gap-4">
	<button
		type="button"
		onClick={addSpecialFunctionality}
		className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
		<Plus className="w-4 h-4" />
		Add Functionality
	</button>
</div>



								<div className="grid grid-cols-1 gap-8">
									{/* Form Section */}
									<div className="space-y-6">
										<h1 className="text-red-600 text-xl font-medium">
											Sponsors
										</h1>
										<div className="space-y-4">
											{sponsor.map((inclusion, index) => (
												<div
													key={inclusion.id}
													className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
													<div className="flex items-center justify-between mb-4">
														<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
															<DollarSign className="w-5 h-5 text-green-600" />
															Sponsor {index + 1}
														</h3>
														{sponsor.length > 1 && (
															<button
																type="button"
																onClick={() => removeSponsor(inclusion.id)}
																className="text-red-500 hover:text-red-700 p-1 transition-colors"
																title="Remove Inclusion">
																<Trash2 className="w-4 h-4" />
															</button>
														)}
													</div>

													<div className="space-y-4">
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Name
															</label>
															<input
																type="text"
																value={sponsor.name}
																onChange={(e) =>
																	updateSponsor(
																		inclusion.id,
																		"name",
																		e.target.value
																	)
																}
																placeholder="e.g., Google"
																className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
															/>
														</div>

														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Logo
															</label>
															{/* <textarea
                                value={sponsor.logo}
                                onChange={(e) =>
                                  updateSponsor(
                                    inclusion.id,
                                    "logo",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., 2 nights in a premium heritage hotel with modern amenities"
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-vertical"
                              /> */}

															<LogoImageInput
																value={inclusion.logo}
																onChange={handleLogoChange}
																id={inclusion.id}
															/>
															{/* 
                              {inclusion.logo && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                  <p className="text-xs text-gray-600">
                                    Current value length:{" "}
                                    {inclusion.logo.length} characters
                                  </p>
                                </div>
                              )} */}
															{/* <LogoImageInput /> */}
														</div>
													</div>
												</div>
											))}
										</div>

										<div className="flex gap-4">
											<button
												type="button"
												onClick={addSponsor}
												className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium">
												<Plus className="w-4 h-4" />
												Add Sponsor
											</button>
										</div>
									</div>
								</div>

								{formData.eventType === "day0" && (
									<>
										{/* Address */}
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Address <span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												name="venue"
												placeholder="Venue"
												value={address.venue}
												onChange={(e) =>
													setAddress((prev) => ({
														...prev,
														venue: e.target.value,
													}))
												}
												className={`w-full border ${
													errors.city ? "border-red-500" : "border-gray-300"
												} rounded-md px-3 py-2 text-gray-700 mb-2`}
											/>
											{errors.city && (
												<p className="text-red-500 text-xs mb-1">
													{errors.city}
												</p>
											)}
											<input
												type="text"
												name="landmark"
												placeholder="Landmark"
												value={address.landmark}
												onChange={(e) =>
													setAddress((prev) => ({
														...prev,
														landmark: e.target.value,
													}))
												}
												className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 mb-2"
											/>
											<input
												type="text"
												name="area"
												placeholder="Area"
												value={address.area}
												onChange={(e) =>
													setAddress((prev) => ({
														...prev,
														area: e.target.value,
													}))
												}
												className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
											/>
										</div>
									</>
								)}

								{/* Location */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Location <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="city"
										placeholder="City"
										value={formData.location.city}
										onChange={handleChange}
										className={`w-full border ${
											errors.city ? "border-red-500" : "border-gray-300"
										} rounded-md px-3 py-2 text-gray-700 mb-2`}
									/>
									{errors.city && (
										<p className="text-red-500 text-xs mb-1">{errors.city}</p>
									)}
									<input
										type="text"
										name="state"
										placeholder="State"
										value={formData.location.state}
										onChange={handleChange}
										className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 mb-2"
									/>
									<input
										type="text"
										name="country"
										placeholder="Country"
										value={formData.location.country}
										onChange={handleChange}
										className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
									/>
								</div>

								{/* Inclusions */}
								{/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What's Included
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={inclusion}
                      onChange={(e) => setInclusion(e.target.value)}
                      placeholder="Add what's included in this event"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddInclusion();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddInclusion}
                      className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                    >
                      <PlusCircle size={20} />
                    </button>
                  </div>

                  {formData.inclusions.length > 0 && (
                    <ul className="space-y-1 border border-gray-200 rounded-md p-3 bg-gray-50">
                      {formData.inclusions.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2"></span>
                            {item}
                          </div>
                          <button
                            onClick={() => handleRemoveInclusion(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div> */}

								{/* Multiple Image Upload with Drag and Drop */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Event Images
									</label>
									<div
										className={`border-2 border-dashed ${
											isDragging
												? "border-blue-500 bg-blue-50"
												: formData.images.length > 0
												? "border-blue-300"
												: "border-gray-300"
										} rounded-md p-6 flex flex-col items-center justify-center text-gray-500 transition-colors`}
										onDragEnter={handleDragEnter}
										onDragLeave={handleDragLeave}
										onDragOver={handleDragOver}
										onDrop={handleDrop}>
										<input
											type="file"
											accept="image/*"
											className="hidden"
											onChange={handleImageUpload}
											multiple
											ref={fileInputRef}
										/>

										{formData.images.length === 0 ? (
											<>
												<p className="text-sm text-center mb-2">
													{isDragging
														? "Drop images here"
														: "Drag and drop images here or click to select"}
												</p>
												<button
													type="button"
													onClick={() => fileInputRef.current.click()}
													className="px-4 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-200">
													Select Images
												</button>
											</>
										) : (
											<>
												<div className="grid grid-cols-3 gap-2 w-full mb-3">
													{formData.images.map((image, index) => (
														<div key={index} className="relative group">
															<div className="relative h-20 w-full">
																<img
																	src={image.preview}
																	alt={`Preview ${index}`}
																	className="h-full w-full object-cover rounded-md"
																/>
																<button
																	onClick={() => handleRemoveImage(index)}
																	className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md">
																	<X size={14} />
																</button>
															</div>
															<p className="text-xs truncate mt-1 text-gray-500">
																{image.name}
															</p>
														</div>
													))}
												</div>
												<button
													type="button"
													onClick={() => fileInputRef.current.click()}
													className="px-4 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-200">
													Add More Images
												</button>
											</>
										)}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Event Poster
									</label>
									<div
										className={`border-2 border-dashed ${
											isDragging
												? "border-blue-500 bg-blue-50"
												: formData.images.length > 0
												? "border-blue-300"
												: "border-gray-300"
										} rounded-md p-6 flex flex-col items-center justify-center text-gray-500 transition-colors`}
										onDragEnter={handleDragPosterEnter}
										onDragLeave={handleDragPosterLeave}
										onDragOver={handleDragPosterOver}
										onDrop={handlePosterDrop}>
										<input
											type="file"
											accept="image/*"
											className="hidden"
											onChange={handlePosterUpload}
											ref={posterInputRef}
										/>

										{!poster ? (
											<>
												<p className="text-sm text-center mb-2">
													{isDragging
														? "Drop images here"
														: "Drag and drop images here or click to select"}
												</p>
												<button
													type="button"
													onClick={() => posterInputRef.current.click()}
													className="px-4 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-200">
													Select Images
												</button>
											</>
										) : (
											<>
												<div className="grid grid-cols-3 gap-2 w-full mb-3">
													{posterPreview && (
														<div className="relative group">
															<div className="relative h-20 w-full">
																<img
																	src={posterPreview}
																	alt={`Preview ${Date.now()}`}
																	onLoad={() =>
																		URL.revokeObjectURL(posterPreview)
																	}
																	className="h-full w-full object-cover rounded-md"
																/>
																<button
																	onClick={() => {
																		setPoster(null);
																		setPosterPreview(null);
																	}}
																	className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md">
																	<X size={14} />
																</button>
															</div>
															<p className="text-xs truncate mt-1 text-gray-500">
																{poster.name}
															</p>
														</div>
													)}
												</div>
												<button
													type="button"
													onClick={() => fileInputRef.current.click()}
													className="px-4 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-200">
													Add More Images
												</button>
											</>
										)}
									</div>
								</div>

								{/* Schedule Publication */}
								<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
									<h3 className="text-sm font-medium text-gray-700 mb-3">
										Schedule Publication
									</h3>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="block text-xs text-gray-500 mb-1">
												Date
											</label>
											<DatePicker
												date={scheduleDate}
												setDate={setScheduleDate}
												label="Schedule date"
											/>
										</div>
										<div>
											<label className="block text-xs text-gray-500 mb-1">
												Time
											</label>
											<TimePicker
												selectedTime={scheduleTime}
												setSelectedTime={setScheduleTime}
											/>
										</div>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="pt-4 flex gap-3">
									<button
										onClick={() => handleSubmit("draft")}
										className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
										type="button">
										Save Draft
									</button>
									<button
										onClick={() => handleSubmit("published")}
										className="flex-1 bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800"
										type="button">
										Publish
									</button>
									<button
										onClick={() => {
											if (!scheduleDate || !scheduleTime) {
												alert(
													"Please select both a date and time to schedule publication"
												);
												return;
											}
											handleSubmit("scheduled");
										}}
										className="flex-1 bg-green-700 text-white py-2 rounded-md hover:bg-green-600"
										type="button"
										disabled={!scheduleDate || !scheduleTime}>
										Schedule
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
