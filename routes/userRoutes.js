const router = require("express").Router({ mergeParams: true });
const userController = require("../controllers/userController.js");
const authGuard = require("../middleware/authGuard.js");

router.get("/", authGuard(["Admin", "Pegawai"]), userController.getAllUsers);
router.get("/add", authGuard(["Admin"]), userController.create);
router.post("/store", authGuard(["Admin"]), userController.store);
router.get("/edit/:id", authGuard(["Admin"]), userController.edit);
router.put("/update/:id", authGuard(["Admin"]), userController.update);
router.delete("/delete/:id", authGuard(["Admin"]), userController.destroy);

module.exports = router;
