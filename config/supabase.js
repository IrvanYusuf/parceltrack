const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://bonoewkwlukwmogltcdh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbm9ld2t3bHVrd21vZ2x0Y2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyNDQ5ODIsImV4cCI6MjA1MzgyMDk4Mn0.ekquECfuGYMHLy-ppL8QoQrE5lLi_h14wyDOLHN55ng";
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
