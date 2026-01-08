import React, { useEffect, useState } from "react";
import {
  UserPlus,
  BookOpen,
  Megaphone,
  DollarSign,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

type StepFromAPI = {
  id: number;
  icon: string;
  title: string;
  description: string;
};

const iconMap: Record<string, React.ElementType> = {
  UserPlus,
  BookOpen,
  Megaphone,
  DollarSign,
  default: BookOpen,
};

export default function HowItWorks() {
  const [steps, setSteps] = useState<StepFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/howitworks`);
        if (!res.ok) throw new Error("Gagal memuat data");
        setSteps(await res.json());
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
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Cara Kerja
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((s) => {
            const Icon = iconMap[s.icon] || iconMap.default;
            return (
              <div key={s.id} className="bg-white p-6 rounded-xl shadow">
                <Icon className="w-10 h-10 mb-4 text-blue-600" />
                <h3 className="font-bold text-xl mb-2">{s.title}</h3>
                <p className="text-gray-600">{s.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
