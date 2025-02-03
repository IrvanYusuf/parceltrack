const supabase = require("../config/supabase.js");

const show = async (req, res) => {
  try {
    const { data: dataUser } = await supabase.from("tbl_customers").select("*");
    const data = {
      dataUser,
    };

    res.render("admin/customers/index", { data });
  } catch (error) {
    console.log(error);
  }
};

const create = async (req, res) => {
  try {
    res.render("admin/customers/new");
  } catch (error) {
    console.log(error);
  }
};

const store = async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      email: req.body.email,
      no_hp: req.body.no_hp,
      jenis_kelamin: req.body.jenis_kelamin,
    };

    const { data: dataInsert, error } = await supabase
      .from("tbl_customers")
      .insert([payload])
      .select();

    const { data } = await supabase.from("tbl_customers").select("*");

    if (data) {
      res.redirect("/admin/customers");
    }
  } catch (error) {
    console.log(error);
  }
};

const edit = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: dataCustomer } = await supabase
      .from("tbl_customers")
      .select("*")
      .eq("id", id);

    const data = {
      dataCustomer: dataCustomer[0],
    };
    res.render("admin/customers/edit", { data });
  } catch (error) {
    console.log(error);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const { data, error } = await supabase
      .from("tbl_customers")
      .update(payload)
      .eq("id", id)
      .select();

    // if (error) throw error;

    res.redirect(`/admin/customers`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong.");
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("tbl_customers")
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.redirect(`/admin/customers`);
  } catch (error) {
    console.log(error);
  }
};
module.exports = { create, store, show, edit, update, destroy };
