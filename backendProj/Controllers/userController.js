  const User = require("../Models/userTbl");
  const jwt = require("jsonwebtoken");
  const bcrypt = require("bcryptjs");

  // LOGIN USER
  exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required",
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          error: "Invalid email or password",
        });
      }

      // Simple password check (in production, use bcrypt)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          error: "Invalid email or password",
        });
      }

      const token = jwt.sign({
        id: user._id,
        email: user.email,
        usertype: user.usertype,
      },
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRES }
    );

      res.status(200).json({
        message: "Login successful",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  // REGISTER USER
  exports.registerUser = async (req, res) => {
    try {
      const { Name, username, email, mobile, password } = req.body;

      console.log("Registration data received:", {
        Name: Name ? `${Name.substring(0, 2)}...` : "missing",
        username: username ? `${username.substring(0, 2)}...` : "missing",
        email: email ? `${email.substring(0, 2)}...` : "missing",
        mobile: mobile ? `${mobile.substring(0, 2)}...` : "missing",
        password: password ? "***" : "missing"
      });

      if (!Name || !username || !email || !mobile || !password) {
        return res.status(400).json({
          error: "All fields are required",
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          error: "Email already registered",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Clean mobile number - store only digits
      const cleanMobile = mobile.replace(/[\s\-()]/g, '');
      console.log("Cleaned mobile:", cleanMobile);

      const result = await User.create({
        Name,
        username,
        email,
        mobile: cleanMobile,
        password: hashedPassword,
      });

      res.status(201).json({
        message: "Registration successful",
        data: result,
      });
    }
    catch (error) {
      console.error("Register error:", error.message);
      console.error("Error details:", error);

      // Handle duplicate key error
      if (error.code === 11000){
        return res.status(400).json({
          success: false,
          message: "Email already registered. Please login or use another email."
        });
      }

      // Handle validation errors
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        console.error("Validation errors:", messages);
        return res.status(400).json({
          success: false,
          message: messages.map(m => `${m.field}: ${m.message}`).join(", "),
          errors: messages
        });
      }

      res.status(500).json({
        error: error.message,
      });
    }
  };

  // CREATE USER
  exports.createUser = async (req, res) => {
    try {
      const result = await User.create(req.body);

      res.status(200).json({
        message: "User created successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  // UPDATE USER
  exports.updateUser = async (req, res) => {
    try {
      const id = req.params.id;

      const result = await User.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        message: "User updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  // DELETE USER
  exports.deleteUser = async (req, res) => {
    try {
      const id = req.params.id;

      const result = await User.findByIdAndDelete(id);

      res.status(200).json({
        message: "User deleted successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  // GET USER BY ID
  exports.getUserById = async (req, res) => {
    try {
      const id = req.params.id;

      const result = await User.findById(id);

      res.status(200).json({
        message: "User fetched successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  // GET ALL USERS
  exports.getAllUsers = async (req, res) => {
    try {
      const result = await User.find();

      res.status(200).json({
        message: "Users fetched successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };
