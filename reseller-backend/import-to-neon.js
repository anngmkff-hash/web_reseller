/**
 * Import data dari SQLite (reseller.db)
 * ke PostgreSQL (Neon)
 */

require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const { Client } = require("pg");

// koneksi SQLite (lokal)
const sqliteDb = new sqlite3.Database("./reseller.db");

// koneksi PostgreSQL (Neon)
const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    await pgClient.connect();
    console.log("✅ Connected to Neon PostgreSQL");

    const tables = [
      "benefits",
      "howitworks",
      "testimonials",
      "contactinfo",
      "registrations",
    ];

    for (const table of tables) {
      console.log(`\n➡️ Import table: ${table}`);

      const rows = await new Promise((resolve, reject) => {
        sqliteDb.all(`SELECT * FROM ${table}`, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });

      if (!rows.length) {
        console.log("⚠️  kosong, skip");
        continue;
      }

      for (const row of rows) {
        const cols = Object.keys(row);
        const vals = Object.values(row);
        const params = cols.map((_, i) => `$${i + 1}`).join(",");

        await pgClient.query(
          `INSERT INTO ${table} (${cols.join(",")})
           VALUES (${params})
           ON CONFLICT DO NOTHING`,
          vals
        );
      }

      console.log(`✅ ${rows.length} row masuk`);
    }

    console.log("\n🎉 IMPORT SELESAI");
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  } finally {
    sqliteDb.close();
    await pgClient.end();
  }
})();
