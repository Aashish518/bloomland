const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  poster: { type: String /* required: true */ },
  images: [
    {
      filename: String,
      contentType: String,
      data: Buffer,
    },
  ],
  category: { type: String /* required: true */ },
  start_date: { type: Date /* required: true */ },
  end_date: { type: Date },
  price: { type: Number },
  tickets: [
    {
      ticketName: { type: String },
      ticketPrice: { type: Number },
      ticketCount: { type: Number },
    },
  ],
  subtitle: { type: String },
  location: {
    city: { type: String /* required: true */ },
    state: { type: String /* required: true */ },
    country: { type: String /* required: true */ },
  },
  address: {
    venue: { type: String },
    landmark: { type: String },
    area: { type: String },
  },
  includes: [
    {
      id: { type: Number },
      heading: { type: String },
      value: { type: String },
    },
  ],
  itinerary: [
    {
      id: { type: Number },
      date: { type: Date },
      title: { type: String },
      activities: [
        {
          id: { type: Number },
          time: { type: String },
          description: { type: String },
          location: { type: String },
        },
      ],
    },
  ],
  duration: { type: String },
  sponsors: [
    { id: { type: Number }, 
      name: { type: String }, 
      logo: { type: String } 
    },
  ],
  scheduled: { type: Boolean, default: false },
  scheduledFor: { type: Date },
  visibility: { type: String },
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Request" }],
  approved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Approved" }],
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Joined" }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  commission: { type: Number, default: 0 }, // Commission percentage
  commissionAmount: { type: Number, default: 0 }, // Calculated commission amount
  gstAmount: { type: Number, default: 0 }, // GST amount (18% on commission)
  totalAmount: { type: Number, default: 0 }, // Total amount (price + commission + GST)
  eventTickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "EventTicket" }],
},
{ timestamps: true }
);

// Pre-save middleware to set tickets to empty array for day0 events
eventSchema.pre("save", function (next) {
  if (this.category === "day0") {
    this.tickets = [];
  }
  next();
});

// Pre-update middleware to set tickets to empty array for day0 events
eventSchema.pre(
  ["findOneAndUpdate", "updateOne", "updateMany"],
  function (next) {
    const update = this.getUpdate();

    // console.log("Update object:", update);

    if (
      update.category === "day0" ||
      (update.$set && update.$set.category === "day0")
    ) {
      if (update.$set) {
        update.$set.tickets = [];
      } else {
        update.tickets = [];
      }
    }
    next();
  }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
