const User = require("../Models/User");

const getallUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
    const { id } = req.body;
    if(!req.user.isAdmin){
      return res.status(400).json({ message: "authorization required" });
    }
    else if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
  
    try {
      // Check if the user exists and delete
      const existingUser = await User.findByIdAndDelete(id);
      if (existingUser) {
        return res.status(200).json({ message: "User successfully deleted" });
      } else {
        return res.status(404).json({ message: "User does not exist" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

const createStudent = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  if (!name || !email || !password || typeof isAdmin !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }
  if(!req.user.isAdmin){
    return res.status(400).json({ message: "authorization required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password: password,
      isAdmin,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        isAdmin: savedUser.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
    const { id, name, email, isAdmin } = req.body;
    
    if(!req.user.isAdmin){
      return res.status(400).json({ message: "authorization required" });
    }
  
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
  
    let updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (typeof isAdmin === 'boolean') updateData.isAdmin = isAdmin;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
      if (updatedUser) {
        return res.status(200).json({ message: "User successfully updated", user: updatedUser });
      } else {
        return res.status(404).json({ message: "User does not exist" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

module.exports = { createStudent, getallUsers , deleteUser , updateUser};
