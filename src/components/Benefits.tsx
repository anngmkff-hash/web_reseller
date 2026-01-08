import React, { useState, useEffect } from "react";
import {
  DollarSign,
  GraduationCap,
  Package,
  Settings,
  Headphones,
  Loader2,
  AlertCircle,
} from "lucide-react";

// --- Konstanta API Backend ---
const API_URL = `${import.meta.env.VITE_API_URL}/api`;

// --- Tipe Data ---
type BenefitFromAPI = {
  id: number;
  icon: string;
  title: string;
  description: string;
};

type BenefitLookup = {
  iconComponent: React.ElementType;
  bgColor: string;
};

// --- Peta Ikon dan Warna ---
const benefitMap: Record<string, BenefitLookup> = {
  DollarSign: { iconComponent: DollarSign, bgColor: "bg-green-500" },
  GraduationCap: { iconComponent: GraduationCap, bgColor: "bg-blue-500" },
  Package: { iconComponent: Package, bgColor: "bg-purple-500" },
  Settings: { iconComponent: Settings, bgColor: "bg-orange-500" },
  Headphones: { iconComponent: Headphones, bgColor: "bg-pink-500" },
  default: { iconComponent: Package, bgColor: "bg-gray-500" },
};

export default function Benefits() {
  const [benefits, setBenefits] = useState<BenefitFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // 🔒 Cegah setState setelah unmount
    const fetchBenefits = async () => {
      try {
        const response = await fetch(`${API_URL}/benefits`);
        if (!response.ok) throw new Error("Gagal mengambil data dari server");

        const data: BenefitFromAPI[] = await response.json();

        if (isMounted) {
          // 🔧 Pastikan tidak ada data duplikat berdasarkan id
          const uniqueData = data.filter(
            (item, index, self) =>
              index === self.findIndex((b) => b.id === item.id)
          );
          setBenefits(uniqueData);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchBenefits();
    return () => {
      isMounted = false;
    };
  }, []);

  // --- Tampilan Loading ---
  if (isLoading) {
    return (
      <section id="benefits" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Memuat data keuntungan...</p>
        </div>
      </section>
    );
  }

  // --- Tampilan Error ---
  if (error) {
    return (
      <section id="benefits" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md flex items-center max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <div>
              <strong>Error:</strong> {error}
              <p className="text-sm">
                Pastikan server backend (server.js) Anda sedang berjalan.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- Tampilan Normal ---
  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Keuntungan Bergabung
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Investasi Rp50.000 dengan return yang jauh lebih besar
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((item, index) => {
            const lookup = benefitMap[item.icon] || benefitMap.default;
            const IconComponent = lookup.iconComponent;
            const bgColor = lookup.bgColor;

            return (
              <div
                key={item.id}
                className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 ${bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bagian Nilai Tambah */}
        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 sm:p-12 text-white shadow-2xl animate-fade-in">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">
              Nilai yang Kamu Dapatkan
            </h3>
            <p className="text-xl mb-6 text-blue-100">
              Modal Rp50.000 = Akses Seumur Hidup + Peluang Penghasilan Tanpa
              Batas
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">∞</div>
                <div className="text-sm text-blue-100">Potensi Klien</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-sm text-blue-100">Dukungan Tim</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">0</div>
                <div className="text-sm text-blue-100">
                  Skill Teknis Wajib
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
