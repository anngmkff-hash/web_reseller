// --- IMPORT MODULE ---
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", function () {
  // ...
});

app.use(cors());
app.use(express.json());

/* ----------------------------------------------------------------------------
 * DATABASE (PostgreSQL / Neon)
 * --------------------------------------------------------------------------*/
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL belum di-set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// test koneksi (TIDAK mematikan process)
pool.query("SELECT 1")
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ DB connection error:", err.message));

const q = async (sql, params = []) => {
  const { rows } = await pool.query(sql, params);
  return rows;
};

/* ----------------------------------------------------------------------------
 * CREATE TABLES (LOCAL ONLY)
 * --------------------------------------------------------------------------*/
async function createTables() {
  await q(`
    CREATE TABLE IF NOT EXISTS benefits (
      id SERIAL PRIMARY KEY,
      icon TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS howitworks (
      id SERIAL PRIMARY KEY,
      icon TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      stars INTEGER NOT NULL,
      avatar TEXT
    );

    CREATE TABLE IF NOT EXISTS contactinfo (
      id SERIAL PRIMARY KEY,
      phone TEXT,
      email TEXT,
      instagram TEXT,
      address TEXT
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id SERIAL PRIMARY KEY,
      "fullName" TEXT NOT NULL,
      email TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      city TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("✅ Tables checked/created");
}

/* ----------------------------------------------------------------------------
 * SEED DATA (LOCAL ONLY)
 * --------------------------------------------------------------------------*/
async function seedData() {
  const [{ count }] = await q(`SELECT COUNT(*)::int AS count FROM benefits`);
  if (count > 0) {
    console.log("✅ Data already exists, skip seeding");
    return;
  }

  console.log("🌱 Seeding initial data...");

  await q(`
    INSERT INTO benefits (icon, title, description) VALUES
    ('DollarSign','Komisi Besar','Dapatkan persen menarik dari setiap klien yang closing'),
    ('GraduationCap','Training Lengkap','Kamu akan dibimbing langkah demi langkah'),
    ('Package','Materi Siap Pakai','Gambar, video, caption, bahkan skrip promosi sudah disediakan'),
    ('Settings','Dikerjakan Tim Ahli','Semua proyek dikerjakan oleh tim profesional kami'),
    ('Headphones','Support Langsung','Tim siap bantu kamu kapan pun butuh bantuan')
  `);

  await q(`
    INSERT INTO howitworks (icon, title, description) VALUES
    ('UserPlus','Daftar & Aktivasi Akun Reseller','Bayar Rp50.000 sekali seumur hidup'),
    ('BookOpen','Dapatkan Akses ke Materi Jualan','Panduan lengkap dan materi promosi siap pakai'),
    ('Megaphone','Promosikan Jasa ke Calon Klien','Gunakan materi yang sudah disediakan'),
    ('DollarSign','Dapat Komisi dari Setiap Penjualan','Website & aplikasi dikerjakan oleh tim kami')
  `);

  await q(`
    INSERT INTO testimonials (name, role, content, stars, avatar) VALUES
    ('Andi','Reseller Aktif','Saya join cuma 50 ribu, tapi hasilnya luar biasa!',5,'A'),
    ('Rina','Freelancer Digital','Semua materinya udah lengkap. Tinggal posting.',5,'R'),
    ('Budi','Mahasiswa','Cocok buat mahasiswa, gak perlu skill coding.',5,'B')
  `);

  await q(`
    INSERT INTO contactinfo (phone,email,instagram,address)
    VALUES ('08123456789','admin@bisnis.com','@username','Jl. Sudirman No.1')
  `);

  console.log("✅ Seed selesai");
}

/* ----------------------------------------------------------------------------
 * API ENDPOINTS
 * --------------------------------------------------------------------------*/
const getAll = table => async (req, res) => {
  try {
    const rows = await q(`SELECT * FROM ${table} ORDER BY id ASC`);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const createItem = (table, cols) => async (req, res) => {
  try {
    const values = cols.map(c => req.body[c]);
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(",");
    const sql = `
      INSERT INTO ${table} (${cols.join(",")})
      VALUES (${placeholders}) RETURNING *
    `;
    const [row] = await q(sql, values);
    res.status(201).json(row);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

app.get("/api/benefits", getAll("benefits"));
app.get("/api/howitworks", getAll("howitworks"));
app.get("/api/testimonials", getAll("testimonials"));
app.get("/api/contactinfo", getAll("contactinfo"));
app.get("/api/registrations", getAll("registrations"));

app.post(
  "/api/registrations",
  createItem("registrations", ["fullName", "email", "whatsapp", "city"])
);

/* ----------------------------------------------------------------------------
 * START SERVER (LISTEN DULU — WAJIB UNTUK RAILWAY)
 * --------------------------------------------------------------------------*/
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

/* ----------------------------------------------------------------------------
 * INIT DB (LOCAL ONLY)
 * --------------------------------------------------------------------------*/
if (process.env.NODE_ENV !== "production") {
  (async () => {
    await createTables();
    await seedData();
  })();
}
