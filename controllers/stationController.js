const supabase = require("../config/supabase.js");
const nameTable = "tbl_railway_station";
const show = async (req, res) => {
  try {
    const { data: dataStations } = await supabase.from(nameTable).select("*");
    const data = {
      dataStations,
    };

    res.render("admin/stations/index", { data });
  } catch (error) {
    console.log(error);
  }
};

const create = async (req, res) => {
  try {
    res.render("admin/stations/new");
  } catch (error) {
    console.log(error);
  }
};

const store = async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      address: req.body.address,
    };

    const { data: dataInsert, error } = await supabase
      .from(nameTable)
      .insert([payload])
      .select();

    // const { data } = await supabase.from("tbl_customers").select("*");
    if (dataInsert) {
      res.redirect("/admin/stations");
    }
  } catch (error) {
    console.log(error);
  }
};

const edit = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: dataStation } = await supabase
      .from(nameTable)
      .select("*")
      .eq("id", id);

    const data = {
      dataStation: dataStation[0],
    };
    res.render("admin/stations/edit", { data });
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

    res.redirect(`/admin/stations`);
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
    res.redirect(`/admin/stations`);
  } catch (error) {
    console.log(error);
  }
};
module.exports = { create, store, show, edit, update, destroy };
