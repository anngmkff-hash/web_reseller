const { neon } = require('@netlify/neon');

exports.handler = async (event) => {
  try {
    const sql = neon();
    const data = JSON.parse(event.body);

    if (!data.name || !data.email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'name and email are required' })
      };
    }

    await sql`
      INSERT INTO resellers (name, email, phone)
      VALUES (${data.name}, ${data.email}, ${data.phone || null})
    `;

    return {
      statusCode: 201,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
