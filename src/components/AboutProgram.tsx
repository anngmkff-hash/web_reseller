import { CheckCircle2 } from 'lucide-react';

export default function AboutProgram() {
  const features = [
    'Biaya sangat terjangkau: hanya Rp50.000',
    'Komisi besar dari setiap klien yang kamu bawa',
    'Semua materi promosi sudah kami siapkan',
    'Panduan lengkap cara jualan step-by-step',
    'Support langsung dari tim'
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Kenapa Harus Jadi Reseller Kami?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Program ini dibuat untuk kamu yang ingin punya penghasilan tambahan dari dunia digital tanpa perlu skill teknis.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Cukup bayar biaya registrasi <span className="font-bold text-blue-600">Rp50.000 (sekali seumur hidup)</span>, lalu kamu langsung mendapat akses ke semua materi promosi, pelatihan, dan dukungan dari tim profesional kami.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 sm:p-12 shadow-lg animate-fade-in">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Keunggulan Program</h3>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-gray-800 text-lg">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
