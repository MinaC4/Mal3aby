import { Bell, CalendarDays } from 'lucide-react';
import { useApi } from '@/hooks/useApi';

export default function Navbar() {
  const { data } = useApi<{ unreadCount: number }>('/notifications/stats/unread');

  const today = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">لوحة التحكم</h2>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {today}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications indicator */}
          <div className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            {data && data.unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {data.unreadCount}
              </span>
            )}
          </div>

          {/* Admin badge */}
          <div className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full">
            مدير
          </div>
        </div>
      </div>
    </header>
  );
}
