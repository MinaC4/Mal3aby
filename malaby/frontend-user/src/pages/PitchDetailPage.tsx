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
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-slate-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!pitch) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">الملعب غير موجود</h2>
          <Link to="/pitches" className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">
            العودة للملاعب
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pb-16">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-dark-800 border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">الرئيسية</Link>
            <ChevronLeft className="h-4 w-4 text-gray-300 dark:text-slate-600" />
            <Link to="/pitches" className="text-gray-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">الملاعب</Link>
            <ChevronLeft className="h-4 w-4 text-gray-300 dark:text-slate-600" />
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{pitch.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div className="animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden bg-gray-200 dark:bg-dark-700 aspect-[4/3] shadow-xl">
              <img
                src={pitch.images[currentImageIndex]}
                alt={pitch.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {pitch.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-dark-700 transition-all shadow-lg hover:-translate-y-1/2 hover:scale-110"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700 dark:text-slate-300" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-dark-700 transition-all shadow-lg hover:scale-110"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-slate-300" />
                  </button>
                </>
              )}

              <div className="absolute top-4 right-4 bg-white/95 dark:bg-dark-800/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{pitch.rating}</span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-3">
              {pitch.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                    index === currentImageIndex
                      ? 'border-emerald-500 shadow-md shadow-emerald-500/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">{pitch.name}</h1>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-5 text-sm">{pitch.description}</p>

            <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 mb-6">
              <MapPin className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span className="text-sm">{pitch.location}</span>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl p-5 mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400">{pitch.pricePerHour}</span>
                <span className="text-emerald-600 dark:text-emerald-500 text-sm font-semibold">ج.م / ساعة</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <h3 className="font-black text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">المرافق</h3>
              <div className="flex flex-wrap gap-2">
                {pitch.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="flex items-center gap-1.5 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-slate-300 text-xs px-3 py-1.5 rounded-full font-medium border border-gray-200 dark:border-slate-700"
                  >
                    <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Booking */}
            <div className="glass-card p-5 mb-5">
              <h3 className="font-black text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wide">حجز سريع</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-slate-400 mb-1.5 font-semibold">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    التاريخ
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field text-sm py-2.5"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-slate-400 mb-1.5 font-semibold">
                    <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    الوقت
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="input-field text-sm py-2.5"
                  />
                </div>
              </div>
              <button
                onClick={handleBookNow}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                احجز الآن
              </button>
            </div>

            {/* Payment Info */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/50 p-5">
              <h3 className="font-black text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4" />
                معلومات الدفع
              </h3>
              <div className="space-y-2 text-sm text-amber-700 dark:text-amber-500">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  <span>فودافون كاش: 0101 234 5678</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5" />
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
