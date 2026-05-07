import React, { useState } from 'react';
import {
  MapPin,
  Star,
  ShieldCheck,
  Zap,
  TrendingUp,
  Menu,
  X,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Trophy,
  Users,
  Play
} from 'lucide-react';

export function DarkGlass() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-emerald-400" />,
      title: 'حجز فوري',
      desc: 'احجز ملعبك بضغطة زر وتأكيد فوري بدون انتظار.'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
      title: 'حجز آمن',
      desc: 'دفع إلكتروني آمن وموثوق مع خيارات متعددة.'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
      title: 'أسعار تنافسية',
      desc: 'أفضل الأسعار مع عروض وخصومات مستمرة.'
    }
  ];

  const pitches = [
    {
      id: 1,
      name: 'أرينا بلس',
      location: 'التجمع الخامس، القاهرة',
      price: '250',
      rating: 4.8,
      reviews: 120,
      image: '/__mockup/images/pitch-card.png',
      amenities: ['موقف سيارات', 'غرف تبديل', 'إضاءة ليلية']
    },
    {
      id: 2,
      name: 'كابتن سبورتس',
      location: 'مدينة نصر، القاهرة',
      price: '200',
      rating: 4.5,
      reviews: 85,
      image: '/__mockup/images/pitch-card.png',
      amenities: ['كافيتريا', 'إضاءة ليلية']
    },
    {
      id: 3,
      name: 'جولدن كيك',
      location: 'المعادي، القاهرة',
      price: '300',
      rating: 4.9,
      reviews: 210,
      image: '/__mockup/images/pitch-card.png',
      amenities: ['موقف سيارات', 'غرف تبديل', 'كافيتريا']
    },
    {
      id: 4,
      name: 'ملعب النجوم',
      location: 'الشيخ زايد، الجيزة',
      price: '280',
      rating: 4.7,
      reviews: 150,
      image: '/__mockup/images/pitch-card.png',
      amenities: ['موقف سيارات', 'إضاءة ليلية']
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'اختر الملعب',
      desc: 'تصفح الملاعب المتاحة وقارن بينها لاختيار الأنسب لك.'
    },
    {
      number: '02',
      title: 'حدد الموعد',
      desc: 'اختر التاريخ والوقت المناسبين من جدول المواعيد المتاحة.'
    },
    {
      number: '03',
      title: 'أكد الحجز',
      desc: 'ادفع بأمان عبر منصتنا واستلم تأكيد الحجز فوراً.'
    }
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0f0d] text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a0f0d]/80 backdrop-blur-lg border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-l from-white to-white/70">
              ملعبي
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">الرئيسية</a>
            <a href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">الملاعب</a>
            <a href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">المميزات</a>
            <a href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">تواصل معنا</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm font-medium text-white hover:text-emerald-400 transition-colors px-4 py-2">
              تسجيل الدخول
            </button>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 transform hover:-translate-y-0.5">
              احجز الآن
            </button>
          </div>

          <button className="md:hidden text-white/70 hover:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-300">أكثر من 50 ملعب متاح الآن</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
                احجز ملعبك <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-emerald-200">بكل سهولة</span>
              </h1>
              
              <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                المنصة الأولى في مصر لحجز ملاعب كرة القدم. اكتشف أفضل الملاعب القريبة منك، قارن الأسعار، واحجز في ثوانٍ معدودة.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg px-8 py-4 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                  تصفح الملاعب
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-medium text-lg px-8 py-4 rounded-full backdrop-blur-md border border-white/10 transition-all duration-300 flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  كيف يعمل؟
                </button>
              </div>
            </div>

            <div className="flex-1 relative w-full">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent blur-[80px] rounded-full" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/3] group">
                <div className="absolute inset-0 bg-emerald-900/40 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700 z-10" />
                <img 
                  src="/__mockup/images/dark-stadium.png" 
                  alt="Stadium" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -bottom-8 -right-8 bg-[#0a0f0d]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">البطولات</p>
                    <p className="font-bold text-lg">15+ بطولة أسبوعياً</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02] relative z-10 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-x-reverse divide-white/5">
            <div className="text-center">
              <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2">50+</h3>
              <p className="text-sm text-white/60 font-medium">ملعب متاح</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2">10K+</h3>
              <p className="text-sm text-white/60 font-medium">حجز ناجح</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2">5K+</h3>
              <p className="text-sm text-white/60 font-medium">عميل سعيد</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="flex items-center gap-1 mb-2">
                <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">4.8</h3>
                <Star className="w-6 h-6 text-emerald-400 fill-emerald-400 mb-2" />
              </div>
              <p className="text-sm text-white/60 font-medium">متوسط التقييم</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">لماذا تختار <span className="text-emerald-400">ملعبي؟</span></h2>
            <p className="text-white/60">نقدم لك تجربة حجز سلسة ومتكاملة تلبي كافة احتياجاتك الرياضية</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:bg-white/[0.05] transition-colors group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 relative z-10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 relative z-10">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed relative z-10">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pitches Grid */}
      <section className="py-24 bg-[#0d1a13]/30 border-y border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">أشهر الملاعب</h2>
              <p className="text-white/60">استكشف أفضل الملاعب تقييماً في منطقتحك</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              عرض الكل
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pitches.map((pitch) => (
              <div key={pitch.id} className="group bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:bg-white/[0.04] transition-all duration-300 hover:border-white/10 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d] to-transparent z-10 opacity-60" />
                  <img src={pitch.image} alt={pitch.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  
                  <div className="absolute top-4 right-4 z-20 bg-[#0a0f0d]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    <span className="text-sm font-bold">{pitch.rating}</span>
                    <span className="text-xs text-white/50">({pitch.reviews})</span>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 z-20">
                    <div className="bg-emerald-500 text-black font-bold px-3 py-1.5 rounded-lg text-sm shadow-lg">
                      {pitch.price} ج.م / ساعة
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 text-white group-hover:text-emerald-400 transition-colors">{pitch.name}</h3>
                  <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    {pitch.location}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {pitch.amenities.map((amenity, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-white/5 rounded-md text-white/70">
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <button className="w-full bg-white/5 hover:bg-emerald-500 hover:text-black border border-white/10 hover:border-emerald-500 text-white font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    احجز الآن
                    <ArrowLeft className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="md:hidden w-full mt-8 bg-white/5 border border-white/10 text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2">
            عرض كل الملاعب
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">كيف يعمل <span className="text-emerald-400">ملعبي؟</span></h2>
            <p className="text-white/60">خطوات بسيطة تفصلك عن مباراة لا تُنسى</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent -z-10" />

            {steps.map((step, idx) => (
              <div key={idx} className="relative text-center group">
                <div className="w-24 h-24 mx-auto bg-[#0a0f0d] border border-white/10 rounded-3xl flex items-center justify-center mb-6 relative overflow-hidden group-hover:border-emerald-500/50 transition-colors shadow-2xl">
                  <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-900/50">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/50 leading-relaxed max-w-sm mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-emerald-900/20 border border-emerald-500/20">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/30 blur-[120px] rounded-full mix-blend-screen" />
            
            <div className="relative z-10 px-6 py-20 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">جاهز لبدء المباراة؟</h2>
              <p className="text-lg text-emerald-100/70 mb-10">
                انضم لآلاف اللاعبين الذين يثقون في ملعبي لحجز مبارياتهم. سجل الآن واحصل على خصم 20% على حجزك الأول.
              </p>
              <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg px-10 py-4 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all transform hover:-translate-y-1">
                سجل حساب جديد مجاناً
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050806] pt-20 pb-10 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-black" />
                </div>
                <span className="text-2xl font-bold text-white">ملعبي</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                المنصة الرائدة لحجز ملاعب كرة القدم في مصر. نهدف لتسهيل ممارسة الرياضة وتوفير تجربة حجز سلسة وآمنة.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-white">روابط سريعة</h4>
              <ul className="space-y-4 text-white/50 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">عن المنصة</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">الملاعب المتاحة</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">البطولات</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">الأسئلة الشائعة</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-white">قانوني</h4>
              <ul className="space-y-4 text-white/50 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">الشروط والأحكام</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">سياسة الإلغاء</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-white">تواصل معنا</h4>
              <ul className="space-y-4 text-white/50 text-sm">
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-400" /> القاهرة، مصر</li>
                <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-400" /> دعم 24/7</li>
                <li><a href="mailto:support@malaby.com" className="hover:text-emerald-400 transition-colors">support@malaby.com</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
            <p>جميع الحقوق محفوظة © {new Date().getFullYear()} ملعبي</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-emerald-400 transition-colors">تويتر</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">انستجرام</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">فيسبوك</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
