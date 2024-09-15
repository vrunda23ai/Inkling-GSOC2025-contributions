const jwt = require('jsonwebtoken');

function generateTokenAndSetCookie(userid, res) {
  const token = jwt.sign({ userid }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000, // == 1 day always in Seconds
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV === "production"
  });
}

function verifyToken(token, next){
  jwt.verify(token, process.env.JWT_SECRET, function(err) {
    if(err){
      next(new Error('Unauthorized - Expired or Invalid Token, Re-login'));
    }
    else{
      next();
    }
  });
}
  
module.exports = {
  generateTokenAndSetCookie,
  verifyToken
};