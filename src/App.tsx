import React from 'react';
// 1. Import Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 2. Import semua komponen Anda (Jalur impor absolut)
import Navbar from './components/Navbar.tsx';
import HeroSection from './components/HeroSection.tsx';
import AboutProgram from './components/AboutProgram.tsx';
import HowItWorks from './components/HowItWorks.tsx';
import Benefits from './components/Benefits.tsx';
import Testimonials from './components/Testimonials.tsx';
import RegistrationForm from './components/RegistrationForm.tsx';
import FAQ from './components/FAQ.tsx';
import ClosingCTA from './components/ClosingCTA.tsx';
import Footer from './components/Footer.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';

// 3. Buat komponen baru untuk menampung Landing Page Anda
const MainLandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <section id="about">
        <AboutProgram />
      </section>
      <section id="howitworks">
        <HowItWorks />
      </section>
      <section id="benefits">
        <Benefits />
      </section>
      <section id="testimonials">
        <Testimonials />
      </section>
      <section id="gabung">
        <RegistrationForm />
      </section>
      <FAQ />
      <ClosingCTA />
      <footer id="footer">
        <Footer />
      </footer>
    </div>
  );
}

// 4. Ubah 'App' menjadi Router
function App() {
  return (
    // 'BrowserRouter' membungkus seluruh aplikasi Anda
    <BrowserRouter>
      {/* 'Routes' adalah tempat Anda mendefinisikan halaman */}
      <Routes>
        
        {/* Rute 1: Halaman Utama */}
        {/* Saat orang membuka 'situsanda.com/', tampilkan MainLandingPage */}
        <Route path="/" element={<MainLandingPage />} />

        {/* Rute 2: Halaman Admin Dashboard */}
        {/* Saat Anda login dan diarahkan ke '/admin-dashboard', tampilkan HANYA AdminDashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* Anda bisa menambahkan rute lain di sini jika perlu */}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;

