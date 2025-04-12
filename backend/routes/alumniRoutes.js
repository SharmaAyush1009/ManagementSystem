const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");
const { getAllAlumni } = require("../controllers/alumniController");

const router = express.Router();

// Define a GET route to fetch alumni data
router.get("/", getAllAlumni);

// Protect admin dashboard
router.get("/admin-dashboard", authMiddleware, adminMiddleware, (req, res) => {
    res.json({ msg: "Welcome, Admin! You have access to this dashboard" });
});

module.exports = router;
