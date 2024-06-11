const registerUser = async (req, res, err) => {
  // get user detail from frontend
  // validation - not empty
  // check user already exist - username , email
  // check images, check for avtar
  // upload them to cloudinary
  // create user object - create entry in db
  // remove password and refresh rtoken
  // check for user creation
  // return res

  const { fullname, username, email, password } = req.body;
  console.log('email', email);
  if (
    [fullname, username, email, password].some((item) => item?.trim() === '')
  ) {
    res.status(400).json({ err: 'all fields are required' });
  }

  const existedUser = User.findone({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    res.status(400).json({ err: 'user already existed' });
  }
};

export default registerUser;
