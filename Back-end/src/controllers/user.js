import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import ErrorApi from "../utils/errorAPI.js";
import UserModel from "../models/user.js";

const getAllUsers = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  const users = await UserModel.find({}).skip(skip).limit(limit);
  res.status(200).json({
    status: "success",
    result: users.length,
    data: {
      users,
    },
  });
});

const addUser = asyncHandler(async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 8);
  const userObject = {
    ...req.body,
    password: hashedPassword,
    role: "User",
  };

  const newUser = await UserModel.create(userObject);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

const getUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id);
  if (user) {
    res.json({
      status: "success",
      data: {
        user: { ...user._doc, password: null },
      },
    });
  } else {
    return next(new ErrorApi(`No ${req.params.id} registered`, 404));
  }
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndRemove(req.params.id);
  if (!user) {
    return next(new ErrorApi(`No ${req.params.id} registered`, 404));
  } else {
    res.json({
      message: "User deleted successfully",
    });
  }
});

const updateUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) {
    return next(new ErrorApi(`No ${req.params.id} registered`, 404));
  } else {
    res.json(user);
  }
});

export { addUser, getUser, getAllUsers, updateUser, deleteUser };
