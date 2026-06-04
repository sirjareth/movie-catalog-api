const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../auth');
const { errorHandler } = require('../auth');

// Register User
module.exports.registerUser = async (req, res) => {
  try {
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    });
    // try 
    // try
    await newUser.save();
    res.status(201).send({ message: 'Registered Successfully'});
  } catch (error) {
    errorHandler(error, req, res);
  }
  
};

module.exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email;

    if (!email.includes('@')) {
      return res.status(400).send({ mesasge: "Invalid email format"});
    }

    const result = await User.findOne({ email: email });

    if (result == null) {
      return res.status(404).send({ message: "User not found!"});
    }

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

    if (isPasswordCorrect) {
      return res.status(200).send({ access: auth.createAccessToken(result) });
    } else {
      return res.status(401).send({ message: "Incorrect email or password"});
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
}

module.exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if(!user) {
      return res.status(404).send({ message: "User not found "});
    }

    user.password = "";
    res.status(200).send({ user });
  } catch (error) {
    errorHandler(error, req, res);
  }
}