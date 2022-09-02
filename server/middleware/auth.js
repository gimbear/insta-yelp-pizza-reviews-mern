const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  console.log('Checking user...');
  const authHeader =
    req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  //console.log('token: ' + token);

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        res.locals.user = null;
        return res.sendStatus(403);
      }
      let user = await User.findById(decoded.id);
      req.user = user;
      next();
    }
  );
};

module.exports = { requireAuth };
