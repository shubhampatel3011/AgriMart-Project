const bcrypt = require("bcryptjs");
const Farmer = require("../Models/farmerTbl");

// REGISTER FARMER
exports.registerFarmer = async (req, res) => {
  try {
    console.log("Register API hit");
    console.log("Request body:", req.body);
    console.log("Files:", req.files);

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_ROUNDS) || 10);

    const farmerData = {
      farmerName: req.body.farmerName,
      email: req.body.email,
      contactNo: parseInt(req.body.contactNo),
      password: hashedPassword,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      isVerified: req.body.isVerified || false,
    };

    // Add file paths if uploaded
    if (req.files?.farmPhoto) {
      farmerData.farmPhoto = req.files.farmPhoto[0].path;
    }
    if (req.files?.addressProof) {
      farmerData.addressProof = req.files.addressProof[0].path;
    }
    if (req.files?.adharCard) {
      farmerData.adharCard = req.files.adharCard[0].path;
    }

    const farmer = new Farmer(farmerData);
    await farmer.save();

    res.status(201).json({
      success: true,
      data: farmer,
    });
  } catch (error) {
    console.error("Register error:", error);

    if(error.code===11000){
      return res.status(400).json({
        success:false,
        message: "Email already registered. Please login or use another email."
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN FARMER
exports.loginFarmer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const farmer = await Farmer.findOne({ email });

    if (!farmer) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Check farmer status
    if (farmer.status === "Rejected") {
      return res.status(403).json({
        error: "Your account has been rejected by the admin",
      });
    }

    if (farmer.status === "Pending") {
      return res.status(403).json({
        error: "Your account is waiting for admin approval",
      });
    }

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, farmer.password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    res.status(200).json({
      message: "Login successful",
      data: farmer,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// CREATE FARMER
exports.createFarmer = async (req, res) => {
  try {
    const result = await Farmer.create(req.body);

    res.status(200).json({
      message: "Farmer created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE FARMER STATUS
const updateFarmerStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { status }, // must update this field
      { new: true },
    );

    res.json({ success: true, farmer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE FARMER
exports.updateFarmer = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Extract updateable fields
    const updateData = {};
    const allowedFields = ['farmerName', 'email', 'contactNo', 'address', 'city', 'state'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    // Also allow status update if provided
    if (req.body.status !== undefined) {
      updateData.status = req.body.status;
    }

    const farmer = await Farmer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!farmer) {
      return res.status(404).json({
        message: "Farmer not found",
      });
    }

    res.status(200).json({
      message: "Farmer updated successfully",
      data: farmer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE FARMER
exports.deleteFarmer = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Farmer.findByIdAndDelete(id);

    res.status(200).json({
      message: "Farmer deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET FARMER BY ID
exports.getFarmerById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Farmer.findById(id)
      .populate("userId")
      .populate("cityId")
      .populate("areaId");

    res.status(200).json({
      message: "Farmer fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL FARMERS
exports.getAllFarmers = async (req, res) => {
  try {
    const result = await Farmer.find();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get farmers error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};