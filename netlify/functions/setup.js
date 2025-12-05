const { initDatabase } = require('./db');

exports.handler = async () => {
  try {
    console.log('Starting database initialization...');
    await initDatabase();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true,
        message: 'Database initialized successfully! Tables created and seeded with initial data.' 
      })
    };
  } catch (error) {
    console.error('Database initialization error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: false,
        error: error.message,
        details: error.stack
      })
    };
  }
};
```

5. **Commit:** "Add setup function for database initialization"
6. **Tunggu Netlify deploy selesai** (1-2 menit)

---

# 🔧 **STEP 2: Jalankan Setup Database**

Setelah deploy selesai, akses URL ini di browser:
```
https://YOUR_SITE_NAME.netlify.app/.netlify/functions/setup
