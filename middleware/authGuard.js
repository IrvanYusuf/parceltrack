const jwt = require("jsonwebtoken");
require("dotenv").config();
const authGuard = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.user_data;

      if (!token) {
        console.log("User not found, redirecting to login");
        return res.redirect("/admin/auth/login");
      }
      const decoded = jwt.verify(token, process.env.SESSION_SECRET);
      if (!decoded.role || !allowedRoles.includes(decoded.role)) {
        console.log("User role not authorized, redirecting to unauthorized");
        return res.redirect("/unauthorized");
      }

      next(); // Hanya jalankan next() jika semua validasi lolos
    } catch (error) {
      console.error("Error in authGuard:", error);
      res.status(500).send("An error occurred");
    }
  };
};

module.exports = authGuard;
