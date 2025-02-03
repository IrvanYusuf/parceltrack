const router = require("express").Router();
const path = require("path");
const transactionController = require("../controllers/transactionController.js");
const authGuard = require("../middleware/authGuard.js");
const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "../uploads"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });

const upload = multer();
router.get("/", authGuard(["Admin", "Pegawai"]), transactionController.show);

router.get("/add", authGuard(["Admin"]), transactionController.create);
router.post(
  "/store",
  authGuard(["Admin"]),
  upload.array("bukti_foto", 6),
  transactionController.store
);
router.get(
  "/edit/:id",
  authGuard(["Admin", "Pegawai"]),
  transactionController.edit
);
router.get(
  "/detail/:id",
  authGuard(["Admin", "Pegawai"]),
  transactionController.detail
);
router.put(
  "/update/:id",
  authGuard(["Admin", "Pegawai"]),
  transactionController.update
);
router.delete(
  "/delete/:id",
  authGuard(["Admin"]),
  transactionController.destroy
);
module.exports = router;
