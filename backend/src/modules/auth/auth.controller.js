const bcrypt = require("bcrypt");
const User = require("./user.model");
const jwt= require("jsonwebtoken");

/**
 * Registers a new user by hashing the password and storing the user in DB.
 */

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "User registered successfully"
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Logs in a user by validating credentials and issuing a JWT.
 * We return a generic error message for invalid credentials
 * to avoid leaking sensitive authentication details.
 */
async function login(req, res) {
      try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare provided password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT (payload kept minimal intentionally)
        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return res.status(200).json({ token });
      } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    module.exports = {
      register,
      login
    };