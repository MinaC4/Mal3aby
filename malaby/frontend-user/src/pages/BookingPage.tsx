import { useParams, useLocation, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Star, CreditCard, Phone } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import type { Pitch } from '@/types';
import BookingForm from '@/components/BookingForm';

export default function BookingPage() {
  const { pitchId } = useParams<{ pitchId: string }>();
  const location = useLocation();
  const { data: pitch, loading } = useApi<Pitch>(`/pitches/${pitchId}`);

  const state = location.state as { preselectedDate?: string; preselectedTime?: string } | null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">جاري التحميل...</p>
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
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-dark-800 border-b border-gray-100 dark:border-dark-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">الرئيسية</Link>
            <ChevronLeft className="h-4 w-4 text-gray-300 dark:text-gray-600" />
            <Link to="/pitches" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">الملاعب</Link>
            <ChevronLeft className="h-4 w-4 text-gray-300 dark:text-gray-600" />
            <Link to={`/pitches/${pitch._id}`} className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{pitch.name}</Link>
            <ChevronLeft className="h-4 w-4 text-gray-300 dark:text-gray-600" />
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">حجز</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 animate-fade-in-up">
            <div className="glass-card p-6 md:p-8">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">إتمام الحجز</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">أدخل بياناتك لإتمام حجز الملعب</p>
              <BookingForm
                pitch={pitch}
                preselectedDate={state?.preselectedDate}
                preselectedTime={state?.preselectedTime}
              />
            </div>
          </div>

          {/* Pitch Summary */}
          <div className="lg:col-span-1 animate-fade-in">
            <div className="glass-card p-5 sticky top-24">
              <h2 className="font-black text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wide">ملخص الحجز</h2>

              <div className="rounded-xl overflow-hidden mb-4 shadow-md">
                <img
                  src={pitch.images[0]}
                  alt={pitch.name}
                  className="w-full h-40 object-cover"
                />
              </div>

              <h3 className="font-black text-gray-900 dark:text-white mb-2 text-sm">{pitch.name}</h3>

              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs mb-2">
                <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{pitch.location}</span>
              </div>

              <div className="flex items-center gap-1 mb-4">
                <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold text-gray-900 dark:text-white">{pitch.rating}</span>
              </div>

              <div className="border-t border-gray-100 dark:border-dark-500 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">السعر/ساعة</span>
                  <span className="font-black text-gray-900 dark:text-white text-sm">{pitch.pricePerHour} ج.م</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50 p-4">
                <h4 className="font-black text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <CreditCard className="h-3.5 w-3.5" />
                  طرق الدفع المتاحة
                </h4>
                <div className="space-y-2 text-xs text-amber-700 dark:text-amber-500">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span>فودافون كاش: 0101 234 5678</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-3 w-3" />
                    <span>إنستا باي: 0101 234 5678</span>
                  </div>
                </div>
                <p className="text-[10px] text-amber-600 dark:text-amber-600 mt-3 leading-relaxed">
                  بعد إتمام الحجز، يرجى تحويل مبلغ التأمين أو المبلغ كامل على أحد الأرقام أعلاه وإرسال screenshot.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
