import { CalendarDays, CheckCircle, Clock, DollarSign, Bell, TrendingUp, Users } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import type { Booking, Notification } from '@/types';
import { formatDate, formatPrice, getStatusColor, getStatusLabel } from '@/lib/utils';

export default function DashboardPage() {
  const { data: bookings, loading: bookingsLoading } = useApi<Booking[]>('/bookings');
  const { data: notificationsData } = useApi<{ data: Notification[]; unreadCount: number }>('/notifications');

  const stats = [
    {
      label: 'إجمالي الحجوزات',
      value: bookings?.length || 0,
      icon: <CalendarDays className="h-6 w-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
      trend: '+12%'
    },
    {
      label: 'الحجوزات المعلقة',
      value: bookings?.filter(b => b.status === 'pending').length || 0,
      icon: <Clock className="h-6 w-6 text-amber-600" />,
      bg: 'bg-amber-50',
      trend: null
    },
    {
      label: 'الحجوزات المؤكدة',
      value: bookings?.filter(b => b.status === 'confirmed').length || 0,
      icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
      bg: 'bg-blue-50',
      trend: null
    },
    {
      label: 'إجمالي الإيرادات',
      value: formatPrice(bookings?.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.totalPrice : 0), 0) || 0),
      icon: <DollarSign className="h-6 w-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
      trend: '+8%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">مرحباً بك في لوحة التحكم</h1>
        <p className="text-gray-500 mt-1">نظرة عامة على أداء الملاعب والحجوزات</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-start justify-between">
              <div className={`${stat.bg} p-3 rounded-xl`}>
                {stat.icon}
              </div>
              {stat.trend && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend}
                </span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="card">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-emerald-600" />
              آخر الحجوزات
            </h3>
            <span className="text-sm text-gray-500">{bookings?.length || 0} حجز</span>
          </div>
          <div className="divide-y divide-gray-50">
            {bookingsLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            ) : bookings?.slice(0, 5).map((booking) => (
              <div key={booking._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{booking.customerName}</p>
                    <p className="text-sm text-gray-500">
                      {typeof booking.pitch === 'object' ? booking.pitch.name : ''} - {booking.timeSlot}
                    </p>
                  </div>
                  <div className="text-left">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status).bg} ${getStatusColor(booking.status).text}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                    <p className="text-sm font-medium text-gray-900 mt-1">{booking.totalPrice} ج.م</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="card">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-5 w-5 text-emerald-600" />
              الإشعارات الأخيرة
            </h3>
            <span className="text-sm text-gray-500">
              {notificationsData?.unreadCount || 0} غير مقروء
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {!notificationsData?.data?.length ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                <p>لا توجد إشعارات</p>
              </div>
            ) : notificationsData.data.slice(0, 5).map((notification) => (
              <div 
                key={notification._id} 
                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-emerald-50/50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.read ? 'bg-gray-300' : 'bg-emerald-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                    <p className="text-sm text-gray-500 truncate">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
