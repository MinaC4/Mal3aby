import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, MapPin, Star, CreditCard, Phone } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-emerald-600">الرئيسية</Link>
            <ChevronLeft className="h-4 w-4 text-gray-400" />
            <Link to="/pitches" className="text-gray-500 hover:text-emerald-600">الملاعب</Link>
            <ChevronLeft className="h-4 w-4 text-gray-400" />
            <Link to={`/pitches/${pitch._id}`} className="text-gray-500 hover:text-emerald-600">{pitch.name}</Link>
            <ChevronLeft className="h-4 w-4 text-gray-400" />
            <span className="text-emerald-600 font-medium">حجز</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">إتمام الحجز</h1>
              <p className="text-gray-500 mb-8">أدخل بياناتك لإتمام حجز الملعب</p>

              <BookingForm 
                pitch={pitch} 
                preselectedDate={state?.preselectedDate}
                preselectedTime={state?.preselectedTime}
              />
            </div>
          </div>

          {/* Pitch Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-4">ملخص الحجز</h2>
              
              {/* Pitch Image */}
              <div className="rounded-lg overflow-hidden mb-4">
                <img
                  src={pitch.images[0]}
                  alt={pitch.name}
                  className="w-full h-40 object-cover"
                />
              </div>

              <h3 className="font-bold text-gray-900 mb-2">{pitch.name}</h3>
              
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>{pitch.location}</span>
              </div>

              <div className="flex items-center gap-1 mb-4">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium">{pitch.rating}</span>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">السعر/ساعة</span>
                  <span className="font-semibold">{pitch.pricePerHour} ج.م</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
                <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4" />
                  طرق الدفع المتاحة
                </h4>
                <div className="space-y-2 text-sm text-amber-700">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    <span>فودافون كاش: 0101 234 5678</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>إنستا باي: 0101 234 5678</span>
                  </div>
                </div>
                <p className="text-xs text-amber-600 mt-3 leading-relaxed">
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
