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
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-emerald-800 mb-2">تم إرسال الحجز بنجاح!</h3>
        <p className="text-emerald-600">جاري تحويلك لصفحة التأكيد...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Name */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <User className="h-4 w-4 text-emerald-600" />
          الاسم بالكامل
        </label>
        <input
          type="text"
          name="customerName"
          required
          value={formData.customerName}
          onChange={handleChange}
          className="input-field"
          placeholder="أدخل اسمك الكامل"
        />
      </div>

      {/* Email */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Mail className="h-4 w-4 text-emerald-600" />
          البريد الإلكتروني
        </label>
        <input
          type="email"
          name="customerEmail"
          required
          value={formData.customerEmail}
          onChange={handleChange}
          className="input-field"
          placeholder="example@email.com"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Phone className="h-4 w-4 text-emerald-600" />
          رقم الهاتف
        </label>
        <input
          type="tel"
          name="customerPhone"
          required
          value={formData.customerPhone}
          onChange={handleChange}
          className="input-field"
          placeholder="01X XXXX XXXX"
        />
      </div>

      {/* Date */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Calendar className="h-4 w-4 text-emerald-600" />
          تاريخ الحجز
        </label>
        <input
          type="date"
          name="bookingDate"
          required
          value={formData.bookingDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          className="input-field"
        />
      </div>

      {/* Time Slot */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Clock className="h-4 w-4 text-emerald-600" />
          الوقت
        </label>
        <input
          type="time"
          name="timeSlot"
          required
          value={formData.timeSlot}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      {/* Duration */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Clock className="h-4 w-4 text-emerald-600" />
          المدة (ساعات)
        </label>
        <select
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="input-field"
        >
          <option value={1}>1 ساعة</option>
          <option value={2}>2 ساعة</option>
          <option value={3}>3 ساعات</option>
          <option value={4}>4 ساعات</option>
        </select>
      </div>

      {/* Payment Method */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          طريقة الدفع
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={`border-2 rounded-lg p-3 cursor-pointer transition-all text-center ${
            formData.paymentMethod === 'vodafone_cash' 
              ? 'border-emerald-500 bg-emerald-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="vodafone_cash"
              checked={formData.paymentMethod === 'vodafone_cash'}
              onChange={handleChange}
              className="sr-only"
            />
            <span className="text-sm font-medium">فودافون كاش</span>
          </label>
          <label className={`border-2 rounded-lg p-3 cursor-pointer transition-all text-center ${
            formData.paymentMethod === 'instapay' 
              ? 'border-emerald-500 bg-emerald-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="instapay"
              checked={formData.paymentMethod === 'instapay'}
              onChange={handleChange}
              className="sr-only"
            />
            <span className="text-sm font-medium">إنستا باي</span>
          </label>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <FileText className="h-4 w-4 text-emerald-600" />
          ملاحظات (اختياري)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="input-field min-h-[80px] resize-none"
          placeholder="أي ملاحظات إضافية..."
        />
      </div>

      {/* Price Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">السعر/ساعة</span>
          <span className="font-semibold">{pitch.pricePerHour} ج.م</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">المدة</span>
          <span className="font-semibold">{formData.duration} ساعة</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-bold">الإجمالي</span>
            <span className="font-bold text-emerald-600 text-lg">
              {pitch.pricePerHour * formData.duration} ج.م
            </span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
