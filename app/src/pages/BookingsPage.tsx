import { useState } from 'react';
import { Search, CalendarDays, Phone, Mail, CreditCard, Clock, Filter, ChevronDown, Eye, Check, X } from 'lucide-react';
import { useApi, apiPut } from '@/hooks/useApi';
import type { Booking } from '@/types';
import { getStatusColor, getStatusLabel } from '@/lib/utils';

export default function BookingsPage() {
  const { data: bookings, loading, refetch } = useApi<Booking[]>('/bookings');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredBookings = bookings?.filter((booking) => {
    const matchesSearch = !search || 
      booking.customerName.toLowerCase().includes(search.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      booking.customerPhone.includes(search);
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await apiPut(`/bookings/${id}/status`, { status });
      refetch();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الحجوزات</h1>
        <p className="text-gray-500 mt-1">إدارة ومراقبة جميع حجوزات الملاعب</p>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالاسم، الإيميل، أو رقم الهاتف..."
              className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pr-10 pl-8 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none appearance-none bg-white"
            >
              <option value="">كل الحالات</option>
              <option value="pending">معلق</option>
              <option value="confirmed">مؤكد</option>
              <option value="cancelled">ملغي</option>
              <option value="completed">مكتمل</option>
            </select>
            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : !filteredBookings?.length ? (
          <div className="p-12 text-center">
            <CalendarDays className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">لا توجد حجوزات</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">صاحب الحجز</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الملعب</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الوقت</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{booking.customerName}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone className="h-3 w-3" />
                            {booking.customerPhone}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Mail className="h-3 w-3" />
                            {booking.customerEmail}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {typeof booking.pitch === 'object' ? booking.pitch.name : booking.pitch}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(booking.bookingDate).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{booking.timeSlot}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {booking.totalPrice} ج.م
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status).bg} ${getStatusColor(booking.status).text}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setSelectedBooking(booking); setShowModal(true); }}
                          className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                            className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="تأكيد"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="إلغاء"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">تفاصيل الحجز</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">الاسم</p>
                  <p className="font-medium text-sm">{selectedBooking.customerName}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">الحالة</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status).bg} ${getStatusColor(selectedBooking.status).text}`}>
                    {getStatusLabel(selectedBooking.status)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-gray-700" dir="ltr">{selectedBooking.customerEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-gray-700" dir="ltr">{selectedBooking.customerPhone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-gray-700">
                    {new Date(selectedBooking.bookingDate).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-gray-700">{selectedBooking.timeSlot}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-gray-700">
                    {selectedBooking.paymentMethod === 'vodafone_cash' ? 'فودافون كاش' : 
                     selectedBooking.paymentMethod === 'instapay' ? 'إنستا باي' : 'كاش'}
                  </span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">الإجمالي</span>
                  <span className="font-bold text-emerald-700 text-lg">{selectedBooking.totalPrice} ج.م</span>
                </div>
              </div>

              {selectedBooking.paymentScreenshot && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">صورة التحويل:</p>
                  <div className="border rounded-lg overflow-hidden">
                    <img 
                      src={selectedBooking.paymentScreenshot} 
                      alt="Payment" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}

              {selectedBooking.notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">ملاحظات</p>
                  <p className="text-sm text-gray-700">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
