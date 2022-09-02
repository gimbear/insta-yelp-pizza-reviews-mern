const Pizza = require('../models/Pizza');
const cloudinary = require('../util/cloudinary');
const fileUpload = require('../util/fileUpload');

const errorHandler = (err) => {
  //console.log(e);
  let pizzaError = { user: '', pizza: '' };
  if (err.message === 'unathorized') {
    authError.user = "You're not authorized to handle that Pizza";
  }
  if (err.message === 'post not found') {
    authError.pizza = 'Sorry - That pizza does not exist';
  }
  if (err.message === 'upload error') {
    authError.pizza = 'Too much cheese! Could not upload image';
  }
  return pizzaError;
};

const deleteImageCloudinary = async (id) => {
  console.log(id);
  const { images } = await Pizza.findById(id);

  await images.map((img) =>
    cloudinary.uploader.destroy(img.cloudinary_id)
  );
};

module.exports.addPizza = async (req, res) => {
  try {
    //console.log(req);
    const files = req.files;
    //console.log(files);

    let images = [];
    for (const file of files) {
      const newPath = await fileUpload(file);

      images.push({
        cloudinary_id: newPath.public_id,
        url: newPath.secure_url,
      });
    }
    console.log(req);
    const location = JSON.parse(req?.body.locationData);
    const pizza = await Pizza.create({
      user: req.user._id,
      images: images,
      location: location,
      ...req.body,
    });

    res.status(201).json({ pizza });
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
};

module.exports.updatePizza = async (req, res) => {
  //console.log(req);

  const files = req.files;
  const removedFiles = JSON.parse(req?.body.oldFile);
  const filter = { _id: req.body._id };
  const newImages = [];
  console.log(filter);

  for (const image_id of removedFiles) {
    console.log(image_id);
    const result = await Pizza.updateOne(
      filter,
      {
        $pull: { images: { cloudinary_id: image_id } },
      },
      { safe: true, multi: false }
    );
    console.log(`deleted ${result}`);
    await cloudinary.uploader.destroy(image_id);
  }

  for (const file of files) {
    console.log(file);
    const newPath = await fileUpload(file);
    console.log(newPath);
    newImages.push({
      cloudinary_id: newPath.public_id,
      url: newPath.secure_url,
    });
  }
  const location = JSON.parse(req?.body.locationData);
  const update = {
    pizzaTitle: req.body.pizzaTitle,
    body: req.body.body,
    rating: req.body.rating,
    cost: req.body.cost,
    location: location,
    $push: { images: { $each: newImages } },
  };

  let pizza = await Pizza.findOneAndUpdate(filter, update, {
    new: true,
  });

  // console.log(pizza);
  res.status(201).json({ pizza });
};

module.exports.getPizzas = async (req, res) => {
  try {
    const pizza = await Pizza.find({}).sort({
      createdAt: 'descending',
    });
    res.status(200).json(pizza);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

module.exports.getPizzaById = async (req, res) => {
  console.log('hello');
  if (!req?.params?.id) {
    return res.status(400).json({ message: 'Pizza ID required' });
  }

  const pizza = await Pizza.findById(req.params.id);

  if (!pizza) {
    return res.status(204).json({
      message: `That pizza does not exist`,
    });
  }
  res.status(200).json(pizza);
};

module.exports.deletePizza = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: 'Pizza ID required' });
  }

  const pizza = await Pizza.findById(req.params.id);

  if (!pizza) {
    return res.status(204).json({
      message: `That pizza does not exist`,
    });
  }

  if (pizza.user.toString() !== req.user._id.toString()) {
    return res.sendStatus(401);
  }
  await deleteImageCloudinary(req.params.id);
  await pizza.remove();

  res.status(200).json({ message: 'Pizza post successfuly deleted' });
};

module.exports.ratePizza = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: 'Post ID required.' });

  const post = await Post.findById(req.params.id);
};
