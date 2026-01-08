import React, { useState, useEffect } from 'react';
import { Star, Loader2, AlertCircle, Quote } from 'lucide-react'; // Menambahkan Quote

// Alamat base URL API Backend kita
const API_URL = 'http://localhost:5000/api';

// --- Tipe Data ---

// Tipe data yang kita terima dari API (backend)
type TestimonialFromAPI = {
  id: number | string;
  name: string;
  role: string;
  content: string; // Diubah dari 'quote' menjadi 'content'
  stars: number;
  avatar: string | null; // Ini adalah inisial, misal: "A"
};

// --- Komponen Testimonials (Versi Dinamis) ---
export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_URL}/testimonials`);
        if (!response.ok) {
          throw new Error('Gagal mengambil data testimoni dari server');
        }
        const data: TestimonialFromAPI[] = await response.json();
        setTestimonials(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // --- Render ---

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Memuat testimoni...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="testimonials" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md flex items-center max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <div>
              <strong>Error:</strong> {error}
              <p className="text-sm">Pastikan server backend (server.js) Anda sedang berjalan.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Testimoni & Hasil Nyata
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Bergabunglah dengan ratusan reseller sukses kami
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => {
            // Dapatkan inisial dari 'avatar' atau dari huruf pertama 'name'
            const initial = item.avatar || item.name.charAt(0).toUpperCase() || '?';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Quote className="absolute top-6 right-6 w-12 h-12 text-blue-100" />

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {initial}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                    <p className="text-gray-600 text-sm">{item.role}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(item.stars)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed italic">
                  "{item.content}"
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

