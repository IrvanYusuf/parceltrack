const supabase = require("../config/supabase.js");

const getAllRoles = async () => {
  try {
    const { data } = await supabase.from("tbl_role").select("*");

    return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getAllRoles };
