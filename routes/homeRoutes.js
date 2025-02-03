const router = require("express").Router();

const homeController = require("../controllers/homeController.js");
const authGuard = require("../middleware/authGuard.js");

router.get("/", authGuard(["Admin", "Pegawai"]), homeController.show);
module.exports = router;
