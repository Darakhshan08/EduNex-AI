const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      student_id: user.student_id || null, // ensure value is here
    },
    "your_jwt_secret", // you should replace this with process.env.JWT_SECRET in production
    { expiresIn: "1h" } 
  );
};

module.exports = generateToken;