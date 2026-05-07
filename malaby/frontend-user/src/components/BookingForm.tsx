import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Phone, Mail, FileText, AlertCircle, Check } from 'lucide-react';
import type { Pitch } from '@/types';
import { apiPost } from '@/hooks/useApi';

interface BookingFormProps {
  pitch: Pitch;
  preselectedDate?: string;
  preselectedTime?: string;
}

export default function BookingForm({ pitch, preselectedDate, preselectedTime }: BookingFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingDate: preselectedDate || '',
    timeSlot: preselectedTime || '',
    duration: 1,
    paymentMethod: 'vodafone_cash' as 'vodafone_cash' | 'instapay',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiPost('/bookings', {
        ...formData,
        pitchId: pitch._id
      });
      setSubmitted(true);
      setTimeout(() => {
        navigate('/booking-success', {
          state: {
            pitchName: pitch.name,
            booking: formData,
            totalPrice: pitch.pricePerHour * formData.duration
          }
        });
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء الحجز');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30"
          style={{ boxShadow: '0 0 30px rgba(16,185,129,0.2)' }}>
          <Check className="h-8 w-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-emerald-400 mb-2">تم إرسال الحجز بنجاح!</h3>
        <p className="text-emerald-400/60">جاري تحويلك لصفحة التأكيد...</p>
      </div>
    );
  }

  const labelClass = "flex items-center gap-2 text-sm font-medium text-white/50 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className={labelClass}>
          <User className="h-4 w-4 text-emerald-500" />
          الاسم بالكامل
        </label>
        <input type="text" name="customerName" required value={formData.customerName}
          onChange={handleChange} className="input-field" placeholder="أدخل اسمك الكامل" />
      </div>

      <div>
        <label className={labelClass}>
          <Mail className="h-4 w-4 text-emerald-500" />
          البريد الإلكتروني
        </label>
        <input type="email" name="customerEmail" required value={formData.customerEmail}
          onChange={handleChange} className="input-field" placeholder="example@email.com" />
      </div>

      <div>
        <label className={labelClass}>
          <Phone className="h-4 w-4 text-emerald-500" />
          رقم الهاتف
        </label>
        <input type="tel" name="customerPhone" required value={formData.customerPhone}
          onChange={handleChange} className="input-field" placeholder="01X XXXX XXXX" />
      </div>

      <div>
        <label className={labelClass}>
          <Calendar className="h-4 w-4 text-emerald-500" />
          تاريخ الحجز
        </label>
        <input type="date" name="bookingDate" required value={formData.bookingDate}
          onChange={handleChange} min={new Date().toISOString().split('T')[0]} className="input-field" />
      </div>

      <div>
        <label className={labelClass}>
          <Clock className="h-4 w-4 text-emerald-500" />
          الوقت
        </label>
        <input type="time" name="timeSlot" required value={formData.timeSlot}
          onChange={handleChange} className="input-field" />
      </div>

      <div>
        <label className={labelClass}>
          <Clock className="h-4 w-4 text-emerald-500" />
          المدة (ساعات)
        </label>
        <select name="duration" value={formData.duration} onChange={handleChange} className="input-field">
          <option value={1}>1 ساعة</option>
          <option value={2}>2 ساعة</option>
          <option value={3}>3 ساعات</option>
          <option value={4}>4 ساعات</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-white/50 mb-2 block">طريقة الدفع</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'vodafone_cash', label: 'فودافون كاش' },
            { value: 'instapay', label: 'إنستا باي' },
          ].map((method) => (
            <label key={method.value} className={`border-2 rounded-xl p-3 cursor-pointer transition-all text-center ${
              formData.paymentMethod === method.value
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
            }`}>
              <input type="radio" name="paymentMethod" value={method.value}
                checked={formData.paymentMethod === method.value}
                onChange={handleChange} className="sr-only" />
              <span className="text-sm font-medium">{method.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>
          <FileText className="h-4 w-4 text-emerald-500" />
          ملاحظات (اختياري)
        </label>
        <textarea name="notes" value={formData.notes} onChange={handleChange}
          className="input-field min-h-[80px] resize-none" placeholder="أي ملاحظات إضافية..." />
      </div>

      {/* Price Summary */}
      <div className="bg-emerald-900/15 border border-emerald-500/15 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/40 text-sm">السعر/ساعة</span>
          <span className="font-semibold text-white">{pitch.pricePerHour} ج.م</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-white/40 text-sm">المدة</span>
          <span className="font-semibold text-white">{formData.duration} ساعة</span>
        </div>
        <div className="border-t border-white/10 pt-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-white">الإجمالي</span>
            <span className="font-bold text-emerald-400 text-xl">
              {pitch.pricePerHour * formData.duration} ج.م
            </span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
        style={{ boxShadow: '0 0 25px rgba(16,185,129,0.3)' }}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Calendar className="h-5 w-5" />
            تأكيد الحجز
          </>
        )}
      </button>
    </form>
  );
}
