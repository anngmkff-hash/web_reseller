const { neon } = require('@netlify/neon');

exports.handler = async () => {
  const sql = neon(); // otomatis pakai NETLIFY_DATABASE_URL

  const result = await sql`SELECT now() AS time`;

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
