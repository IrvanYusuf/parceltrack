const router = require("express").Router();
const stationController = require("../controllers/stationController.js");
const authGuard = require("../middleware/authGuard.js");
router.get("/", authGuard(["Admin", "Pegawai"]), stationController.show);

router.get("/add", authGuard(["Admin"]), stationController.create);
router.post("/store", authGuard(["Admin"]), stationController.store);
router.get("/edit/:id", authGuard(["Admin"]), stationController.edit);
router.put("/update/:id", authGuard(["Admin"]), stationController.update);
router.delete("/delete/:id", authGuard(["Admin"]), stationController.destroy);
module.exports = router;
