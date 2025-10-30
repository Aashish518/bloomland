const express = require("express");
const router = express.Router();

const {
  getRequestData,
  userDistribution,
  getMoneyData,
} = require("../controllers/analysis");
const { isAdmin } = require("../middlewares/isAdmin");

router.get("/getRequest", isAdmin, getRequestData);
router.get("/userDistribution", isAdmin, userDistribution);
router.get("/getMoneyData", isAdmin, getMoneyData);

module.exports = router;
