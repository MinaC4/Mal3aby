import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Bell, LogOut, Gamepad2, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'الرئيسية', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/bookings', label: 'الحجوزات', icon: <CalendarDays className="h-5 w-5" /> },
    { path: '/notifications', label: 'الإشعارات', icon: <Bell className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-900 text-white p-2 rounded-lg"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <LayoutDashboard className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 h-full w-64 bg-gray-900 text-white z-40
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-800">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <Gamepad2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">ملعبي</h1>
            <p className="text-xs text-gray-400">لوحة التحكم</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`sidebar-link ${
                location.pathname === link.path
                  ? 'sidebar-link-active'
                  : 'sidebar-link-inactive'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}
