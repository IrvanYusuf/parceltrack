const supabase = require("../config/supabase.js");
const roleController = require("./roleController.js");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res) => {
  try {
    const { data: dataUsers, error } = await supabase.from("tbl_users").select(`
        id,
        name,
        email,
        no_hp,
        position: tbl_role (role)
        `);
    const formattedData = dataUsers.map((user) => ({
      ...user,
      position: user.position?.role || null,
    }));

    const data = {
      formattedData,
    };

    res.render("admin/users/index", { data });
  } catch (error) {
    console.log(error);
  }
};

const create = async (req, res) => {
  try {
    const dataRoles = await roleController.getAllRoles();
    const data = {
      dataRoles,
    };

    res.render("admin/users/new", { data });
  } catch (error) {
    console.log(error);
  }
};

const store = async (req, res) => {
  try {
    let payload = req.body;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(payload.password, salt);
    const newPayload = { ...payload, password: hashPassword };

    const { data: dataInsert, error } = await supabase
      .from("tbl_users")
      .insert([newPayload])
      .select();

    res.redirect(`/admin/users`);
  } catch (error) {
    console.log(error);
  }
};

const edit = async (req, res) => {
  try {
    // res.render("add");
    const dataRoles = await roleController.getAllRoles();

    const { data: dataUser, error } = await supabase
      .from("tbl_users")
      .select(
        `
      id,
      name,
      email,
      no_hp,
      role_id,
      position: tbl_role (role)
      `
      )
      .eq("id", req.params.id);
    const formattedData = dataUser.map((user) => ({
      ...user,
      position: user.position?.role || null,
    }));

    console.log(formattedData[0]);

    const data = {
      dataRoles,
      formattedData: formattedData[0],
    };

    res.render("admin/users/edit", { data });
  } catch (error) {
    console.log(error);
  }
};

const update = async (req, res) => {
  try {
    const { name, email, no_hp, role_id } = req.body;
    const { id } = req.params;

    const { data, error } = await supabase
      .from("tbl_users")
      .update({
        name,
        email,
        no_hp,
        role_id,
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.redirect(`/admin/users`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong.");
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("tbl_users")
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.redirect(`/admin/users`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getAllUsers, create, store, edit, update, destroy };
