const supabase = require("../config/supabase");
const moment = require("moment");
const show = async (req, res) => {
  try {
    // ambil data total customer
    const { count: totalCustomer } = await supabase
      .from("tbl_customers")
      .select("*", { count: "exact" });

    // ambil data paket status finish
    const { count: dataFinishPackage } = await supabase
      .from("tbl_transaction_status")
      .select("*", { count: "exact" })
      .eq("is_confirmed", true)
      .eq("is_packaging", true)
      .eq("is_transit", true)
      .eq("is_arrived", true)
      .eq("is_delivered", true);

    // ambil data paket status dikirim
    const { count: dataTransitPackage } = await supabase
      .from("tbl_transaction_status")
      .select("*", { count: "exact" })
      .eq("is_confirmed", true)
      .eq("is_packaging", true)
      .eq("is_transit", true)
      .eq("is_arrived", false)
      .eq("is_delivered", false);

    // ambil data total pendapatan
    const { data: dataTotalPendapatan } = await supabase
      .from("tbl_transaction_status")
      .select(
        `
    id,
    transaction:tbl_transactions!inner (
      package_id,
      package:tbl_packages!inner (price)
    )
  `
      )
      .eq("is_confirmed", true)
      .eq("is_packaging", true)
      .eq("is_transit", true)
      .eq("is_arrived", true)
      .eq("is_delivered", true);
    const totalPendapatan = dataTotalPendapatan.reduce((total, item) => {
      // Memastikan item.package dan item.package.price ada
      return total + item.transaction.package.price;
    }, 0);

    const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
    const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");

    // ambil data total pendapatan per bulan
    const { data: dataTotalPendapatanPerBulan } = await supabase
      .from("tbl_transaction_status")
      .select(
        `
    id,
    transaction:tbl_transactions!inner (
      package_id,
      package:tbl_packages!inner (price)
    )
  `
      )
      .eq("is_confirmed", true)
      .eq("is_packaging", true)
      .eq("is_transit", true)
      .eq("is_arrived", true)
      .eq("is_delivered", true)
      .gte("created_at", `${startOfMonth} 00:00:00`)
      .lte("created_at", `${endOfMonth} 00:00:00`)
      .order("created_at", { ascending: false });

    const totalPendapatanPerBulan = dataTotalPendapatanPerBulan.reduce(
      (total, item) => {
        // Memastikan item.package dan item.package.price ada
        return total + item.transaction.package.price;
      },
      0
    );

    const { data: customerPerHari, error } = await supabase
      .from("tbl_customers")
      .select("id, created_at")
      .gte(
        "created_at",
        moment().subtract(7, "days").format("YYYY-MM-DD 00:00:00")
      )
      .lte("created_at", moment().format("YYYY-MM-DD 23:59:59"))
      .order("created_at", { ascending: true });

    console.log(customerPerHari);
    const customersPerDay = customerPerHari.reduce((acc, customer) => {
      const tanggal = customer.created_at.split("T")[0]; // Ambil hanya tanggal

      if (!acc[tanggal]) {
        acc[tanggal] = 0;
      }

      acc[tanggal] += 1;
      return acc;
    }, {});

    console.log(customersPerDay);
    const last7Days = [...Array(7)]
      .map((_, i) => moment().subtract(i, "days").format("YYYY-MM-DD"))
      .reverse(); // Supaya urutan dari yang paling lama ke terbaru

    // Pastikan setiap hari ada nilai, jika tidak ada isi dengan 0
    const dataPerDay = last7Days.map((date) => customersPerDay[date] || 0);
    console.log(last7Days);
    console.log(dataPerDay);

    const dataCustomerLabel = {
      label: last7Days,
      data: dataPerDay,
    };

    const data = {
      dataCustomerLabel,
      totalCustomer,
      dataFinishPackage,
      totalPendapatan,
      totalPendapatanPerBulan,
      dataTransitPackage,
    };
    res.render("admin/index", { data });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { show };
