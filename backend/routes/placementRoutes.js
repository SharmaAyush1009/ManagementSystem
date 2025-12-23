const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");
const Placement = require("../models/Placement");

const router = express.Router();

//  Admin Adds Placement Data
router.post("/add", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, batch, branch, company, package: packageValue, cpi, gender } = req.body;

    if (!name || !batch || !branch || !company || !packageValue || !cpi || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPlacement = new Placement({ 
      name, 
      batch, 
      branch, 
      company, 
      package: packageValue, 
      cpi,
      gender
    });
    
    await newPlacement.save();

    res.status(201).json({ message: "Placement record added successfully", placement: newPlacement });
  } catch (error) {
    console.error("Error adding placement:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get All Placement Data (For Students to View)
router.get("/", async (req, res) => {
  try {
    const placements = await Placement.find({}).select("name branch batch company package");
    res.json(placements);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete Placement Record (Admin Only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);
    
    if (!placement) {
      return res.status(404).json({ message: "Placement record not found" });
    }
    
    await Placement.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Placement record deleted successfully" });
  } catch (error) {
    console.error("Error deleting placement:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
//  Update Placement Record (Admin Only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { name, batch, branch, company, package: packageValue, cpi, gender } = req.body;
  
      if (!name || !batch || !branch || !company || !packageValue || !cpi || !gender) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      const placement = await Placement.findById(req.params.id);
      
      if (!placement) {
        return res.status(404).json({ message: "Placement record not found" });
      }
      
      const updatedPlacement = await Placement.findByIdAndUpdate(
        req.params.id,
        { name, batch, branch, company, package: packageValue, cpi, gender },
        { new: true }
      );
      
      res.json({ 
        message: "Placement record updated successfully", 
        placement: updatedPlacement 
      });
    } catch (error) {
      console.error("Error updating placement:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
module.exports = router;