const jwt = require("jsonwebtoken");

const auth = (roles = []) => {
  return (req, res, next) => {
    // Look in headers OR the token parameter in the URL
    const token = req.headers.authorization?.split(" ")[1] || req.query.token;

    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
      const decoded = jwt.verify(token, "SECRET_KEY");
      req.user = decoded;
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = auth;

