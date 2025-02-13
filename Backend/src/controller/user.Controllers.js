import { User } from "../model/user.Model.js";
import { asyncHandler } from "../utils/wrapAsync.js";
import { ApiResponse } from "../utils/responseHandler.js";
import { generateAccessToken } from "../utils/generateAcessToken.js";
import { generateRefreshToken } from "../utils/generateRefreshToken.js";

const generateAccessAndRefreshTokens = async (userId, next) => {
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  if (!accessToken || !refreshToken) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Token generation failed"));
  }

  return { accessToken, refreshToken };
};

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "Please provide all required fields (name, email, password)"
        )
      );
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User already exists"));
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User created successfully"));
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  if (!users) {
    return res.status(404).json(new ApiResponse(404, null, "Users not found"));
  }

  return res.status(200).json(new ApiResponse(200, users, "Users fetched"));
});

export const getUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  return res.status(200).json(new ApiResponse(200, user, "User fetched"));
});

export const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, email, role } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
});

export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide all required fields"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  const isPasswordValidate = await user.isValidPassword(password);

  if (!isPasswordValidate) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid email or password"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const { password: _, ...userData } = user.toObject();
  return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(
      new ApiResponse(
        200,
        {
          user: userData,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});
