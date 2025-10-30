// --- IMPORT MODULE ---
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// --- KONEKSI KE DATABASE ---
const db = new sqlite3.Database("./reseller.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("✅ Connected to the SQLite database.");
    runDb();
  }
});

// --- BUAT TABEL (JIKA BELUM ADA) ---
const createTables = () => {
  const tables = `
    CREATE TABLE IF NOT EXISTS benefits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      icon TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS howitworks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      icon TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      stars INTEGER NOT NULL,
      avatar TEXT
    );

    CREATE TABLE IF NOT EXISTS contactinfo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT,
      email TEXT,
      instagram TEXT,
      address TEXT
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      city TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.exec(tables, (err) => {
    if (err) console.error("❌ Error creating tables:", err.message);
    else console.log("✅ All tables checked/created successfully.");
  });
};

// --- ISI DATA AWAL (JIKA KOSONG) ---
const seedData = () => {
  db.get("SELECT COUNT(*) as count FROM benefits", (err, row) => {
    if (err) {
      console.error("Error checking benefits count:", err.message);
      return;
    }

    if (row.count === 0) {
      console.log("🌱 Database kosong — seeding initial data...");

      const benefits = [
        { icon: "DollarSign", title: "Komisi Besar", description: "Dapatkan persen menarik dari setiap klien yang closing" },
        { icon: "GraduationCap", title: "Training Lengkap", description: "Kamu akan dibimbing langkah demi langkah" },
        { icon: "Package", title: "Materi Siap Pakai", description: "Gambar, video, caption, bahkan skrip promosi sudah disediakan" },
        { icon: "Settings", title: "Dikerjakan Tim Ahli", description: "Semua proyek dikerjakan oleh tim profesional kami" },
        { icon: "Headphones", title: "Support Langsung", description: "Tim siap bantu kamu kapan pun butuh bantuan" },
      ];
      const stmtBenefits = db.prepare("INSERT INTO benefits (icon, title, description) VALUES (?, ?, ?)");
      benefits.forEach((b) => stmtBenefits.run(b.icon, b.title, b.description));
      stmtBenefits.finalize();

      const howitworks = [
        { icon: "UserPlus", title: "Daftar & Aktivasi Akun Reseller", description: "Bayar Rp50.000 sekali seumur hidup" },
        { icon: "BookOpen", title: "Dapatkan Akses ke Materi Jualan", description: "Panduan lengkap dan materi promosi siap pakai" },
        { icon: "Megaphone", title: "Promosikan Jasa ke Calon Klien", description: "Gunakan materi yang sudah disediakan" },
        { icon: "DollarSign", title: "Dapat Komisi dari Setiap Penjualan", description: "Website & aplikasi dikerjakan oleh tim kami" },
      ];
      const stmtHowItWorks = db.prepare("INSERT INTO howitworks (icon, title, description) VALUES (?, ?, ?)");
      howitworks.forEach((h) => stmtHowItWorks.run(h.icon, h.title, h.description));
      stmtHowItWorks.finalize();

      const testimonials = [
        { name: "Andi", role: "Reseller Aktif", content: "Saya join cuma 50 ribu, tapi hasilnya luar biasa! Dalam sebulan dapat 3 klien dan komisi jutaan.", stars: 5, avatar: "A" },
        { name: "Rina", role: "Freelancer Digital", content: "Semua materinya udah lengkap. Saya tinggal posting dan closing!", stars: 5, avatar: "R" },
        { name: "Budi", role: "Mahasiswa", content: "Program ini cocok banget buat mahasiswa yang mau cari penghasilan tambahan. Gak perlu skill coding!", stars: 5, avatar: "B" },
      ];
      const stmtTestimonials = db.prepare("INSERT INTO testimonials (name, role, content, stars, avatar) VALUES (?, ?, ?, ?, ?)");
      testimonials.forEach((t) => stmtTestimonials.run(t.name, t.role, t.content, t.stars, t.avatar));
      stmtTestimonials.finalize();

      db.run("INSERT INTO contactinfo (phone, email, instagram, address) VALUES (?, ?, ?, ?)",
        ["08123456789", "admin@bisnis.com", "@username", "Jl. Jendral Sudirman No. 1, Jakarta"]
      );

      console.log("✅ Data awal berhasil dimasukkan.");
    } else {
      console.log("✅ Data sudah ada, skip seeding.");
    }
  });
};

// --- JALANKAN SETUP DATABASE ---
const runDb = () => {
  db.serialize(() => {
    createTables();
    seedData();
  });
};

// --- HELPER FUNCTIONS ---
const getAll = (table) => (req, res) => {
  db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
};

const createItem = (table, params) => (req, res) => {
  const placeholders = params.map(() => "?").join(",");
  const values = params.map((p) => req.body[p]);
  const sql = `INSERT INTO ${table} (${params.join(",")}) VALUES (${placeholders})`;

  db.run(sql, values, function (err) {
    if (err) res.status(400).json({ error: err.message });
    else res.status(201).json({ id: this.lastID, ...req.body });
  });
};

const updateItem = (table, params) => (req, res) => {
  const updates = params.map((p) => `${p} = ?`).join(",");
  const values = [...params.map((p) => req.body[p]), req.params.id];
  const sql = `UPDATE ${table} SET ${updates} WHERE id = ?`;

  db.run(sql, values, function (err) {
    if (err) res.status(400).json({ error: err.message });
    else if (this.changes === 0) res.status(404).json({ error: "Item not found" });
    else res.json({ id: req.params.id, ...req.body });
  });
};

const deleteItem = (table) => (req, res) => {
  db.run(`DELETE FROM ${table} WHERE id = ?`, req.params.id, function (err) {
    if (err) res.status(500).json({ error: err.message });
    else if (this.changes === 0) res.status(404).json({ error: "Item not found" });
    else res.status(200).json({ message: "Item deleted successfully" });
  });
};

// --- ENDPOINTS ---
// 1. Benefits
const benefitParams = ["icon", "title", "description"];
app.get("/api/benefits", getAll("benefits"));
app.post("/api/benefits", createItem("benefits", benefitParams));
app.put("/api/benefits/:id", updateItem("benefits", benefitParams));
app.delete("/api/benefits/:id", deleteItem("benefits"));

// 2. How It Works
const howItWorksParams = ["icon", "title", "description"];
app.get("/api/howitworks", getAll("howitworks"));
app.post("/api/howitworks", createItem("howitworks", howItWorksParams));
app.put("/api/howitworks/:id", updateItem("howitworks", howItWorksParams));
app.delete("/api/howitworks/:id", deleteItem("howitworks"));

// 3. Testimonials
const testimonialParams = ["name", "role", "content", "stars", "avatar"];
app.get("/api/testimonials", getAll("testimonials"));
app.post("/api/testimonials", createItem("testimonials", testimonialParams));
app.put("/api/testimonials/:id", updateItem("testimonials", testimonialParams));
app.delete("/api/testimonials/:id", deleteItem("testimonials"));

// 4. Contact Info
const contactParams = ["phone", "email", "instagram", "address"];
app.get("/api/contactinfo", getAll("contactinfo"));
app.put("/api/contactinfo/:id", updateItem("contactinfo", contactParams));

// 5. Registrations (TANPA STATUS)
const registrationParams = ["fullName", "email", "whatsapp", "city"];
app.get("/api/registrations", getAll("registrations"));
app.post("/api/registrations", createItem("registrations", registrationParams));
app.put("/api/registrations/:id", updateItem("registrations", registrationParams));
app.delete("/api/registrations/:id", deleteItem("registrations"));

// --- JALANKAN SERVER ---
app.listen(port, () => {
  console.log(`🚀 Backend server running at http://localhost:${port}`);
});
