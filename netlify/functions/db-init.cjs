const { neon } = require('@netlify/neon');

exports.handler = async () => {
  const sql = neon();

  await sql`
    CREATE TABLE IF NOT EXISTS resellers (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      created_at TIMESTAMP DEFAULT now()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      stars INTEGER NOT NULL,
      avatar TEXT
    );
  `;


  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  };
};
