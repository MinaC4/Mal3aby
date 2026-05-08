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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-900 transition-colors duration-300" dir="rtl">
      <Navbar />
      <main className="flex-1">
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
