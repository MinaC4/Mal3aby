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
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center glass-card p-10">
          <h2 className="text-2xl font-bold text-white mb-4">لا يوجد بيانات حجز</h2>
          <Link to="/pitches" className="text-emerald-400 hover:text-emerald-300 transition-colors">
            تصفح الملاعب
          </Link>
        </div>
      </div>
    );
  }

  const { pitchName, booking, totalPrice } = state;

  return (
    <div className="min-h-screen py-12 pt-28">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Card */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-emerald-900/30 border-b border-emerald-500/20 p-10 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-700/20 blur-[60px] rounded-full" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ boxShadow: '0 0 30px rgba(16,185,129,0.2)' }}>
                <Check className="h-10 w-10 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">تم إرسال الحجز بنجاح!</h1>
              <p className="text-white/50">سنتواصل معك قريباً لتأكيد الحجز</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-8">
            <h2 className="text-lg font-bold text-white mb-6">تفاصيل الحجز</h2>

            <div className="space-y-1">
              {[
                { icon: <Home className="h-5 w-5 text-emerald-500" />, label: 'الملعب', value: pitchName },
                { icon: <Calendar className="h-5 w-5 text-emerald-500" />, label: 'التاريخ',
                  value: new Date(booking.bookingDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) },
                { icon: <Clock className="h-5 w-5 text-emerald-500" />, label: 'الوقت', value: booking.timeSlot },
                { icon: <Clock className="h-5 w-5 text-emerald-500" />, label: 'المدة', value: `${booking.duration} ساعة` },
                { icon: <Mail className="h-5 w-5 text-emerald-500" />, label: 'البريد الإلكتروني', value: booking.customerEmail, ltr: true },
                { icon: <Phone className="h-5 w-5 text-emerald-500" />, label: 'رقم الهاتف', value: booking.customerPhone, ltr: true },
                { icon: <CreditCard className="h-5 w-5 text-emerald-500" />, label: 'طريقة الدفع',
                  value: booking.paymentMethod === 'vodafone_cash' ? 'فودافون كاش' : 'إنستا باي' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3.5 border-b border-white/5">
                  <div className="flex items-center gap-3 text-white/40">
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className={`font-semibold text-white text-sm ${item.ltr ? 'dir-ltr' : ''}`}
                    dir={item.ltr ? 'ltr' : undefined}>
                    {item.value}
                  </span>
                </div>
              ))}

              <div className="flex items-center justify-between py-4 bg-emerald-900/20 border border-emerald-500/20 rounded-2xl px-4 mt-4">
                <span className="font-bold text-white">الإجمالي</span>
                <span className="font-bold text-emerald-400 text-xl">{totalPrice} ج.م</span>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="mt-8 bg-amber-900/10 border border-amber-500/20 rounded-2xl p-5">
              <h3 className="font-bold text-amber-400 mb-3">تعليمات الدفع</h3>
              <div className="space-y-2 text-sm text-amber-200/60">
                <p>1. قم بالتحويل على أحد الأرقام التالية:</p>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium text-white/70">فودافون كاش: 0101 234 5678</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium text-white/70">إنستا باي: 0101 234 5678</span>
                  </div>
                </div>
                <p className="mt-2">2. أرسل screenshot للتحويل على رقم الواتساب: 0101 234 5678</p>
                <p>3. سيتم تأكيد حجزك خلال 24 ساعة</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/"
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black py-3.5 rounded-xl font-bold transition-all duration-300 hover:-translate-y-0.5"
                style={{ boxShadow: '0 0 20px rgba(16,185,129,0.25)' }}>
                <Home className="h-5 w-5" />
                العودة للرئيسية
              </Link>
              <Link to="/pitches"
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3.5 rounded-xl font-medium transition-all">
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
