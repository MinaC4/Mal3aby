import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Clock, TrendingUp, Star, Trophy, MapPin, Play, Users, Zap, ShieldCheck } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import type { Pitch } from '@/types';
import PitchCard from '@/components/PitchCard';

const STADIUM_IMG = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80';

export default function HomePage() {
  const { data: pitches, loading } = useApi<Pitch[]>('/pitches');

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

  const steps = [
    { number: '01', title: 'اختر الملعب', desc: 'تصفح الملاعب المتاحة وقارن بينها لاختيار الأنسب لك.' },
    { number: '02', title: 'حدد الموعد', desc: 'اختر التاريخ والوقت المناسبين من جدول المواعيد المتاحة.' },
    { number: '03', title: 'أكد الحجز', desc: 'ادفع بأمان عبر منصتنا واستلم تأكيد الحجز فوراً.' }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero ─── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Text side */}
            <div className="flex-1 text-center lg:text-right order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-300">أكثر من 50 ملعب متاح الآن</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
                احجز ملعبك <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-emerald-200">
                  بكل سهولة
                </span>
              </h1>

              <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                المنصة الأولى في مصر لحجز ملاعب كرة القدم. اكتشف أفضل الملاعب القريبة منك، قارن الأسعار، واحجز في ثوانٍ معدودة.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link
                  to="/pitches"
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                  style={{ boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}
                >
                  تصفح الملاعب
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-medium text-lg px-8 py-4 rounded-full backdrop-blur-md border border-white/10 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  كيف يعمل؟
                </a>
              </div>
            </div>

            {/* Image side */}
            <div className="flex-1 relative w-full order-1 lg:order-2">
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent blur-[80px] rounded-full" />

              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/3] group">
                <div className="absolute inset-0 bg-emerald-900/40 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700 z-10" />
                <img
                  src={STADIUM_IMG}
                  alt="ملعب"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d]/60 via-transparent to-transparent z-10" />
              </div>

              {/* Floating widget — Trophy */}
              <div className="absolute -bottom-6 -right-4 lg:-right-8 bg-[#0a0f0d]/85 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">البطولات</p>
                    <p className="font-bold text-base text-white">15+ بطولة أسبوعياً</p>
                  </div>
                </div>
              </div>

              {/* Floating widget — Users */}
              <div className="absolute -top-4 -left-4 lg:-left-8 bg-[#0a0f0d]/85 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">لاعب نشط</p>
                    <p className="font-bold text-base text-white">5,000+</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
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
                <Star className="w-6 h-6 text-emerald-400 fill-emerald-400 mb-1" />
              </div>
              <p className="text-sm text-white/60 font-medium">متوسط التقييم</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              لماذا تختار <span className="text-emerald-400">ملعبي؟</span>
            </h2>
            <p className="text-white/60">نقدم لك تجربة حجز سلسة ومتكاملة تلبي كافة احتياجاتك الرياضية</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:bg-white/[0.05] transition-colors group relative overflow-hidden"
              >
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

      {/* ─── Featured Pitches ─── */}
      <section className="py-24 bg-[#0d1a13]/30 border-y border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">أشهر الملاعب</h2>
              <p className="text-white/60">استكشف أفضل الملاعب تقييماً في منطقتك</p>
            </div>
            <Link
              to="/pitches"
              className="hidden md:flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors group"
            >
              عرض الكل
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/[0.03] rounded-3xl overflow-hidden animate-pulse border border-white/5">
                  <div className="aspect-[4/3] bg-white/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-white/5 rounded-full w-3/4" />
                    <div className="h-3 bg-white/5 rounded-full w-full" />
                    <div className="h-3 bg-white/5 rounded-full w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : pitches && pitches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pitches.slice(0, 4).map((pitch) => (
                <PitchCard key={pitch._id} pitch={pitch} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-white/40">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-emerald-500/30" />
              <p>سيتم إضافة الملاعب قريباً</p>
            </div>
          )}

          <Link
            to="/pitches"
            className="md:hidden w-full mt-8 bg-white/5 border border-white/10 text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2"
          >
            عرض كل الملاعب
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              كيف يعمل <span className="text-emerald-400">ملعبي؟</span>
            </h2>
            <p className="text-white/60">خطوات بسيطة تفصلك عن مباراة لا تُنسى</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
            {steps.map((step, idx) => (
              <div key={idx} className="relative text-center group">
                <div className="w-24 h-24 mx-auto bg-[#0a0f0d] border border-white/10 rounded-3xl flex items-center justify-center mb-6 relative overflow-hidden group-hover:border-emerald-500/50 transition-colors shadow-2xl">
                  <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-900/50 relative z-10">
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

      {/* ─── CTA ─── */}
      <section className="py-20 relative z-10 pb-24">
        <div className="container mx-auto px-6">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-emerald-900/20 border border-emerald-500/20">
            {/* Noise texture */}
            <div
              className="absolute inset-0 opacity-20 mix-blend-overlay"
              style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%221%22/%3E%3C/svg%3E')", backgroundSize: '200px 200px' }}
            />
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-700/20 blur-[80px] rounded-full" />

            <div className="relative z-10 px-6 py-20 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">جاهز لبدء المباراة؟</h2>
              <p className="text-lg text-emerald-100/70 mb-10">
                انضم لآلاف اللاعبين الذين يثقون في ملعبي لحجز مبارياتهم.
                احجز الآن واستمتع بأفضل تجربة كرة قدم.
              </p>
              <Link
                to="/pitches"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg px-10 py-4 rounded-full transition-all hover:-translate-y-1"
                style={{ boxShadow: '0 0 40px rgba(16,185,129,0.4)' }}
              >
                تصفح الملاعب الآن
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
