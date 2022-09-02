const User = require('../models/User');
const cloudinary = require('../util/cloudinary');

module.exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users)
    return res.status(204).json({ message: 'No users found' });
  res.json(users);
};

module.exports.getUser = async (req, res) => {
  console.log('Getting user...');
  try {
    if (!req?.params?.id)
      return res.status(400).json({ message: 'User ID required' });

    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(204)
        .json({ message: `User ID ${req.params.id} not found` });
    }
    //console.log('Sending user...\n' + user);
    return res.json(user);
  } catch (err) {
    return res.sendStatus(400);
  }
};

const deletePhoto = async (id) => {
  await cloudinary.uploader.destroy(id);
};

module.exports.updateProfileImage = async (req, res, next) => {
  console.log(req);
  //res.status(200).json({ sucess: 'true' });
  if (!req?.user?.id) {
    return res
      .status(400)
      .json({ message: 'ID parameter is required.' });
  }

  let croppedPhoto = {};
  const filter = { _id: req.user._id };

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { gravity: 'face', height: 300, width: 300, crop: 'thumb' }
  );

  // const result = await cloudinary.uploader.upload(req.file.path, {
  //   eager: [{ width: 300, height: 300, crop: 'pad' }],
  // });
  // console.log(result.eager[0].url);

  // const profileImage = {
  //   public_id: result.eager[0].public_id,
  //   secure_url: result.eager[0].secure_url,
  // };

  const profileImage = {
    public_id,
    secure_url,
  };

  let user = await User.findOneAndUpdate(
    filter,
    { profileImage },
    {
      new: true,
    }
  );
  console.log('UPDATED PROFILE PICTURE');
  res.status(200).json({
    success: 'true',
    user,
  });
};
