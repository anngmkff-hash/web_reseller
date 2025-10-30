import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  Instagram, 
  Loader2, 
  AlertCircle,
  Code2 // Icon baru dari footer Anda
} from 'lucide-react';

// Alamat base URL API Backend kita
const API_URL = 'http://localhost:5000/api';

// Tipe Data
type ContactInfo = {
  id: number | string;
  phone: string;
  email: string;
  instagram: string;
  address: string; // Dibiarkan saja, meskipun tidak terpakai
};

// Komponen
export default function Footer() {
  const [info, setInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/contactinfo`);
        if (!response.ok) throw new Error('Gagal mengambil data info kontak');
        const data = await response.json();
        setInfo(data[0] || null); // Ambil data pertama
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  // Fungsi scroll dari kode baru Anda
  const scrollToSection = (id: string) => {
    // Pastikan elemen ada sebelum di-scroll
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn(`Elemen dengan id "${id}" tidak ditemukan.`);
    }
  };


  if (loading) {
    return (
      <footer className="bg-gray-900 text-gray-300 h-48 flex items-center justify-center">
        <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600" />
      </footer>
    );
  }

  if (error || !info) {
    return (
       <footer className="bg-gray-900 text-gray-300 h-48 flex flex-col items-center justify-center bg-red-900/50">
        <AlertCircle className="w-8 h-8 mx-auto text-red-500" />
        <p className="mt-2 text-red-400">
          {error || 'Tidak dapat memuat info kontak footer.'}
        </p>
      </footer>
    );
  }

  // Format link Instagram
  const instagramLink = info.instagram.startsWith('@')
    ? `https://instagram.com/${info.instagram.substring(1)}`
    : `https://instagram.com/${info.instagram}`;
  
  // Format link WhatsApp
  const waLink = `https://wa.me/${info.phone.replace(/[^0-9]/g, '')}`;

  return (
    <>
      {/* --- Section Hubungi Kami SUDAH DIHAPUS --- */}

      {/* --- Section Footer (DINAMIS) --- */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            
            {/* Kolom 1: Tentang */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-8 h-8 text-blue-500" />
                <span className="text-xl font-bold text-white">ResellerPro</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Program reseller terpercaya untuk memulai bisnis digital dengan modal terjangkau.
              </p>
            </div>

            {/* Kolom 2: Navigasi */}
            <div>
              <h4 className="text-white font-semibold mb-4">Navigasi</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="hover:text-blue-400 transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('benefits')}
                    className="hover:text-blue-400 transition-colors"
                  >
                    Keuntungan
                  </button>
                </li>
                <li>
                  {/* Link 'Daftar' ini perlu ID section form pendaftaran Anda. 
                      Saya asumsikan ID-nya 'registration-form' untuk sementara */}
                  <button
                    onClick={() => scrollToSection('registration-form')} 
                    className="hover:text-blue-400 transition-colors"
                  >
                    Daftar
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Kolom 3: Dukungan (Statis, tapi diubah jadi button) */}
            <div>
              <h4 className="text-white font-semibold mb-4">Dukungan</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('faq')} className="hover:text-blue-400 transition-colors">FAQ</button>
                </li>
                 <li>
                  {/* Link 'Kontak' ini perlu ID section. 
                      Karena section 'contact' dihapus, mungkin ini bisa dihapus?
                      Atau scroll ke 'faq' saja? Untuk sementara saya hapus. */}
                </li>
                 <li>
                  <button onClick={() => scrollToSection('about')} className="hover:text-blue-400 transition-colors">Tentang Kami</button>
                </li>
              </ul>
            </div>

            {/* Kolom 4: Hubungi Kami (DINAMIS) */}
            <div>
              <h4 className="text-white font-semibold mb-4">Hubungi Kami</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    {info.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <a href={`mailto:${info.email}`} className="hover:text-blue-400 transition-colors">
                    {info.email}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-blue-500" />
                  <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    {info.instagram}
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              Copyright © {new Date().getFullYear()} ResellerPro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

