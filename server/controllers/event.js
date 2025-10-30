const fs = require("fs");
const path = require("path");
const BASE_PATH = process.env.BACKEND_URL;
const Event = require("../models/event");
const EventTicket = require("../models/eventtickets");
const mongoose = require("mongoose");

exports.addEvent = async (req, res) => {
  try {
		const {
			title,
			description,
			startDate,
			endDate,
			location,
			address,
			type,
			visibility,
			scheduledFor,
			inclusions,
			price,
			subtitle,
			duration,
			itinerary,
			sponsors,
			commission,
			eventTicket, // This is expected to be a JSON string array from the frontend
		} = req.body;

	
		// console.log("Received request body --> ", req.files);
    // console.log("Received request sponsor list length --> ", req.files.sponsorLogo,typeof req.files.sponsorLogo,req.files.sponsorLogo.length);

		// return res.status(200).json({
		// 	message: "Request received",
		// });

		// Ensure images is an array (some file upload libs may send single file as an object)
		let images = [];
		if (req.files && req.files.images) {
			images = Array.isArray(req.files.images)
				? req.files.images
				: [req.files.images];
		}

		// Transform uploaded files into MongoDB-compatible format
		const imageDocs = images.map((image) => ({
			filename: image.name,
			contentType: image.mimetype,
			data: image.data,
		}));

		if (!title || !description) {
			return res
				.status(400)
				.json({ message: "Title and description are required" });
		}

		// Helper function to calculate commission and GST and total amount with tickets
		function calculateGST(price, commissionRate = 0, gstRate = 18) {
			const commissionAmount = (price * commissionRate) / 100;
			const gstAmount = (commissionAmount * gstRate) / 100;
			return {
				commissionAmount,
				gstAmount,
				totalAmount: price + commissionAmount + gstAmount,
			};
		}

		// Calculate GST and commission
		const { commissionAmount, gstAmount, totalAmount } = calculateGST(
			parseInt(price),
			commission,
			18
		);

		let imageUrls = [];
		if (req.files && req.files.images) {
			let images = [];
			if (!Array.isArray(req.files.images)) {
				images.push(req.files.images);
			} else {
				images = req.files.images;
			}

			imageUrls = await Promise.all(
				images.map(async (image) => {
					const safeName = image.name.replace(/[^a-z0-9.\-_]/gi, "_"); // sanitize name
					const filename = Date.now() + "-" + safeName;
					const filePath = path.join(__dirname, "..", "uploads", filename);
					await image.mv(filePath);
					return `${BASE_PATH}/uploads/${filename}`;
				})
			);
		}

		let poster = null;
		if (req.files && req.files.poster) {
			const imageName = req.files.poster.name.replace(/[^a-z0-9.\-_]/gi, "_");
			const filename = `${Date.now()}-${imageName}`;
			const filePath = path.join(__dirname, "..", "uploads", filename);
			await req.files.poster.mv(filePath);
			poster = `${BASE_PATH}/uploads/${filename}`;
		}

		let processedSponsors = [];
		if (sponsors) {
			const sponsorData = JSON.parse(sponsors);

			// Process each sponsor and handle their logo uploads
			processedSponsors = await Promise.all(
				sponsorData.map(async (sponsor, index) => {
					const logoFieldName = `sponsorLogo_${sponsor.id || index}`;
					let logoUrl = null;

					// Check if there's a logo file for this sponsor
					if (req.files && req.files[logoFieldName]) {
						const logoFile = req.files[logoFieldName];
						const safeName = logoFile.name.replace(/[^a-z0-9.\-_]/gi, "_");
						const filename = `sponsor_${Date.now()}_${index}_${safeName}`;
						const filePath = path.join(
							__dirname,
							"..",
							"uploads",
							"sponsors",
							filename
						);

						// Create sponsors directory if it doesn't exist
						const sponsorDir = path.join(
							__dirname,
							"..",
							"uploads",
							"sponsors"
						);
						if (!fs.existsSync(sponsorDir)) {
							fs.mkdirSync(sponsorDir, { recursive: true });
						}

						await logoFile.mv(filePath);
						logoUrl = `${BASE_PATH}/uploads/sponsors/${filename}`;
					}

					return {
						id: sponsor.id,
						name: sponsor.name,
						logo: logoUrl,
					};
				})
			);
		}

		// Create the event first (without eventTickets)
		const newEvent = await Event.create({
			title: title,
			description: description,
			start_date: startDate,
			end_date: endDate ? endDate : null,
			location: JSON.parse(location),
			address:
				address && typeof address === "string" ? JSON.parse(address) : null,
			category: type,
			schedduledFor: scheduledFor ? scheduledFor : null,
			scheuled: scheduledFor ? true : false,
			visibility: visibility,
			includes: itinerary ? JSON.parse(inclusions) : null,
			price: price,
			images: imageUrls,
			poster: poster,
			subtitle: subtitle,
			duration: duration,
			itinerary: itinerary ? JSON.parse(itinerary) : null,
			sponsors: processedSponsors,
			commission: commission,
			commissionAmount: commissionAmount,
			gstAmount: gstAmount,
			totalAmount: totalAmount,
			images: imageDocs,
			// tickets : eventTicket ? JSON.parse(eventTicket) : null

			// Do not set eventTickets yet
		});
		await newEvent.save();

		// Store eventTicket array to EventTicket model, each with eventId reference
		let eventTicketToArray = JSON.parse(eventTicket);

		if (eventTicketToArray && Array.isArray(eventTicketToArray)) {
			// Create a single EventTicket document for this event
			const ticketDoc = await EventTicket.create({
				eventId: newEvent._id,
				eventType: newEvent.category,
				tickets: eventTicketToArray.map((ticket) => ({
					ticketName: ticket.ticketName,
					ticketPrice: ticket.ticketPrice,
					ticketId: new mongoose.Types.ObjectId(), // Ensure unique ticketId for each ticket
				})),
			});

			// Update event with eventTickets ID
			newEvent.eventTickets = ticketDoc._id;
			await newEvent.save();
		}

		return res.status(201).json({
			message: "Event added successfully",
			event: newEvent,
		});
	} catch (error) {
    console.error("Error adding event:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while adding event" });
  }
};

exports.publishEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(400).json({
        message: "Event not found",
      });
    }

    event.visibility = "public";
    await event.save();

    return res.status(200).json({
      message: "Event published successfully",
    });
  } catch (error) {
    console.error("Error publishing event:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while publishing event" });
  }
};

exports.unpublishEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(400).json({
        message: "Event not found",
      });
    }

    event.visibility = "private";
    await event.save();

    return res.status(200).json({
      message: "Event unpublished successfully",
    });
  } catch (error) {
    console.error("Error unpublishing event:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while unpublishing event" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params; // Get the event ID from the URL
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      address,
      type,
      visibility = "private",
      scheduledFor,
      inclusions,
      price,
      duration,
      subtitle,
      itinerary,
      sponsors,
    } = req.body;
    // Ensure eventId exists in the database
    // console.log(id);

    let imageUrls = [];
    if (req.files && req.files.newImages) {
      let images = [];
      if (!Array.isArray(req.files.newImages)) {
        images.push(req.files.newImages);
      } else {
        images = req.files.newImages;
      }

      imageUrls = await Promise.all(
        images.map(async (image) => {
          const safeName = image.name.replace(/[^a-z0-9.\-_]/gi, "_"); // sanitize name
          const filename = Date.now() + "-" + safeName;
          const filePath = path.join(__dirname, "..", "uploads", filename);
          await image.mv(filePath);
          return `${BASE_PATH}/uploads/${filename}`;
        })
      );
    }
    if (req.body.images) {
      if (Array.isArray(req.body.images)) {
        imageUrls = [...imageUrls, ...req.body.images];
      } else {
        const temp = [req.body.images];
        imageUrls = [...imageUrls, ...temp];
      }
    }
    let poster = null;
    if (req.files && req.files.poster) {
      const safeName = req.files.poster.name.replace(/[^a-z0-9.\-_]/gi, "_"); // sanitize name
      const filename = Date.now() + "-" + safeName;
      const filePath = path.join(__dirname, "..", "uploads", filename);
      await req.files.poster.mv(filePath);
      poster = `${BASE_PATH}/uploads/${filename}`;
    }

    let processedSponsors = [];
    if (sponsors) {
      const sponsorData = JSON.parse(sponsors);

      // Process each sponsor and handle their logo uploads
      processedSponsors = await Promise.all(
        sponsorData.map(async (sponsor, index) => {
          const logoFieldName = `sponsor_logo_${sponsor.id}`;
          let logoUrl = null;

          // Check if there's a new logo file for this sponsor
          if (req.files && req.files[logoFieldName]) {
            const logoFile = req.files[logoFieldName];
            const safeName = logoFile.name.replace(/[^a-z0-9.\-_]/gi, "_");
            const filename = `sponsor_${Date.now()}_${sponsor.id}_${safeName}`;
            const filePath = path.join(
              __dirname,
              "..",
              "uploads",
              "sponsors",
              filename
            );

            // Create sponsors directory if it doesn't exist
            const sponsorDir = path.join(
              __dirname,
              "..",
              "uploads",
              "sponsors"
            );
            if (!fs.existsSync(sponsorDir)) {
              fs.mkdirSync(sponsorDir, { recursive: true });
            }

            // If sponsor has existing logo, optionally delete old file
            if (sponsor.existingLogo && sponsor.logoChanged) {
              try {
                // Extract filename from existing URL
                const existingLogoPath = sponsor.existingLogo.replace(
                  BASE_PATH,
                  ""
                );
                const fullExistingPath = path.join(
                  __dirname,
                  "..",
                  existingLogoPath
                );

                // Delete old logo file if it exists
                if (fs.existsSync(fullExistingPath)) {
                  fs.unlinkSync(fullExistingPath);
                  console.log(`Deleted old sponsor logo: ${fullExistingPath}`);
                }
              } catch (error) {
                console.warn(
                  `Could not delete old sponsor logo: ${error.message}`
                );
                // Don't throw error, just log warning and continue
              }
            }

            // Save new logo file
            await logoFile.mv(filePath);
            logoUrl = `${BASE_PATH}/uploads/sponsors/${filename}`;

            console.log(`Saved new sponsor logo: ${logoUrl}`);
          } else if (sponsor.logo && !sponsor.logoChanged) {
            // Keep existing logo URL if no new file uploaded and not marked as changed
            logoUrl = sponsor.logo;
          }
          // If logoChanged is true but no file provided, logoUrl remains null (logo removed)

          return {
            id: sponsor.id,
            name: sponsor.name,
            logo: logoUrl,
          };
        })
      );
    }

    // imageUrls = [...imageUrls, ...req.body.images];
    // console.log("urls", imageUrls);

    const updateData = {
      title: title,
      description: description,
      start_date: startDate,
      end_date: endDate ? endDate : null,
      location: JSON.parse(location),
      address: address ? JSON.parse(address) : null,
      category: type,
      scheduledFor: scheduledFor ? scheduledFor : null,
      scheduled: scheduledFor ? true : false,
      visibility: visibility,
      includes: inclusions ? JSON.parse(inclusions) : null,
      price: price,
      images: imageUrls,
      duration: duration,
      subtitle: subtitle,
      itinerary: itinerary ? JSON.parse(itinerary) : null,
    };

    if (sponsors) {
      updateData.sponsors = processedSponsors;
    }

    if (poster !== null) {
      updateData.poster = poster;
    }

    const event = await Event.findByIdAndUpdate(eventId, updateData, {
      new: true,
    });

    if (!event) {
      return res.status(400).json({ message: "Event not found" });
    }

    return res.status(200).json({
      message: "Event added successfully",
      event: event,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while updating event" });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    return res.status(200).json({ events: events });
  } catch (error) {
    console.error("Error getting all events:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while getting all events" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(400).json({ message: "Event not found" });
    }

    await event.deleteOne();
    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while deleting event" });
  }
};

exports.getSingleEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }
    const event = await Event.findById(eventId)
      .populate({
        path: "eventTickets",
        model: "EventTicket",
      })
      .populate({
        path: "requests",
        populate: [
          { path: "userId", model: "User" },
          { path: "eventId", model: "Event" },
        ],
      })
      .populate({
        path: "approved",
        populate: [
          { path: "userId", model: "User" },
          { path: "eventId", model: "Event" },
        ],
      })
      .populate({
        path: "attendees",
        populate: [
          { path: "userId", model: "User" },
          { path: "eventId", model: "Event" },
        ],
      });
    if (!event) {
      return res.status(400).json({ message: "Event not found" });
    }

    return res.status(200).json({ event: event });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while getting single event" });
  }
};

// Example: Get eventTickets data for a single event
exports.getEventTicketsForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }
    const event = await Event.findById(eventId).populate({
      path: "eventTickets",
      model: "EventTicket",
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json({
      eventTickets: event.eventTickets,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching event tickets" });
  }
};

exports.fetchEventData = async (req, res) => {
  try {
    // const events = await Event.find({ visibility: "public" });
    const events = await Event.find();
    const data = [];

    events.map((event) => {
      const eventData = {
        title: event.title,
        description: event.description,
        price: event.price,
        requests: event.requests.length,
        attendees: event.attendees.length,
        start_date: event.start_date,
        end_data: event.end_date,
        location: event.location,
        address: event.address ? event.address : null,
        included: event.includes,
        category: event.category,
        images: event.images,
        poster: event.poster,
        duration: event.duration,
        subtitle: event.subtitle,
        itinerary: event.itinerary,
        sponsors: event.sponsors,
        visibility: event.visibility,
        _id: event._id,
      };
      data.push(eventData);
    });

    return res.status(200).json({
      message: "Events fetched successfully",
      events: events,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error occured" });
  }
};
