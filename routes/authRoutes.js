const router = require("express").Router();
const authController = require("../controllers/authController.js");
router.get("/login", authController.showLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);

module.exports = router;
