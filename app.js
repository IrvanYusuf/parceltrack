const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const routesWeb = require("./routes/index.js");
const methodOverride = require("method-override");
const clientRoutes = require("./routes/clientRoutes.js");

dotenv.config();
app.set("views", path.join(__dirname, "views"));

// Menambahkan middleware untuk meng-override HTTP method
app.use(methodOverride("_method"));

// load static
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use(expressLayouts);
app.use((req, res, next) => {
  if (
    req.path.startsWith("/admin/auth") ||
    req.path.startsWith("/unauthorized")
  ) {
    app.set("layout", "./layouts/auth");
  } else if (req.path.startsWith("/admin/")) {
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
