const router = require("express").Router();
const customerController = require("../controllers/customerController.js");
const authGuard = require("../middleware/authGuard.js");
router.get("/", authGuard(["Admin", "Pegawai"]), customerController.show);

router.get("/add", authGuard(["Admin"]), customerController.create);
router.post("/store", authGuard(["Admin"]), customerController.store);
router.get("/edit/:id", authGuard(["Admin"]), customerController.edit);
router.put("/update/:id", authGuard(["Admin"]), customerController.update);
router.delete("/delete/:id", authGuard(["Admin"]), customerController.destroy);
module.exports = router;
