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
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">لا يوجد بيانات حجز</h2>
          <Link to="/pitches" className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">
            تصفح الملاعب
          </Link>
        </div>
      </div>
    );
  }

  const { pitchName, booking, totalPrice } = state;

  const details = [
    { icon: Home,     label: 'الملعب',            value: pitchName, dir: undefined },
    { icon: Calendar, label: 'التاريخ',           value: new Date(booking.bookingDate).toLocaleDateString('ar-EG', { year:'numeric', month:'long', day:'numeric' }), dir: undefined },
    { icon: Clock,    label: 'الوقت',             value: booking.timeSlot, dir: undefined },
    { icon: Clock,    label: 'المدة',             value: `${booking.duration} ساعة`, dir: undefined },
    { icon: Mail,     label: 'البريد الإلكتروني', value: booking.customerEmail, dir: 'ltr' as const },
    { icon: Phone,    label: 'رقم الهاتف',        value: booking.customerPhone, dir: 'ltr' as const },
    { icon: CreditCard, label: 'طريقة الدفع',    value: booking.paymentMethod === 'vodafone_cash' ? 'فودافون كاش' : 'إنستا باي', dir: undefined },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-10 text-center text-white overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-400/20 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-5 animate-float">
                <Check className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl font-black mb-2">تم إرسال الحجز بنجاح!</h1>
              <p className="text-emerald-100 text-sm">سنتواصل معك قريباً لتأكيد الحجز</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-8">
            <h2 className="text-base font-black text-gray-900 dark:text-white mb-6 uppercase tracking-wide">تفاصيل الحجز</h2>

            <div className="space-y-2">
              {details.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-800 last:border-0">
                  <div className="flex items-center gap-3 text-gray-500 dark:text-slate-400">
                    <div className="w-7 h-7 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-sm" dir={item.dir}>{item.value}</span>
                </div>
              ))}

              {/* Total */}
              <div className="flex items-center justify-between py-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl px-4 mt-4 border border-emerald-100 dark:border-emerald-800/50">
                <span className="font-black text-gray-900 dark:text-white">الإجمالي</span>
                <span className="font-black text-emerald-700 dark:text-emerald-400 text-xl">{totalPrice} ج.م</span>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/50 p-5">
              <h3 className="font-black text-amber-800 dark:text-amber-400 mb-4 text-sm uppercase tracking-wide">تعليمات الدفع</h3>
              <div className="space-y-3 text-sm text-amber-700 dark:text-amber-500">
                <p className="font-semibold">1. قم بالتحويل على أحد الأرقام التالية:</p>
                <div className="bg-white dark:bg-dark-800 rounded-xl p-4 space-y-3 border border-amber-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                      <Phone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="font-bold">فودافون كاش: 0101 234 5678</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="font-bold">إنستا باي: 0101 234 5678</span>
                  </div>
                </div>
                <p className="text-xs leading-relaxed">2. أرسل screenshot للتحويل على رقم الواتساب: 0101 234 5678</p>
                <p className="text-xs">3. سيتم تأكيد حجزك خلال 24 ساعة</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 text-sm"
              >
                <Home className="h-4 w-4" />
                العودة للرئيسية
              </Link>
              <Link
                to="/pitches"
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-700 dark:text-slate-300 py-3.5 rounded-xl font-bold transition-all text-sm border border-gray-200 dark:border-slate-700 hover:-translate-y-0.5"
              >
                <ArrowLeft className="h-4 w-4" />
                المزيد من الملاعب
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
