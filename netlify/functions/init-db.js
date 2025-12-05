// Script untuk inisialisasi database (run sekali)
// Jalankan dengan: node netlify/functions/init-db.js

const { initDatabase } = require('./db');

(async () => {
  try {
    console.log('🚀 Starting database initialization...');
    await initDatabase();
    console.log('✅ Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
})();
