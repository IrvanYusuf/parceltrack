const router = require("express").Router();
const clientController = require("../controllers/clientController.js")
router.get("/", (req, res) => {
  res.render("index");
});
router.get("/about", (req, res) => {
  res.render("about");
});
router.get("/cek-resi",clientController.checkResi);

router.get("/unauthorized", (req, res) => {
  res.render("unauthorized");
});

module.exports = router;
