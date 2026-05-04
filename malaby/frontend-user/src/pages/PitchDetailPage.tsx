import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, ArrowRight, ChevronLeft, ChevronRight, Clock, Calendar, Check, Phone, CreditCard } from 'lucide-react';
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
    if (pitch) {
      setCurrentImageIndex((prev) => (prev + 1) % pitch.images.length);
    }
  };

  const prevImage = () => {
    if (pitch) {
      setCurrentImageIndex((prev) => (prev - 1 + pitch.images.length) % pitch.images.length);
    }
  };

  const handleBookNow = () => {
    navigate(`/booking/${id}`, {
      state: { preselectedDate: selectedDate, preselectedTime: selectedTime }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!pitch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">الملعب غير موجود</h2>
          <Link to="/pitches" className="text-emerald-600 hover:underline">
            العودة للملاعب
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-emerald-600">الرئيسية</Link>
            <ChevronLeft className="h-4 w-4 text-gray-400" />
            <Link to="/pitches" className="text-gray-500 hover:text-emerald-600">الملاعب</Link>
            <ChevronLeft className="h-4 w-4 text-gray-400" />
            <span className="text-emerald-600 font-medium">{pitch.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3]">
              <img
                src={pitch.images[currentImageIndex]}
                alt={pitch.name}
                className="w-full h-full object-cover"
              />
              
              {pitch.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </>
              )}

              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold">{pitch.rating}</span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4">
              {pitch.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? 'border-emerald-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{pitch.name}</h1>
            <p className="text-gray-600 leading-relaxed mb-6">{pitch.description}</p>

            <div className="flex items-center gap-2 text-gray-500 mb-6">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <span>{pitch.location}</span>
            </div>

            {/* Price */}
            <div className="bg-emerald-50 rounded-xl p-5 mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-emerald-700">{pitch.pricePerHour}</span>
                <span className="text-emerald-600">ج.م / ساعة</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-3">المرافق</h3>
              <div className="flex flex-wrap gap-2">
                {pitch.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full"
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Booking */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">حجز سريع</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="flex items-center gap-1 text-sm text-gray-600 mb-1.5">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    التاريخ
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-sm text-gray-600 mb-1.5">
                    <Clock className="h-4 w-4 text-emerald-600" />
                    الوقت
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none text-sm"
                  />
                </div>
              </div>
              <button
                onClick={handleBookNow}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                احجز الآن
              </button>
            </div>

            {/* Payment Info */}
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
              <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                معلومات الدفع
              </h3>
              <div className="space-y-2 text-sm text-amber-700">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>فودافون كاش: 0101 234 5678</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
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
