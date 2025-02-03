const router = require("express").Router({ mergeParams: true });
const userRoutes = require("./userRoutes.js");
const customersRoutes = require("./customerRoutes.js");
const stationRoutes = require("./stationRoutes.js");
const packageRoutes = require("./packageRoutes.js");
const transactionRoutes = require("./transactionRoutes.js");
const homeRoutes = require("./homeRoutes.js");
const authRoutes = require("./authRoutes.js");

// grouping routes
router.get("/", homeRoutes);
router.use("/users", userRoutes);
router.use("/customers", customersRoutes);
router.use("/stations", stationRoutes);
router.use("/packages", packageRoutes);
router.use("/transactions", transactionRoutes);
router.use("/auth", authRoutes);

module.exports = router;
