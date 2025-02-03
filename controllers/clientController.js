const supabase = require("../config/supabase");

const checkResi = async (req, res) => {
  try {
    const search = req.query.q;
    const data = {
      detailDataTransaction: [],
      detailTransactionStatus: [],
      search: search || "",
    };
    if (search) {
      const { data: detailDataTransaction, error } = await supabase
        .from("tbl_transactions")
        .select(
          `id,nama_barang,no_resi, customer:tbl_customers(name,no_hp),
        paket: tbl_packages (name,price,estimation),
         stasiun_awal:tbl_railway_station!tbl_transaction_stasiun_awal_id_fkey(name),stasiun_tujuan:tbl_railway_station!tbl_transaction_stasiun_tujuan_id_fkey(name),
         bukti_foto
         `
        )
        .eq("no_resi", search);
      if (detailDataTransaction.length > 0) {
        const { data: detailTransactionStatus, error: errorStatus } =
          await supabase
            .from("tbl_transaction_status")
            .select("*")
            .eq("transaction_id", detailDataTransaction[0].id);
        if (detailDataTransaction && detailTransactionStatus) {
          data.detailDataTransaction = detailDataTransaction[0];
          data.detailTransactionStatus = detailTransactionStatus[0];
          res.render("cekResi", { data });
        }
      } else {
        res.render("cekResi", { data });
      }
    } else {
      res.render("cekResi", { data: {} });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { checkResi };
