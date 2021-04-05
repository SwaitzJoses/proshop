import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

// description:  Auth user & get token
// route : POST/api/user/login
// access: Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // res.send({email, password})

  const user = await User.findOne({ email }); // email:email
  // console.log(user)
  // console.log(req)
  if (user && (await user.matchPassword(password))) {
    // why await


    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); // unauthorized
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // res.send({email, password})

  const userExists = await User.findOne({ email }); // email:email
  // console.log(user)
  // console.log(req)

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ //============================ data in  model  created  
    name,   // name:name
    email,
    password, // mongoose middleware to encrypt
  });
  console.log(`hi2 ${user._id}`); // -------------------------------------------------------------------
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    }); 
  } else {
    res.status(400);
    throw new Error("Invalid user");
  }
});

// description:  Get user profile
// route : Get/api/user/profile
// access: Private
const getUserProfile = asyncHandler(async (req, res) => {
  //   res.send("SUCCESS");

  console.log(`hi ${req.user._id}`); // because its already signed im (private)  
  const user = await User.findById(req.user._id);  // see -------------------------->  we put id here in controller instead of action
  // console.log(user)
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// description:  Update user profile
// route : Put/api/user/profile
// access: Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// description: Get all users
// route : Get/api/users
//Private

const getUsers = asyncHandler(async (req, res) => {
  const user = await User.find({});

  if (user) {
    res.json({
      user,
    });
  } else {
    res.status(404);
    throw new Error("Users not found"); 
  }
});

// @desc    delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
