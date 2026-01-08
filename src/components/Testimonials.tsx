import React, { useEffect, useState } from "react";
import { Star, Loader2, AlertCircle } from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

type Testimonial = {
  id: number;
  name: string;
  role: string;
  content: string;
  stars: number;
};

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/testimonials`);
        if (!res.ok) throw new Error("Gagal memuat testimoni");
        setItems(await res.json());
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <section className="py-16 text-center">
        <Loader2 className="mx-auto animate-spin" />
      </section>
    );

  if (error)
    return (
      <section className="py-16 text-center text-red-600">
        <AlertCircle className="inline mr-2" /> {error}
      </section>
    );

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Testimoni Reseller
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((t) => (
            <div key={t.id} className="border rounded-xl p-6 shadow-sm">
              <div className="flex mb-3">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">“{t.content}”</p>
              <div className="font-bold">{t.name}</div>
              <div className="text-sm text-gray-500">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
