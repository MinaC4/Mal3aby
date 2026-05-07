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
    <div className="min-h-screen pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-white/40 hover:text-emerald-400 transition-colors">الرئيسية</Link>
            <ChevronLeft className="h-4 w-4 text-white/20" />
            <Link to="/pitches" className="text-white/40 hover:text-emerald-400 transition-colors">الملاعب</Link>
            <ChevronLeft className="h-4 w-4 text-white/20" />
            <Link to={`/pitches/${pitch._id}`} className="text-white/40 hover:text-emerald-400 transition-colors">
              {pitch.name}
            </Link>
            <ChevronLeft className="h-4 w-4 text-white/20" />
            <span className="text-emerald-400 font-medium">حجز</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8">
              <h1 className="text-2xl font-bold text-white mb-2">إتمام الحجز</h1>
              <p className="text-white/40 mb-8">أدخل بياناتك لإتمام حجز الملعب</p>
              <BookingForm
                pitch={pitch}
                preselectedDate={state?.preselectedDate}
                preselectedTime={state?.preselectedTime}
              />
            </div>
          </div>

          {/* Pitch Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-6 sticky top-28">
              <h2 className="font-bold text-white mb-5">ملخص الحجز</h2>

              <div className="rounded-2xl overflow-hidden mb-5 border border-white/10">
                <img
                  src={pitch.images[0]}
                  alt={pitch.name}
                  className="w-full h-40 object-cover"
                />
              </div>

              <h3 className="font-bold text-white mb-2">{pitch.name}</h3>

              <div className="flex items-center gap-2 text-white/40 text-sm mb-3">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span>{pitch.location}</span>
              </div>

              <div className="flex items-center gap-1 mb-5">
                <Star className="h-4 w-4 text-emerald-400 fill-emerald-400" />
                <span className="text-sm font-medium text-white">{pitch.rating}</span>
              </div>

              <div className="border-t border-white/5 pt-4 mb-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/40 text-sm">السعر/ساعة</span>
                  <span className="font-semibold text-white">{pitch.pricePerHour} ج.م</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-amber-900/10 border border-amber-500/20 rounded-2xl p-4">
                <h4 className="font-bold text-amber-400 mb-3 flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4" />
                  طرق الدفع المتاحة
                </h4>
                <div className="space-y-2 text-sm text-amber-200/60">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-amber-500" />
                    <span>فودافون كاش: 0101 234 5678</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5 text-amber-500" />
                    <span>إنستا باي: 0101 234 5678</span>
                  </div>
                </div>
                <p className="text-xs text-amber-200/40 mt-3 leading-relaxed">
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
