const authGuard = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const user = req.session.user;
      console.log("User Session:", user);

      if (!user) {
        console.log("User not found, redirecting to login");
        return res.redirect("/admin/auth/login");
      }

      if (!user.role || !allowedRoles.includes(user.role)) {
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
