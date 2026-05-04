import { useLocation, Link } from 'react-router-dom';
import { Check, Calendar, Clock, Phone, Mail, CreditCard, ArrowLeft, Home } from 'lucide-react';

interface BookingState {
  pitchName: string;
  booking: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    bookingDate: string;
    timeSlot: string;
    duration: number;
    paymentMethod: string;
  };
  totalPrice: number;
}

export default function BookingSuccessPage() {
  const location = useLocation();
  const state = location.state as BookingState | null;

  if (!state) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">لا يوجد بيانات حجز</h2>
          <Link to="/pitches" className="text-emerald-600 hover:underline">
            تصفح الملاعب
          </Link>
        </div>
      </div>
    );
  }

  const { pitchName, booking, totalPrice } = state;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-10 w-10" />
            </div>
            <h1 className="text-2xl font-bold mb-2">تم إرسال الحجز بنجاح!</h1>
            <p className="text-emerald-100">
              سنتواصل معك قريباً لتأكيد الحجز
            </p>
          </div>

          {/* Booking Details */}
          <div className="p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">تفاصيل الحجز</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3 text-gray-600">
                  <Home className="h-5 w-5 text-emerald-600" />
                  <span>الملعب</span>
                </div>
                <span className="font-semibold text-gray-900">{pitchName}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  <span>التاريخ</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {new Date(booking.bookingDate).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <span>الوقت</span>
                </div>
                <span className="font-semibold text-gray-900">{booking.timeSlot}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <span>المدة</span>
                </div>
                <span className="font-semibold text-gray-900">{booking.duration} ساعة</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="h-5 w-5 text-emerald-600" />
                  <span>البريد الإلكتروني</span>
                </div>
                <span className="font-semibold text-gray-900" dir="ltr">{booking.customerEmail}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="h-5 w-5 text-emerald-600" />
                  <span>رقم الهاتف</span>
                </div>
                <span className="font-semibold text-gray-900" dir="ltr">{booking.customerPhone}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3 text-gray-600">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  <span>طريقة الدفع</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {booking.paymentMethod === 'vodafone_cash' ? 'فودافون كاش' : 'إنستا باي'}
                </span>
              </div>

              <div className="flex items-center justify-between py-4 bg-emerald-50 rounded-lg px-4 mt-4">
                <span className="font-bold text-gray-900">الإجمالي</span>
                <span className="font-bold text-emerald-700 text-xl">{totalPrice} ج.م</span>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="mt-8 bg-amber-50 rounded-xl border border-amber-200 p-5">
              <h3 className="font-bold text-amber-800 mb-3">تعليمات الدفع</h3>
              <div className="space-y-2 text-sm text-amber-700">
                <p>1. قم بالتحويل على أحد الأرقام التالية:</p>
                <div className="bg-white rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium">فودافون كاش: 0101 234 5678</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium">إنستا باي: 0101 234 5678</span>
                  </div>
                </div>
                <p className="mt-2">2. أرسل screenshot للتحويل على رقم الواتساب: 0101 234 5678</p>
                <p>3. سيتم تأكيد حجزك خلال 24 ساعة</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                <Home className="h-5 w-5" />
                العودة للرئيسية
              </Link>
              <Link
                to="/pitches"
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                المزيد من الملاعب
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
