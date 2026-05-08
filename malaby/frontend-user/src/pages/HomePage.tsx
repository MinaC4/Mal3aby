import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Clock, Zap, Star, ChevronDown, TrendingUp, Users, Calendar, MapPin } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import type { Pitch } from '@/types';
import PitchCard from '@/components/PitchCard';
import { useEffect, useState } from 'react';

/*
 * Hero image source:
 * Photo by Chaos Soccer Gear on Unsplash
 * URL: https://unsplash.com/photos/football-pitch-aerial-view
 * Direct: https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1920&q=80
 *
 * Features section image:
 * Photo by Vienna Reyes on Unsplash
 * URL: https://unsplash.com/photos/green-football-field-at-nighttime
 * Direct: https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=900&q=80
 */

const HERO_IMAGE = 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1920&q=80';
const NIGHT_PITCH_IMAGE = 'https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=900&q=80';

const sparkData = [40, 65, 45, 80, 55, 90, 70, 95, 60, 85];

function SparkWidget({ label, value, sub, icon: Icon, color, data }: {
  label: string; value: string; sub: string;
  icon: React.ElementType; color: string; data: number[];
}) {
  return (
    <div className="glass-card p-5 hover:-translate-y-1 transition-transform duration-300 cursor-default">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
          <TrendingUp className="h-3 w-3" /> {sub}
        </span>
      </div>
      <div className="text-2xl font-black text-gray-900 dark:text-white mb-0.5">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">{label}</div>
      <div className="flex items-end gap-0.5 h-8">
        {data.map((h, i) => (
          <div
            key={i}
            className="sparkline-bar rounded-t-sm flex-1 min-h-[4px]"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data: pitches, loading } = useApi<Pitch[]>('/pitches');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const features = [
    { icon: Clock, title: 'حجز فوري', description: 'احجز ملعبك في دقائق معدودة بدون انتظار', color: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/40' },
    { icon: Shield, title: 'حجز آمن', description: 'نظام حجز موثوق يمنع تضارب المواعيد', color: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
    { icon: Zap, title: 'أسعار تنافسية', description: 'أفضل الأسعار مع خيارات متعددة تناسب الجميع', color: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/40' },
  ];

  const stats = [
    { label: 'ملعب', value: '50+', icon: MapPin, color: 'bg-teal-500', data: [30,50,40,70,55,80,60,90,75,95] },
    { label: 'حجز ناجح', value: '10K+', icon: Calendar, color: 'bg-emerald-600', data: sparkData },
    { label: 'عميل سعيد', value: '5K+', icon: Users, color: 'bg-blue-500', data: [50,60,45,75,65,85,70,80,88,92] },
    { label: 'تقييم', value: '4.8', icon: Star, color: 'bg-amber-500', data: [70,75,72,80,78,85,82,88,85,90] },
  ];

  return (
    <div className="bg-gray-50 dark:bg-dark-900">

      {/* ═══════════════════════════════════════════════════════
          HERO IMAGE BANNER
          Photo: Chaos Soccer Gear / Unsplash
          https://images.unsplash.com/photo-1529900748604-07564a03e7a6
      ═══════════════════════════════════════════════════════ */}
      <section className="relative h-[92vh] min-h-[600px] overflow-hidden">
        {/* Background pitch photo */}
        <img
          src={HERO_IMAGE}
          alt="ملعب كرة قدم — صورة من Unsplash"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark gradient overlay — stronger in dark mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 dark:from-black/85 dark:via-black/70 dark:to-black" />

        {/* Emerald accent glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Live badge */}
            <div className="inline-flex items-center gap-2.5 hero-glass px-5 py-2.5 rounded-full mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm font-semibold">أفضل منصة لحجز الملاعب في مصر</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white mb-6 leading-none tracking-tight">
              احجز ملعبك
              <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                بكل سهولة
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              منصة ملعبي توفر لك أفضل الملاعب بأفضل الأسعار.
              احجز موعدك الآن واستمتع بمباراة لا تُنسى مع أصدقائك.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/pitches"
                className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-4 px-9 rounded-2xl transition-all duration-200 shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-400/60 hover:-translate-y-1 text-base"
              >
                استعرض الملاعب
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 hero-glass text-white hover:bg-white/15 font-medium py-4 px-8 rounded-2xl transition-all duration-200 text-base"
              >
                اعرف المزيد
                <ChevronDown className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-float">
            <span className="text-white/40 text-xs">مرر للأسفل</span>
            <ChevronDown className="h-5 w-5 text-white/40" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS WIDGETS BAR
      ═══════════════════════════════════════════════════════ */}
      <section className="relative z-10 -mt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {stats.map((stat) => (
              <SparkWidget
                key={stat.label}
                label={stat.label}
                value={stat.value}
                sub="+12%"
                icon={stat.icon}
                color={stat.color}
                data={stat.data}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FEATURES — SPLIT LAYOUT WITH PITCH IMAGE
          Photo: Vienna Reyes / Unsplash
          https://images.unsplash.com/photo-1519766304817-4f37bda74a26
      ═══════════════════════════════════════════════════════ */}
      <section id="features" className="py-24 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: image */}
            <div className="relative order-2 lg:order-1 animate-fade-in">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl dark:shadow-black/60 aspect-[4/3]">
                <img
                  src={NIGHT_PITCH_IMAGE}
                  alt="ملعب ليلي مضاء — صورة من Unsplash"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                {/* Floating badge on the image */}
                <div className="absolute bottom-5 right-5 glass-card px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star className="h-5 w-5 text-white fill-white" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900 dark:text-white">4.8 تقييم</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">من +5000 عميل</div>
                  </div>
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Right: text */}
            <div className="order-1 lg:order-2">
              <span className="inline-block text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
                لماذا نحن؟
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                لماذا تختار{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  ملعبي؟
                </span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
                نقدم لك تجربة حجز سلسة مع مميزات متعددة تجعلنا الخيار الأمثل لك ولأصدقائك
              </p>

              <div className="space-y-5">
                {features.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="group flex items-start gap-4 animate-fade-in-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className={`w-12 h-12 ${feature.bg} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <div className={`w-7 h-7 ${feature.color} rounded-xl flex items-center justify-center`}>
                        <feature.icon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-black text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FEATURED PITCHES
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <span className="inline-block text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                الملاعب
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">أفضل الملاعب</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">اختر من مجموعة متنوعة من أفضل الملاعب</p>
            </div>
            <Link
              to="/pitches"
              className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-950/80 px-4 py-2.5 rounded-xl transition-all mt-4 md:mt-0"
            >
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="h-52 shimmer" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 shimmer rounded-lg w-3/4" />
                    <div className="h-3 shimmer rounded-lg w-full" />
                    <div className="h-3 shimmer rounded-lg w-2/3" />
                    <div className="h-8 shimmer rounded-xl w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pitches?.slice(0, 4).map((pitch, i) => (
                <div key={pitch._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <PitchCard pitch={pitch} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              سهل وسريع
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">كيف يعمل؟</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm">ثلاث خطوات بسيطة لحجز ملعبك</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 right-[16.7%] left-[16.7%] h-px bg-gradient-to-l from-emerald-200 via-emerald-400 to-emerald-200 dark:from-dark-700 dark:via-emerald-700/40 dark:to-dark-700" />
            {[
              { step: '01', title: 'اختر الملعب', description: 'تصفح مجموعتنا المتنوعة من الملاعب واختر ما يناسبك' },
              { step: '02', title: 'حدد الموعد', description: 'اختر اليوم والوقت المناسب لك من المواعيد المتاحة' },
              { step: '03', title: 'أكد الحجز', description: 'أدخل بياناتك وقم بالتحويل لتأكيد حجزك مباشرة' },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center group animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30 group-hover:shadow-emerald-500/50 group-hover:-translate-y-2 transition-all duration-300 rotate-3 group-hover:rotate-0">
                  <span className="text-3xl font-black text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm max-w-xs mx-auto">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-10 md:p-16 text-center text-white overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
                ابدأ الآن
              </span>
              <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">جاهز لحجز ملعبك؟</h2>
              <p className="text-emerald-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                لا تنتظر أكثر، احجز ملعبك الآن واستمتع بأفضل تجربة كرة قدم
              </p>
              <Link
                to="/pitches"
                className="inline-flex items-center gap-2.5 bg-white text-emerald-700 hover:bg-emerald-50 font-black py-4 px-10 rounded-2xl transition-all shadow-2xl hover:shadow-white/20 hover:-translate-y-1 text-base"
              >
                احجز الآن
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
