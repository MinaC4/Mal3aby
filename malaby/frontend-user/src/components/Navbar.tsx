import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Gamepad2, Calendar } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'الرئيسية' },
    { path: '/pitches', label: 'الملاعب' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ملعبي</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                  location.pathname === link.path
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/pitches"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Calendar className="h-4 w-4" />
              احجز الآن
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/pitches"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <Calendar className="h-4 w-4" />
              احجز الآن
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
