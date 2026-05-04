import { Bell, Check, Trash2, Calendar, User, Clock } from 'lucide-react';
import { useApi, apiPut, apiDelete } from '@/hooks/useApi';
import type { Notification } from '@/types';
import { formatDate } from '@/lib/utils';

export default function NotificationsPage() {
  const { data, loading, refetch } = useApi<{ data: Notification[]; unreadCount: number }>('/notifications');
  const notifications = data?.data || [];

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiPut(`/notifications/${id}/read`);
      refetch();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiPut('/notifications/read-all');
      refetch();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإشعار؟')) return;
    try {
      await apiDelete(`/notifications/${id}`);
      refetch();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_booking':
        return <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center"><Bell className="h-5 w-5 text-emerald-600" /></div>;
      case 'booking_confirmed':
        return <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Check className="h-5 w-5 text-blue-600" /></div>;
      case 'booking_cancelled':
        return <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"><Trash2 className="h-5 w-5 text-red-600" /></div>;
      case 'payment_received':
        return <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center"><Bell className="h-5 w-5 text-amber-600" /></div>;
      default:
        return <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"><Bell className="h-5 w-5 text-gray-600" /></div>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'new_booking': return 'حجز جديد';
      case 'booking_confirmed': return 'تأكيد حجز';
      case 'booking_cancelled': return 'إلغاء حجز';
      case 'payment_received': return 'استلام دفعة';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الإشعارات</h1>
          <p className="text-gray-500 mt-1">تابع آخر التحديثات والحجوزات الجديدة</p>
        </div>
        {data && data.unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="btn-secondary flex items-center gap-2 self-start"
          >
            <Check className="h-4 w-4" />
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="card">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : !notifications.length ? (
          <div className="p-12 text-center">
            <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">لا توجد إشعارات</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div 
                key={notification._id}
                className={`p-5 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-emerald-50/30' : ''}`}
              >
                <div className="flex items-start gap-4">
                  {getNotificationIcon(notification.type)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        notification.type === 'new_booking' ? 'bg-emerald-100 text-emerald-700' :
                        notification.type === 'booking_confirmed' ? 'bg-blue-100 text-blue-700' :
                        notification.type === 'booking_cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {getTypeLabel(notification.type)}
                      </span>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                      )}
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-1">{notification.title}</h4>
                    <p className="text-sm text-gray-500 mb-2">{notification.message}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>

                    {/* Booking details if available */}
                    {typeof notification.booking === 'object' && notification.booking && (
                      <div className="mt-3 bg-white rounded-lg border border-gray-100 p-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <User className="h-3.5 w-3.5" />
                            {notification.booking.customerName}
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="h-3.5 w-3.5" />
                            {notification.booking.timeSlot}
                          </div>
                        </div>
                        
                        {/* Payment screenshot */}
                        {notification.booking.paymentScreenshot && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">صورة التحويل:</p>
                            <a 
                              href={notification.booking.paymentScreenshot}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 text-xs hover:underline"
                            >
                              عرض الصورة
                            </a>
                          </div>
                        )}

                        {/* Contact info for new bookings */}
                        {notification.type === 'new_booking' && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">للتواصل:</p>
                            <div className="flex items-center gap-3 text-sm">
                              <a 
                                href={`tel:${notification.booking.customerPhone}`}
                                className="flex items-center gap-1 text-emerald-600 hover:underline"
                              >
                                <Clock className="h-3.5 w-3.5" />
                                {notification.booking.customerPhone}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="تحديد كمقروء"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
