import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudnary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res, err) => {
  const { fullname, username, email, password } = req.body;
  if (
    [fullname, username, email, password].some((item) => item?.trim() === '')
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(400, 'User already existed');
  }

  const avatarLocalPath = req.files?.avatar[0].path;
  const coverImageLocalPath = req.files?.coverImage[0];

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar file is required');
  }

  const avatar = await uploadOnCloudnary(avatarLocalPath);
  const coverImage = await uploadOnCloudnary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, 'Avatar is required');
  }

  const user = User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url ?? '',
    email,
    password,
    username: username.toLowercase(a),
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );
  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong white resistering the user');
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'user resistered successfully'));
});

export default registerUser;
