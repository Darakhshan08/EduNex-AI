const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    "your_jwt_secret", // you should replace this with process.env.JWT_SECRET in production
    { expiresIn: "1d" }
  );
};

module.exports = generateToken;