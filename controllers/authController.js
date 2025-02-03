const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const showLogin = async (req, res) => {
  try {
    // const {} = await supabase.from("tbl_users").select()
    res.render("admin/auth/login", { data: {} });
  } catch (error) {
    console.log(error);
  }
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: dataLogin, error } = await supabase
      .from("tbl_users")
      .select("*, role:tbl_role(role)")
      .eq("email", email);
    const data = {
      message: "",
      email,
      password: "",
    };
    if (!dataLogin || dataLogin.length === 0) {
      data.message = "Email not found";
      res.render("admin/auth/login", { data });
    }

    const checkPassword = await bcrypt.compare(password, dataLogin[0].password);
    if (!checkPassword) {
      data.password = "Invalid Credential";
      res.render("admin/auth/login", { data });
    }

    const userData = {
      id: dataLogin[0].id,
      email: dataLogin[0].email,
      name: dataLogin[0].name,
      role: dataLogin[0].role.role,
    };
    const token = jwt.sign(userData, process.env.SESSION_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("user_data", token, { httpOnly: true, secure: true });

    res.redirect("/admin/");
  } catch (error) {
    console.log(error);
  }
};
const logout = async (req, res) => {
  try {
    res.clearCookie("user_data");
    res.redirect("/admin/auth/login");
  } catch (error) {
    console.log(error);
  }
};
module.exports = { showLogin, postLogin, logout };
