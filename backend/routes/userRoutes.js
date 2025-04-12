const express = require("express");
const router = express.Router();
const { getUser, registerUser } = require("../controllers/userController");
const User = require("../models/User");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

router.get("/user", getUser);
router.post("/register", registerUser);

// Student requests profile update (awaiting admin approval)
router.post("/update-profile", authMiddleware, async (req, res) => {
    try {
        const { updates } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.role !== "student") return res.status(403).json({ message: "Only students can request updates" });
        
        // Check if user already has a pending update
        if (user.pendingUpdate) {
            return res.status(400).json({ message: "You already have a pending update request. Please wait for admin approval." });
        }
        
        // Check if profile is already approved and user is trying to submit the same data
        if (user.profile && user.profile.status === "Approved" && 
            JSON.stringify(updates) === JSON.stringify(user.profile)) {
            return res.status(400).json({ message: "Your profile is already approved with this information." });
        }

        // Store update request
        user.pendingUpdate = {
            ...updates,
            submittedAt: new Date() // Add timestamp
        };
        await user.save();

        res.json({ message: "Profile update requested. Awaiting admin approval." });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Server error", error: error.toString() });
    }
});

// Admin approves or rejects profile update
router.post("/approve-profile", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { email, action } = req.body; // `action` can be "approve" or "reject"

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.pendingUpdate) return res.status(400).json({ message: "No pending update found" });

        if (action === "approve") {
            // Create or update the profile field
            user.profile = {
                ...user.pendingUpdate,
                status: "Approved",
                approvedAt: new Date() // Add timestamp
            };
            user.pendingUpdate = null; // Clear pending update
            await user.save();
            res.json({ message: "Profile update approved successfully" });
        } else if (action === "reject") {
            // If rejected, update status but keep data
            if (!user.profile) {
                user.profile = {
                    ...user.pendingUpdate,
                    status: "Rejected",
                    rejectedAt: new Date() // Add timestamp
                };
            } else {
                // Keep existing profile but mark latest update as rejected
                user.profile.status = "Rejected";
                user.profile.rejectedAt = new Date();
            }
            user.pendingUpdate = null; // Clear pending update
            await user.save();
            res.json({ message: "Profile update rejected" });
        } else {
            return res.status(400).json({ message: "Invalid action. Use 'approve' or 'reject'" });
        }
    } catch (error) {
        console.error("Approve profile error:", error);
        res.status(500).json({ message: "Server error", error: error.toString() });
    }
});

// Get all pending profile update requests (for admin)
router.get("/pending-requests", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        // Find all users with pending updates
        const usersWithPendingUpdates = await User.find({ 
            pendingUpdate: { $ne: null } 
        }).select('email username pendingUpdate');
        
        // Format the response data
        const pendingRequests = usersWithPendingUpdates.map(user => ({
            id: user._id,
            email: user.email,
            name: user.username,
            branch: user.pendingUpdate?.department || "N/A",
            cgpa: user.pendingUpdate?.cpi || "N/A",
            rollNo: user.pendingUpdate?.rollNo || "N/A",
            gender: user.pendingUpdate?.gender || "N/A",
            submittedAt: user.pendingUpdate?.submittedAt || new Date()
        }));
        
        res.json(pendingRequests);
    } catch (error) {
        console.error("Error fetching pending requests:", error);
        res.status(500).json({ message: "Server error", error: error.toString() });
    }
});

// Get user profile status
router.get("/profile-status", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) return res.status(404).json({ message: "User not found" });
        
        // Check if user has a pending update
        if (user.pendingUpdate) {
            res.json({ 
                status: "Pending Approval",
                profile: user.pendingUpdate,
                hasPendingRequest: true
            });
        } 
        // Check if user has a profile
        else if (user.profile) {
            res.json({ 
                status: user.profile.status || "Approved",
                profile: user.profile,
                hasPendingRequest: false
            });
        } else {
            res.json({ 
                status: null,
                profile: null,
                hasPendingRequest: false
            });
        }
    } catch (error) {
        console.error("Profile status error:", error);
        res.status(500).json({ message: "Server error", error: error.toString() });
    }
});

// New endpoint - Get only APPROVED students for student view
router.get("/get-approved-students", authMiddleware, async (req, res) => {
    try {
        const students = await User.find({ 
            role: "student", 
            isVerified: true,
            "profile.status": "Approved"  // Only get students with approved profiles
        }).select("_id email profile");
        
        res.json({ students });
    } catch (error) {
        console.error("Error fetching approved students:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Fetch all students with approved profiles (for admin only)
router.get("/approved", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const students = await User.find({ 
            role: "student", 
            "profile.status": "Approved" 
        }).select("-password");
        
        res.json(students);
    } catch (error) {
        console.error("Error fetching approved students:", error);
        res.status(500).json({ message: "Failed to fetch students", error: error.toString() });
    }
});

// Update student profile (Admin Only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const student = await User.findByIdAndUpdate(
            id, 
            updates,
            { new: true }
        ).select("-password");
        
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        
        res.json({
            message: "Student profile updated successfully",
            student
        });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ message: "Failed to update student", error: error.toString() });
    }
});

// Delete student (Admin Only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const student = await User.findByIdAndDelete(id);
        
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: "Failed to delete student", error: error.toString() });
    }
});

module.exports = router;