const { instance } = require("../config/razorpay");
const crypto = require("crypto");
const User = require("../models/user");
const Event = require("../models/event");
const { default: mongoose } = require("mongoose");
const { sendPaymentSuccessfulEmail } = require("../utils/mailer");
const Invoice = require("../models/invoice");
const Approved = require("../models/approved");
const Request = require("../models/request");
const Joined = require("../models/joined");

exports.addUserAllTickets = async (req, res) => {
	try {
		const { amount, email, eventId, userAllTickets } = req.body;
		if (!amount || !email) {
			return res.status(400).json({
				message: "Amount and email are required",
			});
		}

		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(400).json({
				message: "User not found",
			});
		}

		// Check if user already joined this event
		const alreadyJoined = await Joined.findOne({ userId: user._id, eventId });
		if (alreadyJoined) {
			return res.status(400).json({
				message: "User already joined this event",
			});
		}

		// Store userAllTickets data if provided and valid
		if (Array.isArray(userAllTickets) && userAllTickets.length > 0) {
			if (!Array.isArray(user.userAllTickets)) {
				user.userAllTickets = [];
			}
			userAllTickets.forEach((ticket) => {
				if (
					ticket.ticketName &&
					typeof ticket.ticketPrice === "number" &&
					typeof ticket.ticketCount === "number" &&
					eventId
				) {
					user.userAllTickets.push({
						ticketName: ticket.ticketName,
						ticketPrice: ticket.ticketPrice,
						ticketCount: ticket.ticketCount,
						eventId: eventId,
					});
				}
			});
			user.markModified("userAllTickets");
		}

		await user.save();

		return res.status(200).json({
			message: "Amount and User tickets added successfully",
			totalAmount: user.totalAmount,
			ticketsAdded: userAllTickets ? userAllTickets.length : 0,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Error while adding amount",
		});
	}
};

exports.capturePayment = async (req, res) => {
	try {
		const { eventId } = req.body;
		const { userId } = req.user;

		const event = await Event.findById(eventId);
		if (!event) {
			return res.status(400).json({
				message: "Event not found",
			});
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(400).json({
				message: "User not found",
			});
		}

		const alreadyJoined = await Joined.findOne({ userId, eventId });

		if (alreadyJoined) {
			return res.status(400).json({
				message: "User already joined this event",
			});
		}

		// Calculate total ticket price from userAllTickets for this event
		let ticketAmount = 0;
		if (Array.isArray(user.userAllTickets) && user.userAllTickets.length > 0) {
			const ticketsForEvent = user.userAllTickets.filter(
				(ticket) =>
					ticket.eventId && ticket.eventId.toString() === eventId.toString()
			);
			ticketAmount = ticketsForEvent.reduce(
				(sum, ticket) =>
					sum + (ticket.ticketPrice || 0) * (ticket.ticketCount || 0),
				0
			);
		}

		// Calculate total amount (event amount + ticket amount)
		const totalAmount = event.totalAmount + ticketAmount;

		const options = {
			amount: totalAmount * 100, // Amount in paise
			currency: "INR",
			receipt: Math.random(Date.now()).toString(),
		};

		try {
			// Initiate the payment using Razorpay
			const paymentResponse = await instance.orders.create(options);
			res.json({
				success: true,
				data: paymentResponse,
			});
		} catch (error) {
			console.log(error);
			res
				.status(500)
				.json({ success: false, message: "Could not initiate order." });
		}
	} catch (error) {
		console.log("Error in payment capture :->", error);
		return res.status(500).json({
			message: "Error while creating payment",
		});
	}
};

exports.verifyPayment = async (req, res) => {
	try {
		const razorpay_order_id = req.body?.razorpay_order_id;
		const razorpay_payment_id = req.body?.razorpay_payment_id;
		const razorpay_signature = req.body?.razorpay_signature;
		const eventId = req.body?.eventId;
		const { amount, productType = "Event" } = req.body;
		const { userId } = req.user;

		// console.log(amount);
		// console.log(typeof amount);

		if (
			!razorpay_order_id ||
			!razorpay_payment_id ||
			!razorpay_signature ||
			!eventId ||
			!userId ||
			!amount
		) {
			return res.status(400).json({
				message: "All fields are required",
			});
		}

		let body = razorpay_order_id + "|" + razorpay_payment_id;

		const expectedSignature = crypto
			.createHmac("sha256", process.env.RAZORPAY_SECRET)
			.update(body.toString())
			.digest("hex");

		if (expectedSignature === razorpay_signature) {
			// Handle errors from enrollUser and avoid sending multiple responses
			try {
				await enrollUser(eventId, userId);
			} catch (err) {
				const status = err.statusCode || 500;
				return res.status(status).json({ message: err.message });
			}

			// ✅ Convert paise to rupees (assumes amount is in paise)
			const rupeeAmount = amount / 100;

			const invoice = await Invoice.create({
				order_id: razorpay_order_id,
				payment_id: razorpay_payment_id,
				user_id: userId,
				product_type: productType,
				product_id: eventId,
				amount: rupeeAmount.toFixed(2), // Store amount as a string with 2 decimal places
			});
			await invoice.save();

			return res.status(200).json({
				message: "Event joined successfully",
				invoice,
			});
		}

		return res.status(500).json({
			message: "Couldn't join event",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Error while verifying payment",
		});
	}
};

exports.sendPaymentSuccessEmail = async (req, res) => {
	try {
		const { eventId, orderId, paymentId, amount } = req.body;

		const { userId } = req.user;

		if (!orderId || !paymentId || !amount || !userId || !eventId) {
			return res
				.status(400)
				.json({ success: false, message: "Please provide all the details" });
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		const event = await Event.findById(eventId);
		if (!event) {
			return res.status(404).json({
				message: "Event not found",
			});
		}

		await sendPaymentSuccessfulEmail(
			user.email,
			event,
			orderId,
			paymentId,
			amount
		);

		return res.status(200).json({
			message: "Mail sent successfully",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Error while sending success email",
		});
	}
};

const enrollUser = async (eventId, userId) => {
	try {
		// Find the event based on eventId
		const event = await Event.findById(eventId).populate("approved");
		// console.log("enrollUser debug", event);

		if (!event) {
			return {
				success: false,
				statusCode: 404,
				message: "Event not found",
			};
		}

		// If event is private, check approval
		if (event.visibility === "private") {
			const approved = await Approved.findOne({
				userId: userId,
				eventId: eventId,
			});
			// console.log("enrollUser start", approved);

			if (!approved) {
				return {
					success: false,
					statusCode: 403,
					message: "You have to be accepted for the event first",
				};
			}

			// Update approval status to paid using findByIdAndUpdate
			await Approved.findByIdAndUpdate(approved._id, {
				$set: { status: "paid" },
			});
		}

		// Create a joined record
		const joined = await Joined.create({
			userId: userId,
			eventId: eventId,
		});

		// Add joined user to event
		const enrolledEvent = await Event.findOneAndUpdate(
			{ _id: eventId },
			{ $push: { attendees: joined._id } },
			{ new: true }
		);

		if (!enrolledEvent) {
			return {
				success: false,
				statusCode: 500,
				message: "Event not found",
			};
		}

		// Add joined event to user's profile
		const enrolledUser = await User.findByIdAndUpdate(
			userId,
			{
				$push: {
					joined: joined._id,
				},
			},
			{ new: true }
		);

		if (!enrolledUser) {
			return {
				success: false,
				statusCode: 500,
				message: "User not found",
			};
		}

		// If everything is fine, return success
		return { success: true };
	} catch (error) {
		return {
			success: false,
			statusCode: 500,
			message: error.message || "Error while enrolling",
		};
	}
};
