const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String /* required: true */ },
	googleId: { type: String, sparse: true },
	role: { type: String, enum: ["user", "admin"], default: "user" },
	name: { type: String },
	phone: { type: String },
	dob: { type: Date },
	journey: [{ type: String }],
	experience: [{ type: String }],
	reason: [{ type: String }],
	area: [{ type: String }],
	state: { type: String },
	bloom: [{ type: String }],
	ready: { type: String },
	insta: { type: String },
	linkedin: { type: String },
	notes: { type: String },
	requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Request" }],
	approved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Approved" }],
	allowed: { type: Boolean, default: false },
	detailsSubmitted: { type: Boolean, default: false },
	joined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Joined" }],
	isCommunity: { type: Boolean, default: false },
	tickets: [
		{
			ticketName: { type: String },
			ticketPrice: { type: Number },
			ticketCount: { type: Number },
		},
	],
	userAllTickets: [
		{
			ticketName: { type: String },
			ticketPrice: { type: Number },
			ticketCount: { type: Number },
			eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true, },
		},
	],
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	totalAmount: { type: Number, default: 0 }, // Combined event amount + Event ticket amount
});

const User = mongoose.model("User", userSchema);
module.exports = User;
