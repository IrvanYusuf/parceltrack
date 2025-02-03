const supabase = require("../config/supabase.js");
const nameTable = "tbl_packages";
const show = async (req, res) => {
  try {
    const { data: dataPackages } = await supabase.from(nameTable).select("*");
    const data = {
      dataPackages,
    };

    res.render("admin/packages/index", { data });
  } catch (error) {
    console.log(error);
  }
};

const create = async (req, res) => {
  try {
    res.render("admin/packages/new");
  } catch (error) {
    console.log(error);
  }
};

const store = async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
    };

    const { data: dataInsert, error } = await supabase
      .from(nameTable)
      .insert([payload])
      .select();

    // const { data } = await supabase.from("tbl_customers").select("*");
    if (dataInsert) {
      res.redirect("/admin/packages");
    }
  } catch (error) {
    console.log(error);
  }
};

const edit = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: dataPackages } = await supabase
      .from(nameTable)
      .select("*")
      .eq("id", id);

    const data = {
      dataPackages: dataPackages[0],
    };
    res.render("admin/packages/edit", { data });
  } catch (error) {
    console.log(error);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const { data, error } = await supabase
      .from(nameTable)
      .update(payload)
      .eq("id", id)
      .select();

    // if (error) throw error;

    res.redirect(`/admin/packages`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong.");
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from(nameTable)
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.redirect(`/admin/packages`);
  } catch (error) {
    console.log(error);
  }
};
module.exports = { create, store, show, edit, update, destroy };
