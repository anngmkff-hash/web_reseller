// netlify/functions/get-benefits.cjs
exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify([
      {
        id: 1,
        icon: "DollarSign",
        title: "Modal Terjangkau",
        description: "Cukup Rp50.000 untuk mulai bisnis reseller"
      },
      {
        id: 2,
        icon: "GraduationCap",
        title: "Training Gratis",
        description: "Akses materi dan pendampingan seumur hidup"
      },
      {
        id: 3,
        icon: "Headphones",
        title: "Support Aktif",
        description: "Didampingi tim setiap hari"
      }
    ])
  };
};
