import React, { useState, useEffect } from "react";
import { Star, Loader2, AlertCircle, Quote } from "lucide-react";

// ✅ PAKAI ENV VITE (WAJIB)
const API_URL = `${import.meta.env.VITE_API_URL}/api`;

// --- Tipe Data ---
type TestimonialFromAPI = {
  id: number | string;
  name: string;
  role: string;
  content: string;
  stars: number;
  avatar: string | null;
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_URL}/testimonials`);
        if (!response.ok) {
          throw new Error("Gagal mengambil data testimoni");
        }

        const data: TestimonialFromAPI[] = await response.json();
        if (mounted) setTestimonials(data);
      } catch (err: any) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchTestimonials();
    return () => {
      mounted = false;
    };
  }, []);

  // --- Loading ---
  if (isLoading) {
    return (
      <section className="py-20 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
        <p className="mt-4 text-gray-600">Memuat testimoni...</p>
      </section>
    );
  }

  // --- Error ---
  if (error) {
    return (
      <section className="py-20">
        <div className="max-w-xl mx-auto p-4 bg-red-100 text-red-700 border border-red-300 rounded flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </section>
    );
  }

  // --- Normal ---
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Testimoni & Hasil Nyata</h2>
          <p className="text-xl text-gray-600">
            Bergabunglah dengan reseller yang sudah merasakan hasilnya
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => {
            const initial = item.avatar || item.name.charAt(0).toUpperCase();

            return (
              <div
                key={item.id}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 relative"
              >
                <Quote className="absolute top-6 right-6 w-10 h-10 text-blue-100" />

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                    {initial}
                  </div>
                  <div>
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: item.stars }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <p className="italic text-gray-700">"{item.content}"</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
