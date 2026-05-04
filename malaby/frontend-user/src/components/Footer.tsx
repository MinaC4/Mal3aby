import { Link } from 'react-router-dom';
import { Gamepad2, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Gamepad2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ملعبي</span>
            </Link>
            <p className="text-sm leading-relaxed">
              منصتك الأولى لحجز ملاعب كرة القدم بسهولة وسرعة. 
              احجز ملعبك المفضل في أي وقت ومن أي مكان.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-emerald-400 transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/pitches" className="text-sm hover:text-emerald-400 transition-colors">
                  الملاعب
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-emerald-500" />
                <span>+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span>info@malaby.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span>القاهرة، مصر</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">
            © 2024 ملعبي. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
