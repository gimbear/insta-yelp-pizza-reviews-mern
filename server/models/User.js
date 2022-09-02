const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const genRanHex = (size) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');

//user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, 'username already registerd'],
    lowercase: true,
    required: [true, 'username is required'],
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: [true, 'email already registerd'],
    lowercase: true,
    validate: [isEmail, 'unvalid email'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: [6, 'password too short'],
  },
  profileImage: {
    type: Object,
    default: `https://robohash.org/${genRanHex(6)}?set=set4`,
  },
});

//? https://mongoosejs.com/docs/populate.html#populate-virtuals
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });
userSchema.virtual('pizzas', {
  ref: 'Pizza',
  localField: '_id',
  foreignField: 'user',
});

userSchema.pre(/^find/, function (next) {
  this.find().populate('pizzas');

  next();
});

//password hashing on save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    console.log('HASHING AND SALTING PASSWORD');
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

//user login function
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

//find user function
userSchema.statics.findUser = async function (_id) {
  const user = await this.findOne({ _id });
  if (user) {
    console.log('found it');
    return user;
  }
  throw Error('user not found');
};

const User = mongoose.model('User', userSchema);

module.exports = User;
