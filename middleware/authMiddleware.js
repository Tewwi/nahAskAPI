const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
require("dotenv").config();

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization || null;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.status(401).json({ message: "Unauthorized " });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Unauthorized " });
  }
};

const checkCurrUser = (req, res, next) => {
  const token = req.headers.authorization || null;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        res.currUser = null;
      } else {
        let user = await User.findById(decodedToken.id);
        if (user) {
          const { password, ...userInfo } = user.toObject();
          res.currUser = userInfo;
        }
      }

      next();
    });
  } else {
    res.currUser = null;
    next();
  }
};

module.exports = { requireAuth, checkCurrUser };
