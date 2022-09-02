const User = require('../models/User');
const jwt = require('jsonwebtoken');

const errorHandler = (err) => {
  //console.log(err.message, err.code);
  //login errors

  let authError = { username: '', email: '', password: '' };
  if (err.message === 'incorrect email') {
    authError.email = 'Incorrect email';
  }
  if (err.message === 'incorrect password') {
    authError.password = 'Incorrect password';
  }
  if (err.code === 11000) {
    if (err.message.includes('email_1')) {
      authError.email = 'email already exist';
    } else {
      authError.user = 'username already exist';
    }

    return authError;
  }

  if (err.message.includes('User validation failed')) {
    // validation errors
    // console.log(Object.values(err.errors));

    Object.values(err.errors).forEach(({ properties }) => {
      console.log(properties);
      //console.log('val:' + val);
      console.log('props:' + properties);
      authError[properties.path] = properties.message;
    });
  }

  return authError;
};

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '60000s',
  });
};

module.exports.loginPOST = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    //console.log(user._id);
    // SEND whole user or sen only user id?
    res.status(200).json({ userId: user._id, token });
  } catch (err) {
    const error = errorHandler(err);
    res.status(400).json({ error });
  }
};

module.exports.signupPOST = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const error = errorHandler(err);
    res.status(400).json({ error });
  }
};

// Do i need this?
module.exports.logoutGET = async (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });
  res.sendStatus(200);
};

module.exports.protectedGET = async (req, res) => {
  const authHeader =
    req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    console.log('error wrong format');
    return res.sendStatus(401);
  }
  const token = authHeader.split(' ')[1];
  console.log('AUTHORIZING...');

  try {
    var decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log('***AUTHORIZATION SUCCESSFULL***');
    console.log(decoded);
    res.json({ decoded });
  } catch (e) {
    res.sendStatus(401);
  }
};

module.exports.protectRoute = async (req, res, next) => {
  //console.log('PROTECTED ROUTE');
  const authHeader =
    req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    console.log('error wrong format');
    return res.sendStatus(401);
  }
  const token = authHeader.split(' ')[1];
  //console.log('AUTHORIZING...');

  try {
    var decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log('***AUTHORIZATION SUCCESSFULL***');
    console.log(decoded);
  } catch (e) {
    console.log('hello');
    res.status(401).json({ e });
  }

  const freshUser = await User.findById(decoded.userId);
  //console.log(freshUser);
  req.user = freshUser;
  next();
};
