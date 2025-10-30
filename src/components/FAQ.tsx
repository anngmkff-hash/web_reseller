import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Apakah ada biaya pendaftaran?',
      answer: 'Ya, cukup Rp50.000 untuk aktivasi akun reseller seumur hidup. Ini adalah investasi sekali bayar yang memberikan akses penuh ke semua materi dan dukungan.'
    },
    {
      question: 'Apakah saya perlu bisa bikin website?',
      answer: 'Tidak perlu! Kami yang mengerjakan semua proyek. Kamu hanya fokus ke promosi dan komunikasi dengan klien.'
    },
    {
      question: 'Berapa besar komisinya?',
      answer: 'Komisi bervariasi tergantung proyek, mulai dari ratusan ribu hingga jutaan rupiah per klien. Semakin banyak klien yang kamu bawa, semakin besar penghasilan kamu.'
    },
    {
      question: 'Apa saja yang saya dapat setelah mendaftar?',
      answer: 'Kamu akan mendapat akses ke semua materi promosi (gambar, video, caption, skrip), training lengkap step-by-step, dan support langsung dari tim profesional kami.'
    },
    {
      question: 'Bagaimana cara pembayarannya?',
      answer: 'Setelah mengisi formulir pendaftaran, tim kami akan menghubungi kamu untuk proses pembayaran yang mudah dan aman.'
    },
    {
      question: 'Berapa lama proses aktivasi akun?',
      answer: 'Setelah pembayaran terverifikasi, akun reseller kamu akan aktif dalam waktu 1x24 jam dan kamu langsung bisa mulai promosi.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Pertanyaan Umum
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Jawaban untuk pertanyaan yang sering ditanyakan
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 text-lg pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-blue-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
