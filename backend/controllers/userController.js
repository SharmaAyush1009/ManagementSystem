const getUser = (req, res) => {
    res.json({ message: "User fetched successfully" });
};

const registerUser = (req, res) => {
    res.json({ message: "User registered successfully" });
};

module.exports = { getUser, registerUser };
