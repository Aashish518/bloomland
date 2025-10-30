const mongoose = require("mongoose");

const eventTicketSchema = new mongoose.Schema({
	eventId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Event",
		required: true,
	},
	eventType: { type: String, enum: ["day0", "10x", "100x"] },
	tickets: [
		{
			ticketId: {
				type: mongoose.Schema.Types.ObjectId,
				default: () => new mongoose.Types.ObjectId(),
				unique: true,
				index: true,
			},
			ticketName: { type: String },
			ticketPrice: { type: Number },
		},
	],
});

const EventTicket = mongoose.model("EventTicket", eventTicketSchema);
module.exports = EventTicket;
