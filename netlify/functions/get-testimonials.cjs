const { neon } = require("@netlify/neon");

exports.handler = async () => {
  try {
    const sql = neon();

    const testimonials = await sql`
      SELECT id, name, role, content, stars, avatar
      FROM testimonials
      ORDER BY id ASC
    `;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testimonials)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
