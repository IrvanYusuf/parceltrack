const router = require("express").Router();
const packageController = require("../controllers/packageController.js");
const authGuard = require("../middleware/authGuard.js");
router.get("/", authGuard(["Admin", "Pegawai"]), packageController.show);

router.get("/add", authGuard(["Admin"]), packageController.create);
router.post("/store", authGuard(["Admin"]), packageController.store);
router.get("/edit/:id", authGuard(["Admin"]), packageController.edit);
router.put("/update/:id", authGuard(["Admin"]), packageController.update);
router.delete("/delete/:id", authGuard(["Admin"]), packageController.destroy);
module.exports = router;
