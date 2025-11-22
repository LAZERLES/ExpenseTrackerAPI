const User = require("../Models/User.js");
const Wallet = require("../Models/Wallet.js");
const bcrypt = require("bcrypt");
const sequelize = require("../Data/DB.js");

const createUser = async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
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
        { transaction: t }
      );

      await Wallet.create({ user_id: newUser.id }, { transaction: t });

      return res
        .status(201)
        .json({ message: "User created successfully.",  });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // user can login with email or username
    if (!password || (!email && !username)) {
      return res
        .status(400)
        .json({ message: "Email/Username and password are required." });
    }

    // user can login with either email or username
    const identifier = email ? { email } : { username };

    // Check if user exists
    const userData = await User.findOne({ where: identifier });
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, userData.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: userData.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      maxAge: 3600000, // 1 hour
    });

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
      .json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = { createUser, loginUser };
