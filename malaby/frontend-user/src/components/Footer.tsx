import { Link } from 'react-router-dom';
import { Trophy, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050806] pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center"
                style={{ boxShadow: '0 0 15px rgba(16,185,129,0.3)' }}>
                <Trophy className="h-4 w-4 text-black" />
              </div>
              <span className="text-xl font-bold text-white">ملعبي</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed">
              المنصة الأولى لحجز ملاعب كرة القدم بسهولة وسرعة.
              احجز ملعبك المفضل في أي وقت ومن أي مكان.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-5">روابط سريعة</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-white/40 text-sm hover:text-emerald-400 transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/pitches" className="text-white/40 text-sm hover:text-emerald-400 transition-colors">
                  الملاعب
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-5">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-white/40 text-sm">
                <Phone className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-2.5 text-white/40 text-sm">
                <Mail className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>info@malaby.com</span>
              </li>
              <li className="flex items-center gap-2.5 text-white/40 text-sm">
                <MapPin className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>القاهرة، مصر</span>
              </li>
              <li className="flex items-center gap-2.5 text-white/40 text-sm">
                <Clock className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>دعم 24/7</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-sm">
            © {new Date().getFullYear()} ملعبي. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-5 text-sm text-white/25">
            <a href="#" className="hover:text-emerald-400 transition-colors">تويتر</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">انستجرام</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">فيسبوك</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
