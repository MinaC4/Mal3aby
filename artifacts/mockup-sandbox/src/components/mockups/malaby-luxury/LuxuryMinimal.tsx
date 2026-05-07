import React from "react";
import { 
  Search, MapPin, Calendar, Clock, Star, Shield, 
  Zap, CreditCard, ChevronLeft, Map, Phone, Mail, Instagram, Twitter
} from "lucide-react";

export function LuxuryMinimal() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#fafaf9] text-stone-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#fafaf9]/80 backdrop-blur-md border-b border-stone-200/50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <a href="#" className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-white">م</span>
              ملعبي
            </a>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
              <a href="#" className="text-stone-900 transition-colors">الرئيسية</a>
              <a href="#" className="hover:text-stone-900 transition-colors">الملاعب</a>
              <a href="#" className="hover:text-stone-900 transition-colors">كيف نعمل</a>
              <a href="#" className="hover:text-stone-900 transition-colors">اتصل بنا</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-sm font-medium text-stone-600 hover:text-stone-900 px-4 py-2 transition-colors">
              تسجيل الدخول
            </button>
            <button className="bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm shadow-emerald-900/10">
              احجز الآن
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-24 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 text-right">
            <span className="inline-block py-1 px-3 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-xs font-semibold tracking-widest uppercase mb-6">
              التجربة الفاخرة لكرة القدم
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-stone-900 leading-[1.1] tracking-tight mb-8">
              احجز ملعبك <br/>
              <span className="text-emerald-800 italic font-serif">بكل سهولة</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-500 mb-10 max-w-lg leading-relaxed">
              اكتشف أرقى الملاعب، احجز في ثوانٍ، واستمتع بتجربة لعب لا تُنسى مع خدمات متميزة تليق بشغفك.
            </p>
            
            {/* Floating Booking Widget */}
            <div className="bg-white p-3 rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 flex flex-col md:flex-row gap-2 max-w-2xl">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-stone-50 rounded-xl border border-transparent hover:border-stone-200 transition-colors cursor-pointer">
                <MapPin className="w-5 h-5 text-emerald-800" />
                <div className="flex flex-col">
                  <span className="text-xs text-stone-400 font-medium">المدينة أو المنطقة</span>
                  <span className="text-sm text-stone-700 font-semibold">القاهرة، مصر</span>
                </div>
              </div>
              <div className="w-px bg-stone-100 hidden md:block"></div>
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-stone-50 rounded-xl border border-transparent hover:border-stone-200 transition-colors cursor-pointer">
                <Calendar className="w-5 h-5 text-emerald-800" />
                <div className="flex flex-col">
                  <span className="text-xs text-stone-400 font-medium">التاريخ</span>
                  <span className="text-sm text-stone-700 font-semibold">اليوم، 15 أكتوبر</span>
                </div>
              </div>
              <button className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl px-8 py-4 flex items-center justify-center gap-2 transition-all">
                <Search className="w-5 h-5" />
                <span className="font-semibold">بحث</span>
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative w-full aspect-[4/5] md:aspect-auto md:h-[600px] rounded-3xl overflow-hidden shadow-2xl shadow-stone-300/40">
            <img 
              src="/__mockup/images/luxury-pitch-1.png" 
              alt="Luxury Football Pitch" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
        </div>
      </header>

      {/* Stats Divider */}
      <section className="border-y border-stone-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-x-reverse divide-stone-100">
          <div className="text-center px-4">
            <div className="text-4xl font-bold text-stone-900 mb-2 font-serif">50+</div>
            <div className="text-sm text-stone-500 font-medium uppercase tracking-wider">ملعب فاخر</div>
          </div>
          <div className="text-center px-4">
            <div className="text-4xl font-bold text-stone-900 mb-2 font-serif">10K+</div>
            <div className="text-sm text-stone-500 font-medium uppercase tracking-wider">حجز ناجح</div>
          </div>
          <div className="text-center px-4">
            <div className="text-4xl font-bold text-stone-900 mb-2 font-serif">5K+</div>
            <div className="text-sm text-stone-500 font-medium uppercase tracking-wider">عميل سعيد</div>
          </div>
          <div className="text-center px-4">
            <div className="text-4xl font-bold text-stone-900 mb-2 font-serif">4.8</div>
            <div className="text-sm text-stone-500 font-medium uppercase tracking-wider">متوسط التقييم</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#fafaf9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">لماذا تختار ملعبي؟</h2>
            <p className="text-stone-500 text-lg">نقدم لك تجربة حجز ترتقي لمستوى تطلعاتك، مع التركيز على أدق التفاصيل لضمان راحتك.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-800 transition-colors">
                <Zap className="w-6 h-6 text-emerald-800 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">حجز فوري</h3>
              <p className="text-stone-500 leading-relaxed">تأكيد فوري لحجزك دون انتظار. نظامنا الذكي يضمن لك توافر الملاعب المتاحة في الوقت الفعلي.</p>
            </div>
            
            <div className="bg-white p-10 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-800 transition-colors">
                <Shield className="w-6 h-6 text-emerald-800 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">دفع آمن وموثوق</h3>
              <p className="text-stone-500 leading-relaxed">بوابات دفع مشفرة بالكامل تضمن سرية بياناتك. ادفع بسهولة وأمان عبر وسائل دفع متعددة.</p>
            </div>
            
            <div className="bg-white p-10 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-800 transition-colors">
                <Star className="w-6 h-6 text-emerald-800 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">جودة استثنائية</h3>
              <p className="text-stone-500 leading-relaxed">ننتقي الملاعب بعناية فائقة. صيانة دورية ومرافق ممتازة لضمان أفضل تجربة لعب ممكنة.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pitches */}
      <section className="py-24 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">ملاعب النخبة</h2>
              <p className="text-stone-500 text-lg">اختياراتنا لأفضل الملاعب المتاحة حالياً.</p>
            </div>
            <div className="hidden md:flex gap-2">
              <button className="px-5 py-2 rounded-full border border-stone-200 text-stone-600 hover:border-emerald-800 hover:text-emerald-800 transition-colors text-sm font-medium">الكل</button>
              <button className="px-5 py-2 rounded-full bg-stone-900 text-white text-sm font-medium shadow-sm">خماسي</button>
              <button className="px-5 py-2 rounded-full border border-stone-200 text-stone-600 hover:border-emerald-800 hover:text-emerald-800 transition-colors text-sm font-medium">سباعي</button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="group flex flex-col sm:flex-row bg-[#fafaf9] rounded-2xl overflow-hidden border border-stone-100 hover:border-emerald-800/30 transition-all hover:shadow-lg hover:shadow-stone-200/50">
                <div className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden">
                  <img 
                    src={item % 2 === 0 ? "/__mockup/images/luxury-pitch-2.png" : "/__mockup/images/luxury-pitch-1.png"} 
                    alt="Pitch" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-stone-900 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-emerald-600 fill-emerald-600" /> 4.9
                  </div>
                </div>
                <div className="sm:w-3/5 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-stone-900">أرينا القاهرة الكبرى</h3>
                      <span className="text-emerald-800 font-bold font-serif whitespace-nowrap mr-4">250 ج.م <span className="text-xs text-stone-400 font-normal">/ساعة</span></span>
                    </div>
                    <div className="flex items-center gap-1 text-stone-500 text-sm mb-4">
                      <MapPin className="w-4 h-4" /> مدينة نصر، القاهرة
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-2 py-1 bg-white border border-stone-200 rounded text-xs text-stone-600">عشب صناعي 5G</span>
                      <span className="px-2 py-1 bg-white border border-stone-200 rounded text-xs text-stone-600">إضاءة LED</span>
                      <span className="px-2 py-1 bg-white border border-stone-200 rounded text-xs text-stone-600">غرف تبديل</span>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-white border border-stone-200 text-stone-900 rounded-xl text-sm font-semibold group-hover:bg-emerald-800 group-hover:text-white group-hover:border-emerald-800 transition-colors">
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <button className="inline-flex items-center gap-2 text-emerald-800 font-semibold hover:text-emerald-900 transition-colors">
              عرض جميع الملاعب <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-stone-900">
        <div className="absolute inset-0 opacity-20">
          <img src="/__mockup/images/luxury-pitch-2.png" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">هل أنت مستعد للمباراة القادمة؟</h2>
          <p className="text-stone-300 text-xl mb-10 max-w-2xl mx-auto font-light">
            انضم إلى آلاف اللاعبين الذين يثقون بملعبي لحجز ملاعبهم المفضلة. تجربة سلسة، سريعة، وموثوقة.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors shadow-lg shadow-emerald-900/20">
              احجز ملعبك الآن
            </button>
            <button className="bg-transparent border border-stone-600 hover:border-white text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors">
              سجل كمالك ملعب
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <a href="#" className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-white text-sm">م</span>
                ملعبي
              </a>
              <p className="text-stone-500 text-sm leading-relaxed mb-6">
                المنصة الرائدة لحجز ملاعب كرة القدم في مصر. نربط اللاعبين بأفضل الملاعب لتجربة رياضية متكاملة.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:border-emerald-800 hover:text-emerald-800 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:border-emerald-800 hover:text-emerald-800 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-stone-900 mb-6 uppercase text-xs tracking-wider">روابط سريعة</h4>
              <ul className="space-y-4 text-sm text-stone-500">
                <li><a href="#" className="hover:text-emerald-800 transition-colors">عن ملعبي</a></li>
                <li><a href="#" className="hover:text-emerald-800 transition-colors">تصفح الملاعب</a></li>
                <li><a href="#" className="hover:text-emerald-800 transition-colors">كيفية الحجز</a></li>
                <li><a href="#" className="hover:text-emerald-800 transition-colors">الأسئلة الشائعة</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-stone-900 mb-6 uppercase text-xs tracking-wider">السياسات</h4>
              <ul className="space-y-4 text-sm text-stone-500">
                <li><a href="#" className="hover:text-emerald-800 transition-colors">شروط الاستخدام</a></li>
                <li><a href="#" className="hover:text-emerald-800 transition-colors">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-emerald-800 transition-colors">سياسة الإلغاء</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-stone-900 mb-6 uppercase text-xs tracking-wider">تواصل معنا</h4>
              <ul className="space-y-4 text-sm text-stone-500">
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-stone-400" />
                  <span dir="ltr">+20 100 123 4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-stone-400" />
                  <span>hello@malaby.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <Map className="w-4 h-4 text-stone-400" />
                  <span>القاهرة، مصر</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-400">
            <p>© {new Date().getFullYear()} ملعبي. جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-6">
              <span>صُنع بشغف لكرة القدم</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
