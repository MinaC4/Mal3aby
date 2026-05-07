import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, ChevronLeft, ChevronRight, Clock, Calendar, Check, Phone, CreditCard } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import type { Pitch } from '@/types';

export default function PitchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: pitch, loading } = useApi<Pitch>(`/pitches/${id}`);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const nextImage = () => {
    if (pitch) setCurrentImageIndex((prev) => (prev + 1) % pitch.images.length);
  };

  const prevImage = () => {
    if (pitch) setCurrentImageIndex((prev) => (prev - 1 + pitch.images.length) % pitch.images.length);
  };

  const handleBookNow = () => {
    navigate(`/booking/${id}`, {
      state: { preselectedDate: selectedDate, preselectedTime: selectedTime }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"
          style={{ boxShadow: '0 0 20px rgba(16,185,129,0.3)' }} />
      </div>
    );
  }

  if (!pitch) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center glass-card p-10">
          <h2 className="text-2xl font-bold text-white mb-2">الملعب غير موجود</h2>
          <Link to="/pitches" className="text-emerald-400 hover:text-emerald-300 transition-colors">
            العودة للملاعب
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-24">
      {/* Breadcrumb */}
      <div className="border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-white/40 hover:text-emerald-400 transition-colors">الرئيسية</Link>
            <ChevronLeft className="h-4 w-4 text-white/20" />
            <Link to="/pitches" className="text-white/40 hover:text-emerald-400 transition-colors">الملاعب</Link>
            <ChevronLeft className="h-4 w-4 text-white/20" />
            <span className="text-emerald-400 font-medium">{pitch.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div>
            <div className="relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 aspect-[4/3]">
              <img
                src={pitch.images[currentImageIndex]}
                alt={pitch.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d]/60 to-transparent" />

              {pitch.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0a0f0d]/70 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-[#0a0f0d]/90 border border-white/10 transition-all text-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0a0f0d]/70 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-[#0a0f0d]/90 border border-white/10 transition-all text-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </>
              )}

              <div className="absolute top-4 right-4 bg-[#0a0f0d]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                <Star className="h-4 w-4 text-emerald-400 fill-emerald-400" />
                <span className="text-sm font-bold text-white">{pitch.rating}</span>
              </div>
            </div>

            {/* Thumbnails */}
            {pitch.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {pitch.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-emerald-500'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">{pitch.name}</h1>
            <p className="text-white/50 leading-relaxed mb-6">{pitch.description}</p>

            <div className="flex items-center gap-2 text-white/50 mb-6">
              <MapPin className="h-5 w-5 text-emerald-500" />
              <span>{pitch.location}</span>
            </div>

            {/* Price */}
            <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl p-5 mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-emerald-400">{pitch.pricePerHour}</span>
                <span className="text-emerald-500/70">ج.م / ساعة</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h3 className="font-bold text-white mb-3">المرافق</h3>
              <div className="flex flex-wrap gap-2">
                {pitch.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/70 text-sm px-3 py-1.5 rounded-xl"
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Booking */}
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-5">
              <h3 className="font-bold text-white mb-4">حجز سريع</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="flex items-center gap-1.5 text-sm text-white/50 mb-1.5">
                    <Calendar className="h-4 w-4 text-emerald-500" />
                    التاريخ
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-emerald-500/50 outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm text-white/50 mb-1.5">
                    <Clock className="h-4 w-4 text-emerald-500" />
                    الوقت
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-emerald-500/50 outline-none text-sm transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleBookNow}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
                style={{ boxShadow: '0 0 20px rgba(16,185,129,0.25)' }}
              >
                <Calendar className="h-5 w-5" />
                احجز الآن
              </button>
            </div>

            {/* Payment Info */}
            <div className="bg-amber-900/10 border border-amber-500/20 rounded-2xl p-5">
              <h3 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                معلومات الدفع
              </h3>
              <div className="space-y-2 text-sm text-amber-200/60">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-amber-500" />
                  <span>فودافون كاش: 0101 234 5678</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-amber-500" />
                  <span>إنستا باي: 0101 234 5678</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
