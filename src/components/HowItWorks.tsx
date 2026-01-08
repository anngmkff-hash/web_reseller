import React, { useState, useEffect } from "react";
import {
  UserPlus,
  BookOpen,
  Megaphone,
  DollarSign,
  Loader2,
  AlertCircle,
  Settings,
} from "lucide-react";

// ✅ API Backend (aman untuk local & production)
const API_URL = `${import.meta.env.VITE_API_URL}/api`;

type HowItWorksStepFromAPI = {
  id: number | string;
  icon: string;
  title: string;
  description: string;
};

type StepLookup = {
  iconComponent: React.ElementType;
  color: string;
};

const stepMap: { [key: string]: StepLookup } = {
  UserPlus: { iconComponent: UserPlus, color: "from-blue-500 to-blue-600" },
  BookOpen: { iconComponent: BookOpen, color: "from-purple-500 to-purple-600" },
  Megaphone: { iconComponent: Megaphone, color: "from-orange-500 to-orange-600" },
  DollarSign: { iconComponent: DollarSign, color: "from-green-500 to-green-600" },
  default: { iconComponent: Settings, color: "from-gray-400 to-gray-500" },
};

export default function HowItWorks() {
  const [steps, setSteps] = useState<HowItWorksStepFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const response = await fetch(`${API_URL}/howitworks`);
        if (!response.ok)
          throw new Error('Gagal mengambil data "Cara Kerja" dari server');
        const data: HowItWorksStepFromAPI[] = await response.json();
        setSteps(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSteps();
  }, []);

  if (isLoading) {
    return (
      <section id="howitworks" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Memuat data langkah kerja...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="howitworks" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md flex items-center max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <div>
              <strong>Error:</strong> {error}
              <p className="text-sm">
                Pastikan server backend (server.js) sedang berjalan.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="howitworks" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Cara Kerja Program
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hanya 4 langkah mudah untuk mulai menghasilkan uang
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => {
            const lookup = stepMap[step.icon] || stepMap.default;
            const IconComponent = lookup.iconComponent;

            return (
              <div
                key={step.id}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {index + 1}
                </div>

                <div
                  className={`w-16 h-16 bg-gradient-to-br ${lookup.color} rounded-xl flex items-center justify-center mb-6 mx-auto`}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {step.title}
                </h3>

                <p className="text-gray-600 text-center">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
