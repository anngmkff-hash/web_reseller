import React, { useState } from 'react';
import { User, Lock, X } from 'lucide-react'; // Tambahkan ikon

// Daftar item navigasi (tetap sama)
const navItems = [
  { name: 'Home', href: '#' },
  { name: 'Alasan', href: '#about' },
  { name: 'Cara Kerja', href: '#howitworks' },
  { name: 'Keuntungan', href: '#benefits' },
  { name: 'Testimoni', href: '#testimonials' },
  { name: 'Daftar', href: '#gabung' },
  { name: 'Bantuan', href: '#footer' },
];

// --- Komponen Login Modal (Baru) ---
// Kita buat di dalam file ini agar rapi
type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  error: string;
};

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  email,
  setEmail,
  password,
  setPassword,
  error,
}) => {
  if (!isOpen) return null;

  return (
    // Overlay
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      {/* Konten Modal */}
      <div className="relative bg-white text-black w-full max-w-md p-8 rounded-2xl shadow-xl">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Admin Login
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="w-5 h-5 text-gray-400" />
              </span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@gmail.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="w-5 h-5 text-gray-400" />
              </span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          {/* Tampilkan Error jika ada */}
          {error && (
            <p className="text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- Komponen Navbar Utama ---
const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // --- State Baru untuk Login ---
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // --- Akhir State Baru ---

  // Fungsi handle smooth scroll (tetap sama)
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
      return;
    }
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  // --- Fungsi Baru untuk Handle Login ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Hentikan form dari reload halaman
    
    // Ini adalah pengecekan di sisi klien (TIDAK AMAN!)
    if (email === 'admin@gmail.com' && password === 'admin123') {
      setError("");
      setIsLoginModalOpen(false);
      // Arahkan ke dashboard admin
      // Ganti '/admin' dengan URL dashboard Anda, misal 'http://localhost:PORT_ADMIN'
      window.location.href = '/admin-dashboard'; 
    } else {
      // Jika salah, tampilkan error
      setError("Email atau password salah. Silakan coba lagi.");
    }
  };
  // --- Akhir Fungsi Baru ---

  return (
    <header className="bg-blue-700 text-white fixed top-0 left-0 w-full z-50 shadow-lg">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo (tetap sama) */}
        <a
          href="#"
          className="text-2xl font-bold text-white"
          onClick={(e) => handleSmoothScroll(e, '#')}
        >
          Reseller<span className="text-yellow-400">Web</span>
        </a>

        {/* Navigasi Desktop (tetap sama) */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="hover:text-gray-200 transition-colors duration-200"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          
          {/* Tombol Login Desktop --- PERUBAHAN DISINI --- */}
          <button
            onClick={() => setIsLoginModalOpen(true)} // 1. Ubah jadi tombol
            className="border border-white text-white font-semibold py-2 px-5 rounded-lg hover:bg-white hover:text-blue-700 transition-colors duration-200"
          >
            Login
          </button>
        </div>

        {/* Tombol Menu Mobile (tetap sama) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Dropdown Menu Mobile (tetap sama) */}
      <div
        className={`md:hidden ${
          isMobileMenuOpen ? 'block' : 'hidden'
        } bg-blue-700 absolute w-full shadow-lg pb-4`}
      >
        <ul className="flex flex-col items-center space-y-4 pt-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className="hover:text-gray-200 transition-colors duration-200 text-lg"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
        
        {/* Tombol Login Mobile --- PERUBAHAN DISINI --- */}
        <div className="mt-6 px-6">
          <button
            onClick={() => {
              setIsLoginModalOpen(true); // 1. Buka modal
              setIsMobileMenuOpen(false); // 2. Tutup menu mobile
            }}
            className="block text-center border border-white text-white font-semibold py-3 px-5 rounded-lg hover:bg-white hover:text-blue-700 transition-colors duration-200 w-full"
          >
            Login
          </button>
        </div>
      </div>

      {/* --- Render Modal (Baru) --- */}
      {/* Ini diletakkan di akhir agar tampil di atas segalanya */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setError(""); // Bersihkan error saat modal ditutup
        }}
        onSubmit={handleLogin}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        error={error}
      />
    </header>
  );
};

export default Navbar;
