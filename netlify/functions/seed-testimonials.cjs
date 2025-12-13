const { neon } = require("@netlify/neon");

exports.handler = async () => {
  const sql = neon();

  const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count FROM testimonials
  `;

  if (count > 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Testimonials already seeded" })
    };
  }

  await sql`
    INSERT INTO testimonials (name, role, content, stars, avatar) VALUES
    ('Andi', 'Reseller Aktif', 'Saya join cuma 50 ribu, tapi hasilnya luar biasa! Dalam sebulan dapat 3 klien dan komisi jutaan.', 5, 'A'),
    ('Rina', 'Freelancer Digital', 'Semua materinya sudah lengkap. Saya tinggal posting dan closing!', 5, 'R'),
    ('Budi', 'Mahasiswa', 'Cocok banget buat mahasiswa. Tidak perlu skill teknis!', 5, 'B')
  `;

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Testimonials seeded" })
  };
};
