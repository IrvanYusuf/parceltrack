const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const routesWeb = require("./routes/index.js");
const methodOverride = require("method-override");
const clientRoutes = require("./routes/clientRoutes.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

dotenv.config();
app.set("views", path.join(__dirname, "views"));

// Menambahkan middleware untuk meng-override HTTP method
app.use(methodOverride("_method"));

// load static
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  // Ambil token dari cookie (misalnya 'user_data')
  const token = req.cookies.user_data;

  if (token) {
    try {
      // Dekode token dan verifikasi (jika perlu)
      const decoded = jwt.verify(token, process.env.SESSION_SECRET);

      // Simpan data user ke res.locals untuk akses di view
      res.locals.user = decoded;
    } catch (err) {
      console.log("Token invalid or expired");
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

app.use(expressLayouts);
app.use((req, res, next) => {
  if (
    req.path.startsWith("/admin/auth") ||
    req.path.startsWith("/unauthorized")
  ) {
    app.set("layout", "./layouts/auth");
  } else if (req.path.startsWith("/admin/") || req.path.startsWith("/admin")) {
    app.set("layout", "./layouts/main");
  } else {
    app.set("layout", "./layouts/client");
  }
  next();
});

app.set("view engine", "ejs");

app.use((req, res, next) => {
  // Menambahkan currentRoute ke response locals
  res.locals.currentRoute = req.originalUrl;
  next();
});

app.use("/admin", routesWeb);
app.use("/", clientRoutes);

// app.get("/about", (req, res) => {
//   res.render("about");
// });

app.listen(5000, () => {
  console.log(`running on ${5000}`);
});
