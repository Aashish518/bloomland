const Request = require("../models/request");
const Approved = require("../models/approved");
const Joined = require("../models/joined");
const Invoice = require("../models/invoice");

exports.getRequestData = async (req, res) => {
  try {
    const allRequests = await Request.find();

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const requestDataDay = {};
    const requestDataMonth = {};
    const requestDataYear = {};

    for (let req of allRequests) {
      const date = new Date(req.createdAt);

      // Group by day (Mon, Tue, etc.)
      const day = dayNames[date.getUTCDay()];
      requestDataDay[day] = (requestDataDay[day] || 0) + 1;

      // Group by month (Jan, Feb, etc.)
      const month = monthNames[date.getUTCMonth()];
      requestDataMonth[month] = (requestDataMonth[month] || 0) + 1;

      // Group by year (2022, 2023, etc.)
      const year = date.getUTCFullYear();
      requestDataYear[year] = (requestDataYear[year] || 0) + 1;
    }

    // Format into arrays
    const formattedDay = dayNames.map((day) => ({
      date: day,
      requests: requestDataDay[day] || 0,
    }));

    const formattedMonth = monthNames.map((month) => ({
      date: month,
      requests: requestDataMonth[month] || 0,
    }));

    const formattedYear = Object.keys(requestDataYear)
      .sort()
      .map((year) => ({
        date: year,
        requests: requestDataYear[year],
      }));

    res.status(200).json({
      requestDataDay: formattedDay,
      requestDataMonth: formattedMonth,
      requestDataYear: formattedYear,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.userDistribution = async (req, res) => {
  try {
    const requestsCount = await Request.countDocuments({ status: "pending" });
    const approvedCount = await Approved.countDocuments({ status: "pending" });
    const joinedCount = await Joined.countDocuments({ status: "pending" });
    const attendedCount = await Joined.countDocuments({ status: "entered" });

    const pieData = [
      { name: "Requests", value: requestsCount },
      { name: "Approved", value: approvedCount },
      { name: "Joined", value: joinedCount },
      { name: "Attended", value: attendedCount },
    ];

    res.status(200).json({
      pieData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in fetching user distribution",
    });
  }
};

exports.getMoneyData = async (req, res) => {
  try {
    const result = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $toInt: "$amount" } },
          count: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return {
        totalCollected: "₹0.00",
        averageOrderValue: "₹0.00",
        totalOrders: 0,
      };
    }

    const totalRupees = result[0].totalAmount / 100;
    const averageOrderValue = totalRupees / result[0].count;

    res.status(200).json({
      totalCollected:
        "₹" + totalRupees.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
      averageOrderValue:
        "₹" +
        averageOrderValue.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
      totalOrders: result[0].count,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while fetching money data",
    });
  }
};
