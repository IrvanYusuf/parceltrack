const supabase = require("../config/supabase.js");
const nameTable = "tbl_transactions";
const moment = require("moment");
const show = async (req, res) => {
  try {
    let { data: dataTransactions, error } = await supabase
      .from("tbl_transactions")
      .select(
        `id,nama_barang,no_resi, customer:tbl_customers(name,no_hp),
        paket: tbl_packages (name,price,estimation),
         stasiun_awal:tbl_railway_station!tbl_transaction_stasiun_awal_id_fkey(name),stasiun_tujuan:tbl_railway_station!tbl_transaction_stasiun_tujuan_id_fkey(name),
         bukti_foto
         `
      )
      .order("created_at");

    const data = {
      dataTransactions,
    };

    res.render("admin/transactions/index", { data });
  } catch (error) {
    console.log(error);
  }
};

const create = async (req, res) => {
  try {
    const no_resi = await generateResi();
    const { data: dataCustomer } = await supabase
      .from("tbl_customers")
      .select("*");

    const { data: dataPackages } = await supabase
      .from("tbl_packages")
      .select("*");

    const { data: dataStations } = await supabase
      .from("tbl_railway_station")
      .select("*");
    const data = {
      no_resi,
      dataCustomer,
      dataPackages,
      dataStations,
    };
    res.render("admin/transactions/new", { data });
  } catch (error) {
    console.log(error);
  }
};

const detail = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: detailDataTransaction, error } = await supabase
      .from("tbl_transactions")
      .select(
        `id,nama_barang,no_resi, customer:tbl_customers(name,no_hp),
      paket: tbl_packages (name,price,estimation),
       stasiun_awal:tbl_railway_station!tbl_transaction_stasiun_awal_id_fkey(name),stasiun_tujuan:tbl_railway_station!tbl_transaction_stasiun_tujuan_id_fkey(name),
       bukti_foto
       `
      )
      .eq("id", id);

    const { data: detailTransactionStatus, error: errorStatus } = await supabase
      .from("tbl_transaction_status")
      .select("*")
      .eq("transaction_id", detailDataTransaction[0].id);

    const data = {
      detailDataTransaction: detailDataTransaction[0],
      detailTransactionStatus: detailTransactionStatus[0],
    };
    res.render("admin/transactions/detail", { data });
  } catch (error) {
    console.log(error);
  }
};

const store = async (req, res) => {
  try {
    const files = req.files;
    const buktiFoto = [];

    for (const file of files) {
      const filePath = `uploads/${Date.now()}_${file.originalname}`;
      buktiFoto.push({ file_name: file.filename, file_path: filePath });
    }

    const payload = {
      customer_id: req.body.customer_id,
      package_id: req.body.package_id,
      stasiun_awal_id: req.body.stasiun_awal_id,
      stasiun_tujuan_id: req.body.stasiun_tujuan_id,
      nama_barang: req.body.nama_barang,
      no_resi: req.body.no_resi,
      bukti_foto: buktiFoto,
    };

    const { data: dataInsert, error } = await supabase
      .from(nameTable)
      .insert([payload])
      .select();

    const payloadTransactionStatus = {
      transaction_id: dataInsert[0].id,
      is_confirmed: true,
    };

    const { data: dataInsertStatus } = await supabase
      .from("tbl_transaction_status")
      .insert([payloadTransactionStatus])
      .select();

    if (dataInsert && dataInsertStatus) {
      res.redirect("/admin/transactions");
    }
  } catch (error) {
    console.log(error);
  }
};

const edit = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: detailDataTransaction, error } = await supabase
      .from("tbl_transactions")
      .select(
        `id,nama_barang,no_resi, customer:tbl_customers(id,name,no_hp),
      paket: tbl_packages (id,name,price,estimation),
       stasiun_awal:tbl_railway_station!tbl_transaction_stasiun_awal_id_fkey(id,name),stasiun_tujuan:tbl_railway_station!tbl_transaction_stasiun_tujuan_id_fkey(id,name),
       bukti_foto
       `
      )
      .eq("id", id);

    const { data: detailTransactionStatus, error: errorStatus } = await supabase
      .from("tbl_transaction_status")
      .select("*")
      .eq("transaction_id", detailDataTransaction[0].id);
    const { data: dataCustomer } = await supabase
      .from("tbl_customers")
      .select("*");

    const { data: dataPackages } = await supabase
      .from("tbl_packages")
      .select("*");

    const { data: dataStations } = await supabase
      .from("tbl_railway_station")
      .select("*");

    const data = {
      detailDataTransaction: detailDataTransaction[0],
      dataPackages,
      dataCustomer,
      dataPackages,
      dataStations,
      detailTransactionStatus: detailTransactionStatus[0],
    };
    res.render("admin/transactions/edit", { data });
  } catch (error) {
    console.log(error);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    console.log("id", id);

    const payloadUpdateTransaction = {
      nama_barang: body.nama_barang,
      customer_id: body.customer_id,
      package_id: body.package_id,
      stasiun_awal_id: body.stasiun_awal_id,
      stasiun_tujuan_id: body.stasiun_tujuan_id,
    };

    const payloadUpdateTransactionStatus = {
      is_confirmed: body.is_confirmed === "on",
      is_packaging: body.is_packaging === "on",
      is_transit: body.is_transit === "on",
      is_arrived: body.is_arrived === "on",
      is_delivered: body.is_delivered === "on",
    };

    console.log(payloadUpdateTransactionStatus);

    const { data: dataUpdateTransaction, error } = await supabase
      .from(nameTable)
      .update(payloadUpdateTransaction)
      .eq("id", id)
      .select();
    const {
      data: dataUpdateTransactionStatus,
      error: errorUpdateTransactionStatus,
    } = await supabase
      .from("tbl_transaction_status")
      .update(payloadUpdateTransactionStatus)
      .eq("transaction_id", id)
      .select();

    // if (error) throw error;
    if (dataUpdateTransaction && dataUpdateTransactionStatus) {
      res.redirect(`/admin/transactions`);
    }
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
    res.redirect(`/admin/transactions`);
  } catch (error) {
    console.log(error);
  }
};

const generateResi = async () => {
  const today = moment().format("YYYY-MM-DD"); // Format tanggal hari ini

  // Ambil kwitansi terakhir yang dibuat hari ini
  const { data, error } = await supabase
    .from(nameTable) // Sesuaikan dengan nama tabel
    .select("no_resi, created_at")
    .gte("created_at", `${today} 00:00:00`)
    .lte("created_at", `${today} 23:59:59`)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw error;

  let nomorUrut = 1; // Default jika belum ada transaksi hari ini

  if (data.length > 0) {
    const lastNoResi = data[0].no_resi;
    console.log(lastNoResi);

    const lastNumber = parseInt(lastNoResi.split("-")[4]); // Ambil 4 digit terakhir

    nomorUrut = lastNumber + 1;
  }

  // Format nomor kwitansi
  const nomorlastNoResi = `RES-${today}-${String(nomorUrut).padStart(4, "0")}`;
  return nomorlastNoResi;
};
module.exports = { create, store, show, edit, update, destroy, detail };
