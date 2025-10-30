import { ArrowRight, Clock } from 'lucide-react';

export default function ClosingCTA() {
  const scrollToForm = () => {
    document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAzMmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAzMmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Penawaran Terbatas</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Kesempatan Tidak Datang Dua Kali!
          </h2>

          <p className="text-xl sm:text-2xl mb-8 text-orange-50 leading-relaxed">
            Hanya dengan <span className="font-bold text-white">Rp50.000</span> kamu bisa mulai bisnis digital sendiri, tanpa perlu pusing bikin website. Kami bantu kamu sampai sukses!
          </p>

          <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-8 mb-10">
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <div className="text-4xl font-bold mb-2">Rp50.000</div>
                <div className="text-orange-100">Investasi Sekali Bayar</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">Seumur Hidup</div>
                <div className="text-orange-100">Akses Tanpa Batas</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">Unlimited</div>
                <div className="text-orange-100">Potensi Penghasilan</div>
              </div>
            </div>
          </div>

          <button
            onClick={scrollToForm}
            className="group bg-white text-orange-600 font-bold px-10 py-5 rounded-lg text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center gap-3"
          >
            Daftar Sekarang & Mulai Dapat Penghasilan
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>

          <p className="mt-6 text-orange-100">
            Sudah ratusan reseller bergabung dan menghasilkan jutaan rupiah
          </p>
        </div>
      </div>
    </section>
  );
}
