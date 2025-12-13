const { neon } = require('@netlify/neon');

exports.handler = async () => {
  try {
    const sql = neon();

    const resellers = await sql`
      SELECT
        id,
        name,
        email,
        phone,
        created_at
      FROM resellers
      ORDER BY created_at DESC
    `;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resellers),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch resellers',
        detail: err.message,
      }),
    };
  }
};
