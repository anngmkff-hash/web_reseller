import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  // Fungsi untuk membuka WhatsApp di tab baru
  const openWhatsApp = () => {
    const phoneNumber = '6281234567890'; // Diambil dari gambar kontak Anda
    const message = encodeURIComponent(
      'Halo ResellerHub, saya tertarik untuk bergabung menjadi reseller. Mohon informasinya.'
    );
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  // Fungsi ini tetap ada untuk tombol "Lihat Keuntungannya"
  const scrollToBenefits = () => {
    document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1GU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAzMmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA6cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAzMmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-40"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-64 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-blue-700/30 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Program Reseller Terbatas</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Jadi Reseller Website & Aplikasi —
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400"> Komisi Besar</span>, Modal Cuma Rp50.000!
            </h1>

            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
              Kami bantu kamu mulai bisnis digital sendiri. Dapatkan materi jualan lengkap, panduan, dan dukungan penuh. Kamu cukup promosi — kami yang kerjakan proyeknya.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={openWhatsApp} // --- DIUBAH: dari scrollToForm ke openWhatsApp ---
                className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Gabung Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={scrollToBenefits}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg border border-white/30 transition-all duration-300 hover:border-white/50"
              >
                Lihat Keuntungannya
              </button>
            </div>
          </div>

          <div className="hidden lg:flex justify-center animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
                    <div className="text-3xl font-bold mb-2">Rp50K</div>
                    <div className="text-sm text-blue-100">Modal Sekali Bayar</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
                    <div className="text-3xl font-bold mb-2">Jutaan</div>
                    <div className="text-sm text-green-100">Potensi Komisi</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-center transform hover:scale-1to-purple-6005 transition-transform">
                    <div className="text-3xl font-bold mb-2">Lengkap</div>
                    <div className="text-sm text-purple-100">Materi Promosi</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
                    <div className="text-3xl font-bold mb-2">24/7</div>
                    <div className="text-sm text-orange-100">Support Tim</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}

