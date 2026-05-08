import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Phone, Mail, FileText, AlertCircle, Check } from 'lucide-react';
import type { Pitch } from '@/types';
import { apiPost } from '@/hooks/useApi';
import TimeSlotPicker from './TimeSlotPicker';

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
    if (!formData.timeSlot) {
      setError('اختر ميعاد الحجز من المواعيد المتاحة أدناه');
      return;
    }
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' ? Number(value) : value,
      ...(name === 'bookingDate' ? { timeSlot: '' } : {}),
      ...(name === 'duration' ? { timeSlot: '' } : {})
    }));
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-10 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/30 animate-float">
          <Check className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-black text-emerald-800 dark:text-emerald-300 mb-2">
          تم إرسال الحجز بنجاح!
        </h3>
        <p className="text-emerald-600 dark:text-emerald-500 text-sm">
          جاري تحويلك لصفحة التأكيد...
        </p>
      </div>
    );
  }

  const fieldClass = 'input-field';
  const labelClass =
    'flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Name */}
      <div>
        <label className={labelClass}>
          <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          الاسم بالكامل
        </label>
        <input
          type="text"
          name="customerName"
          required
          value={formData.customerName}
          onChange={handleChange}
          className={fieldClass}
          placeholder="أدخل اسمك الكامل"
        />
      </div>

      {/* Email */}
      <div>
        <label className={labelClass}>
          <Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          البريد الإلكتروني
        </label>
        <input
          type="email"
          name="customerEmail"
          required
          value={formData.customerEmail}
          onChange={handleChange}
          className={fieldClass}
          placeholder="example@email.com"
        />
      </div>

      {/* Phone */}
      <div>
        <label className={labelClass}>
          <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          رقم الهاتف
        </label>
        <input
          type="tel"
          name="customerPhone"
          required
          value={formData.customerPhone}
          onChange={handleChange}
          className={fieldClass}
          placeholder="01X XXXX XXXX"
        />
      </div>

      {/* Date */}
      <div>
        <label className={labelClass}>
          <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          تاريخ الحجز
        </label>
        <input
          type="date"
          name="bookingDate"
          required
          value={formData.bookingDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          className={fieldClass}
        />
      </div>

      {/* Duration — shown before slot picker so it affects availability */}
      <div>
        <label className={labelClass}>
          <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          المدة (ساعات)
        </label>
        <select
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className={fieldClass}
        >
          <option value={1}>1 ساعة</option>
          <option value={2}>2 ساعة</option>
          <option value={3}>3 ساعات</option>
          <option value={4}>4 ساعات</option>
        </select>
      </div>

      {/* Time Slot Picker */}
      <div>
        <label className={labelClass}>
          <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          اختر الميعاد
          {formData.timeSlot && (
            <span className="mr-auto text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
              ✓ مختار: {formData.timeSlot}
            </span>
          )}
        </label>
        <div className="bg-gray-50 dark:bg-dark-700 rounded-2xl p-4 border border-gray-100 dark:border-dark-500">
          <TimeSlotPicker
            pitchId={pitch._id}
            date={formData.bookingDate}
            duration={formData.duration}
            selected={formData.timeSlot}
            onChange={(time) => setFormData((prev) => ({ ...prev, timeSlot: time }))}
          />
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
          طريقة الدفع
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'vodafone_cash', label: 'فودافون كاش' },
            { value: 'instapay', label: 'إنستا باي' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`border-2 rounded-xl p-3.5 cursor-pointer transition-all text-center ${
                formData.paymentMethod === opt.value
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md shadow-emerald-500/10'
                  : 'border-gray-200 dark:border-dark-500 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-dark-700'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={opt.value}
                checked={formData.paymentMethod === opt.value}
                onChange={handleChange}
                className="sr-only"
              />
              <span
                className={`text-sm font-bold ${
                  formData.paymentMethod === opt.value
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass}>
          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          ملاحظات (اختياري)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className={`${fieldClass} min-h-[80px] resize-none`}
          placeholder="أي ملاحظات إضافية..."
        />
      </div>

      {/* Price Summary */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-2xl p-5 border border-gray-100 dark:border-dark-500">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-gray-600 dark:text-gray-400 text-sm">السعر/ساعة</span>
          <span className="font-bold text-gray-900 dark:text-white text-sm">
            {pitch.pricePerHour} ج.م
          </span>
        </div>
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-gray-600 dark:text-gray-400 text-sm">المدة</span>
          <span className="font-bold text-gray-900 dark:text-white text-sm">
            {formData.duration} ساعة
          </span>
        </div>
        {formData.timeSlot && (
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-gray-600 dark:text-gray-400 text-sm">الميعاد</span>
            <span className="font-bold text-gray-900 dark:text-white text-sm">
              {formData.timeSlot}
            </span>
          </div>
        )}
        <div className="border-t border-gray-200 dark:border-dark-500 pt-3">
          <div className="flex justify-between items-center">
            <span className="font-black text-gray-900 dark:text-white">الإجمالي</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-lg">
              {pitch.pricePerHour * formData.duration} ج.م
            </span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !formData.timeSlot}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-base"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Calendar className="h-5 w-5" />
            {formData.timeSlot ? 'تأكيد الحجز' : 'اختر ميعاداً للمتابعة'}
          </>
        )}
      </button>
    </form>
  );
}
