const User = require("../Models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

      // validation
      if (!email || !username || !password) {
        return res.status(400).json({ message: "All fields are required." });
      }

      // check if user exists
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.status(409).json({ message: "User already exists." });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create user
      const newUser = await User.create(
        { email, username, password: hashedPassword },
      );

      return res
        .status(201)
        .json({ message: "User created successfully.", userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // user can login with email or username
    if (!password || (!identifier)) {
      return res
        .status(400)
        .json({ message: "Email/Username and password are required." });
    }

    let query = {};

    // Check if email or username is provided
    if (identifier.includes("@")) {
      query.email = identifier; // login via email
    } else {
      query.username = identifier; // login via username
    }

    // Check if user exists
    const userData = await User.findOne({ where: query });
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, userData.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: userData.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", deatils: error.message });
  }
};

// Get current user (verify token)
const getMe = async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'created_at']
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
}

module.exports = { createUser, loginUser, getMe, logoutUser };
