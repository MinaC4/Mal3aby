import React from 'react';
import { Play, ShieldCheck, Zap, Star, MapPin, ChevronLeft, CheckCircle2, ArrowLeft } from 'lucide-react';

export function SportsBold() {
  return (
    <div dir="rtl" className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 transform -skew-x-12 flex items-center justify-center">
              <Zap className="w-6 h-6 text-neutral-950 fill-neutral-950" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">ملعبي</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-bold text-neutral-300">
            <a href="#" className="hover:text-emerald-400 transition-colors">الرئيسية</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">الملاعب</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">كيف يعمل</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">تواصل معنا</a>
          </div>

          <button className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black px-8 py-3 transform -skew-x-12 transition-all hover:scale-105 active:scale-95">
            <span className="block transform skew-x-12">احجز الآن</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-48 lg:pt-48 lg:pb-64 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-emerald-900/30 mix-blend-multiply z-10" />
          <img 
            src="/__mockup/images/stadium-hero.png" 
            alt="Stadium" 
            className="w-full h-full object-cover opacity-60 scale-105 transform hover:scale-100 transition-transform duration-[10s]"
          />
        </div>

        <div className="container relative z-20 mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900/80 border border-emerald-500/30 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 font-bold text-sm tracking-wider">أقوى منصة حجز ملاعب في مصر</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] mb-6 tracking-tight">
              احجز ملعبك <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                بكل قوة وسهولة
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-300 font-medium mb-10 max-w-2xl leading-relaxed">
              لا تدع فرصة اللعب تفوتك. اكتشف أفضل الملاعب، قارن الأسعار، واحجز في ثوانٍ. فريقك في انتظارك.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black px-10 py-5 text-lg transform -skew-x-12 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                <span className="flex items-center justify-center gap-2 transform skew-x-12">
                  اكتشف الملاعب
                  <ArrowLeft className="w-6 h-6" />
                </span>
              </button>
              <button className="bg-neutral-800 hover:bg-neutral-700 text-white font-black px-10 py-5 text-lg transform -skew-x-12 border border-neutral-700 transition-all hover:scale-105">
                <span className="flex items-center justify-center gap-2 transform skew-x-12">
                  <Play className="w-5 h-5 fill-current" />
                  شاهد كيف يعمل
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Diagonal Cut Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-neutral-950" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}></div>
      </header>

      {/* Stats Section - Championship Style */}
      <section className="py-20 bg-neutral-950 relative z-30 -mt-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'ملعب متاح', value: '+50' },
              { label: 'حجز ناجح', value: '+10K' },
              { label: 'لاعب سعيد', value: '+5K' },
              { label: 'تقييم عام', value: '4.8' },
            ].map((stat, i) => (
              <div key={i} className="bg-neutral-900 border-b-4 border-emerald-500 p-8 transform hover:-translate-y-2 transition-transform">
                <div className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-emerald-400 font-bold text-lg uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-neutral-900 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-6">لماذا تختار <span className="text-emerald-500">ملعبي</span>؟</h2>
            <p className="text-xl text-neutral-400 font-medium">نقدم لك تجربة حجز احترافية تليق بالبطولات</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-neutral-950 p-10 border border-white/5 hover:border-emerald-500/50 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-colors" />
              <Zap className="w-16 h-16 text-emerald-500 mb-8 transform group-hover:scale-110 transition-transform" />
              <h3 className="text-3xl font-black text-white mb-4">حجز فوري</h3>
              <p className="text-neutral-400 font-medium leading-relaxed">لا مزيد من الانتظار على الهاتف. اختر ملعبك، حدد وقتك، وادفع في ثوانٍ معدودة.</p>
            </div>
            
            <div className="group bg-neutral-950 p-10 border border-white/5 hover:border-emerald-500/50 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-colors" />
              <ShieldCheck className="w-16 h-16 text-emerald-500 mb-8 transform group-hover:scale-110 transition-transform" />
              <h3 className="text-3xl font-black text-white mb-4">حجز آمن ومضمون</h3>
              <p className="text-neutral-400 font-medium leading-relaxed">دفع إلكتروني آمن 100% مع ضمان تأكيد الحجز فورياً من إدارة الملعب.</p>
            </div>

            <div className="group bg-neutral-950 p-10 border border-white/5 hover:border-emerald-500/50 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-colors" />
              <Star className="w-16 h-16 text-emerald-500 mb-8 transform group-hover:scale-110 transition-transform" />
              <h3 className="text-3xl font-black text-white mb-4">أسعار تنافسية</h3>
              <p className="text-neutral-400 font-medium leading-relaxed">أفضل عروض الأسعار مع خصومات حصرية لمستخدمي التطبيق على الحجوزات المتكررة.</p>
            </div>
          </div>
        </div>
        {/* Diagonal Cut Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-neutral-950" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}></div>
      </section>

      {/* Pitches Grid */}
      <section className="py-24 bg-neutral-950">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-5xl font-black text-white mb-4">أبرز <span className="text-emerald-500">الملاعب</span></h2>
              <p className="text-xl text-neutral-400 font-medium">ملاعب مجهزة بأعلى المستويات بانتظار إبداعك</p>
            </div>
            <button className="text-emerald-400 font-bold hover:text-emerald-300 flex items-center gap-2 text-lg group">
              عرض كل الملاعب
              <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'ملعب الأبطال', location: 'مدينة نصر', price: '200', rating: '4.9', type: 'خماسي' },
              { name: 'ملعب النجوم', location: 'المعادي', price: '250', rating: '4.8', type: 'سداسي' },
              { name: 'كابيتال أرينا', location: 'التجمع الخامس', price: '300', rating: '5.0', type: 'خماسي' },
              { name: 'ملعب الكلاسيكو', location: 'الشيخ زايد', price: '220', rating: '4.7', type: 'سباعي' },
            ].map((pitch, i) => (
              <div key={i} className="group bg-neutral-900 relative overflow-hidden border border-neutral-800 hover:border-emerald-500/50 transition-all">
                <div className="absolute top-4 right-4 z-20 bg-neutral-950 text-emerald-400 font-black px-3 py-1 text-sm border border-emerald-500/30 transform -skew-x-12">
                  <span className="block transform skew-x-12">{pitch.type}</span>
                </div>
                <div className="h-48 bg-neutral-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-900/20 mix-blend-overlay group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src="/__mockup/images/player-action.png" 
                    alt={pitch.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 relative">
                  <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  <h3 className="text-2xl font-black text-white mb-2">{pitch.name}</h3>
                  <div className="flex items-center gap-2 text-neutral-400 font-medium mb-4">
                    <MapPin className="w-4 h-4" />
                    {pitch.location}
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-800">
                    <div className="font-black text-2xl text-emerald-400">{pitch.price} <span className="text-sm text-neutral-500 font-medium">ج.م / ساعة</span></div>
                    <div className="flex items-center gap-1 font-bold text-white">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      {pitch.rating}
                    </div>
                  </div>
                  <button className="w-full mt-6 bg-neutral-800 hover:bg-emerald-500 text-white hover:text-neutral-950 font-black py-4 transform -skew-x-12 transition-colors">
                    <span className="block transform skew-x-12">احجز الآن</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - Playbook */}
      <section className="py-24 bg-neutral-900 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-[800px] bg-emerald-900/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-6">خطة <span className="text-emerald-500">اللعب</span></h2>
            <p className="text-xl text-neutral-400 font-medium">3 خطوات فقط تفصلك عن أرض الملعب</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent border-dashed border-t-2 border-emerald-500/30" />
            
            {[
              { num: '01', title: 'ابحث عن ملعب', desc: 'تصفح الملاعب المتاحة في منطقتك وقارن بينها بسهولة.' },
              { num: '02', title: 'اختر الموعد', desc: 'حدد الوقت المناسب لك ولفريقك من المواعيد المتاحة.' },
              { num: '03', title: 'احجز وانطلق', desc: 'ادفع بأمان عبر التطبيق واستعد للمباراة.' },
            ].map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="w-24 h-24 mx-auto bg-neutral-950 border-4 border-emerald-500 text-emerald-500 flex items-center justify-center text-4xl font-black transform -skew-x-12 mb-8 relative z-10 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <span className="block transform skew-x-12">{step.num}</span>
                </div>
                <h3 className="text-3xl font-black text-white mb-4">{step.title}</h3>
                <p className="text-lg text-neutral-400 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0idHJhbnNwYXJlbnQiPjwvcmVjdD4KPHBhdGggZD0iTTAgNDBMNDAgMEgwTDQwIDQwWk00MCA0MEwwIDBWMDBMMCA0MFoiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20 mix-blend-overlay" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-6xl md:text-7xl font-black text-neutral-950 mb-8 tracking-tighter">
            جاهز لتحدي جديد؟
          </h2>
          <p className="text-2xl text-neutral-900 font-bold mb-12 max-w-2xl mx-auto">
            انضم لآلاف اللاعبين واحجز ملعبك الآن. الكورة في ملعبك.
          </p>
          <button className="bg-neutral-950 hover:bg-neutral-800 text-emerald-400 font-black px-12 py-6 text-xl transform -skew-x-12 transition-all hover:scale-105 shadow-2xl">
            <span className="flex items-center justify-center gap-3 transform skew-x-12">
              حمل التطبيق الآن
              <Zap className="w-6 h-6 fill-current" />
            </span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 py-16 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-emerald-500 transform -skew-x-12 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-neutral-950 fill-neutral-950" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-white">ملعبي</span>
              </div>
              <p className="text-neutral-400 font-medium max-w-md leading-relaxed">
                المنصة الأولى لحجز ملاعب كرة القدم في مصر. نربط اللاعبين بأفضل الملاعب لضمان تجربة رياضية متكاملة.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-black text-xl mb-6">روابط سريعة</h4>
              <ul className="space-y-4 text-neutral-400 font-medium">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">عن المنصة</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">الملاعب</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">كيف يعمل</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">تواصل معنا</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black text-xl mb-6">قانوني</h4>
              <ul className="space-y-4 text-neutral-400 font-medium">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">الشروط والأحكام</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">سياسة الإلغاء</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 text-center text-neutral-500 font-medium">
            <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} ملعبي</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
