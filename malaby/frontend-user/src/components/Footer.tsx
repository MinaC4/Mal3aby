import { Link } from 'react-router-dom';
import { Gamepad2, Phone, Mail, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-dark-900 border-t border-gray-800 dark:border-slate-800 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl shadow-lg shadow-emerald-500/30">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">ملعبي</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              منصتك الأولى لحجز ملاعب كرة القدم بسهولة وسرعة. 
              احجز ملعبك المفضل في أي وقت ومن أي مكان.
            </p>
            <div className="flex gap-3 mt-5">
              <div className="w-8 h-8 bg-emerald-600/20 hover:bg-emerald-600/40 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                <span className="text-emerald-400 text-xs font-bold">f</span>
              </div>
              <div className="w-8 h-8 bg-emerald-600/20 hover:bg-emerald-600/40 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                <span className="text-emerald-400 text-xs font-bold">t</span>
              </div>
              <div className="w-8 h-8 bg-emerald-600/20 hover:bg-emerald-600/40 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                <span className="text-emerald-400 text-xs font-bold">ig</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">روابط سريعة</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-gray-500 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-emerald-600 group-hover:w-2 transition-all" />
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/pitches" className="text-sm text-gray-500 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-emerald-600 group-hover:w-2 transition-all" />
                  الملاعب
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm group">
                <div className="w-8 h-8 bg-emerald-900/40 group-hover:bg-emerald-600/30 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                  <Phone className="h-4 w-4 text-emerald-500" />
                </div>
                <span className="text-gray-500 group-hover:text-gray-300 transition-colors">+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3 text-sm group">
                <div className="w-8 h-8 bg-emerald-900/40 group-hover:bg-emerald-600/30 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                  <Mail className="h-4 w-4 text-emerald-500" />
                </div>
                <span className="text-gray-500 group-hover:text-gray-300 transition-colors">info@malaby.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm group">
                <div className="w-8 h-8 bg-emerald-900/40 group-hover:bg-emerald-600/30 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                </div>
                <span className="text-gray-500 group-hover:text-gray-300 transition-colors">القاهرة، مصر</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm text-gray-600">
            © 2026 ملعبي. جميع الحقوق محفوظة.
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-1.5">
            صُنع بـ <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> في مصر
          </p>
        </div>
      </div>
    </footer>
  );
}
