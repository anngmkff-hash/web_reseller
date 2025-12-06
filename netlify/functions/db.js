// Database Helper untuk Netlify Functions
const { Pool } = require('pg');

// Cek semua kemungkinan nama environment variable
const databaseUrl = process.env.NETLIFY_DATABASE_URL || 
                    process.env.DATABASE_URL || 
                    process.env.NEON_DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL not found in environment variables!');
  console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('DATA')));
}

// Connection pool untuk PostgreSQL
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper untuk inisialisasi database
const initDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Initializing database...');
    
    // Buat semua tabel
    await client.query(`
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
        fullName TEXT NOT NULL,
        email TEXT NOT NULL,
        whatsapp TEXT NOT NULL,
        city TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tables created successfully');

    // Cek apakah data sudah ada
    const { rows } = await client.query('SELECT COUNT(*) as count FROM benefits');
    
    if (parseInt(rows[0].count) === 0) {
      console.log('🌱 Seeding initial data...');
      
      // Seed benefits
      await client.query(`
        INSERT INTO benefits (icon, title, description) VALUES
        ('DollarSign', 'Komisi Besar', 'Dapatkan persen menarik dari setiap klien yang closing'),
        ('GraduationCap', 'Training Lengkap', 'Kamu akan dibimbing langkah demi langkah'),
        ('Package', 'Materi Siap Pakai', 'Gambar, video, caption, bahkan skrip promosi sudah disediakan'),
        ('Settings', 'Dikerjakan Tim Ahli', 'Semua proyek dikerjakan oleh tim profesional kami'),
        ('Headphones', 'Support Langsung', 'Tim siap bantu kamu kapan pun butuh bantuan')
      `);

      // Seed howitworks
      await client.query(`
        INSERT INTO howitworks (icon, title, description) VALUES
        ('UserPlus', 'Daftar & Aktivasi Akun Reseller', 'Bayar Rp50.000 sekali seumur hidup'),
        ('BookOpen', 'Dapatkan Akses ke Materi Jualan', 'Panduan lengkap dan materi promosi siap pakai'),
        ('Megaphone', 'Promosikan Jasa ke Calon Klien', 'Gunakan materi yang sudah disediakan'),
        ('DollarSign', 'Dapat Komisi dari Setiap Penjualan', 'Website & aplikasi dikerjakan oleh tim kami')
      `);

      // Seed testimonials
      await client.query(`
        INSERT INTO testimonials (name, role, content, stars, avatar) VALUES
        ('Andi', 'Reseller Aktif', 'Saya join cuma 50 ribu, tapi hasilnya luar biasa! Dalam sebulan dapat 3 klien dan komisi jutaan.', 5, 'A'),
        ('Rina', 'Freelancer Digital', 'Semua materinya udah lengkap. Saya tinggal posting dan closing!', 5, 'R'),
        ('Budi', 'Mahasiswa', 'Program ini cocok banget buat mahasiswa yang mau cari penghasilan tambahan. Gak perlu skill coding!', 5, 'B')
      `);

      // Seed contactinfo
      await client.query(`
        INSERT INTO contactinfo (phone, email, instagram, address) VALUES
        ('08123456789', 'admin@bisnis.com', '@username', 'Jl. Jendral Sudirman No. 1, Jakarta')
      `);

      console.log('✅ Initial data seeded successfully');
    } else {
      console.log('✅ Data already exists, skipping seed');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Standard response headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

// Helper untuk handle CORS preflight
const handleOptions = () => ({
  statusCode: 200,
  headers,
  body: ''
});

// Helper untuk success response
const successResponse = (data, statusCode = 200) => ({
  statusCode,
  headers,
  body: JSON.stringify(data)
});

// Helper untuk error response
const errorResponse = (error, statusCode = 500) => ({
  statusCode,
  headers,
  body: JSON.stringify({ 
    error: error.message || 'Internal server error' 
  })
});

module.exports = {
  pool,
  initDatabase,
  headers,
  handleOptions,
  successResponse,
  errorResponse
};
