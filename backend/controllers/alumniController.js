const Alumni = require("../models/Alumni");

const getAllAlumni = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1; // Default to page 1
    limit = parseInt(limit) || 10; // Default to 10 results per page

    const skip = (page - 1) * limit;

    const alumni = await Alumni.find().skip(skip).limit(limit);
    const totalAlumni = await Alumni.countDocuments();

    res.json({
      page,
      limit,
      totalPages: Math.ceil(totalAlumni / limit),
      totalAlumni,
      data: alumni,
    });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { getAllAlumni };
