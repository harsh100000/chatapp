const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require('../config/generateToken')

const registerUser = async (req, res) => {
  try {
    const { name, email, password, profilePicture } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill the required fields" });
    }

    const isUserAlreadyExist = await User.findOne({ email });
    if (isUserAlreadyExist) {
      return res.status(401).json({ message: "Email already exist please login" });
    } 
    else {
      bcrypt.hash(password, 10, async function(err, hash) {
        const user = await User.create({name, email, password:hash, profilePicture});
        res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          token: generateToken(user._id)
        });
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill the required fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Email doesn't exist" });
    }
    else{
      bcrypt.compare(password, user.password, function(err, result) {
        if(result === true) res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          token: generateToken(user._id)
        });
        else res.status(401).json({ message: "Incorret Password", err });
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { registerUser, loginUser };
