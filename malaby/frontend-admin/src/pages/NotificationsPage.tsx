import { Bell, Check, Trash2 } from 'lucide-react';
import { useApi, apiPut, apiDelete } from '@/hooks/useApi';
import type { Notification } from '@/types';
import { formatDate } from '@/lib/utils';

export default function NotificationsPage() {
  const { data: notifications, loading, refetch } = useApi<Notification[]>('/notifications');

  const handleMarkAsRead = async (id: string) => {
    await apiPut(`/notifications/${id}/read`);
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف الإشعار؟')) return;
    await apiDelete(`/notifications/${id}`);
    refetch();
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">الإشعارات ({notifications?.length || 0})</h1>

      {loading ? (
        <p className="text-center py-10">جاري التحميل...</p>
      ) : !notifications?.length ? (
        <div className="text-center py-20">
          <Bell className="h-20 w-20 mx-auto text-gray-300" />
          <p className="mt-6 text-xl text-gray-500">لا توجد إشعارات</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div key={n._id} className="bg-white border rounded-2xl p-6 shadow-sm">
              <div className="flex gap-4">
                <Bell className="h-10 w-10 text-emerald-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{n.title}</h4>
                  <p className="text-gray-600 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatDate(n.createdAt)}</p>
                </div>
                <div className="flex gap-3">
                  {!n.read && (
                    <button onClick={() => handleMarkAsRead(n._id)} className="text-emerald-600">
                      <Check size={24} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(n._id)} className="text-red-500">
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
