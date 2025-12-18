const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const db = new sqlite3.Database("./reseller.db");

const tables = [
  "benefits",
  "howitworks",
  "testimonials",
  "contactinfo",
  "registrations",
];

const result = {};
let done = 0;

tables.forEach((table) => {
  db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
    if (err) {
      console.error(`❌ Error table ${table}:`, err.message);
      result[table] = [];
    } else {
      result[table] = rows;
      console.log(`✅ Exported ${table} (${rows.length} rows)`);
    }

    done++;
    if (done === tables.length) {
      fs.writeFileSync(
        "db-export.json",
        JSON.stringify(result, null, 2),
        "utf-8"
      );
      console.log("\n📦 SELESAI → file db-export.json dibuat");
      db.close();
    }
  });
});
