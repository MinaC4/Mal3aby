import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PitchesPage from './pages/PitchesPage';
import PitchDetailPage from './pages/PitchDetailPage';
import BookingPage from './pages/BookingPage';
import BookingSuccessPage from './pages/BookingSuccessPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f0d]" dir="rtl">
      {/* Global background glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/15 rounded-full blur-[120px]" />
      </div>
      <Navbar />
      <main className="flex-1 relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pitches" element={<PitchesPage />} />
          <Route path="/pitches/:id" element={<PitchDetailPage />} />
          <Route path="/booking/:pitchId" element={<BookingPage />} />
          <Route path="/booking-success" element={<BookingSuccessPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
