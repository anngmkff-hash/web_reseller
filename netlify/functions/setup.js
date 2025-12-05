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
