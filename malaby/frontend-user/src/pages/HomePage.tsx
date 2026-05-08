import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Clock, Zap, Star, ChevronDown, TrendingUp, Users, Calendar, MapPin } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import type { Pitch } from '@/types';
import PitchCard from '@/components/PitchCard';
import { useEffect, useState } from 'react';

const sparkData = [40, 65, 45, 80, 55, 90, 70, 95, 60, 85];

function SparkWidget({ label, value, sub, icon: Icon, color, data }: {
  label: string; value: string; sub: string;
  icon: React.ElementType; color: string; data: number[];
}) {
  return (
    <div className="glass-card p-5 hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="h-4.5 w-4.5 text-white" />
        </div>
        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
          <TrendingUp className="h-3 w-3" /> {sub}
        </span>
      </div>
      <div className="text-2xl font-black text-gray-900 dark:text-white mb-0.5">{value}</div>
      <div className="text-xs text-gray-500 dark:text-slate-400 mb-3">{label}</div>
      {/* Sparkline */}
      <div className="flex items-end gap-0.5 h-8">
        {data.map((h, i) => (
          <div
            key={i}
            className="sparkline-bar rounded-t-sm flex-1"
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
    {
      icon: Clock,
      title: 'حجز فوري',
      description: 'احجز ملعبك في دقائق معدودة بدون انتظار',
      color: 'bg-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: Shield,
      title: 'حجز آمن',
      description: 'نظام حجز موثوق يمنع تضارب المواعيد',
      color: 'bg-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      icon: Zap,
      title: 'أسعار تنافسية',
      description: 'أفضل الأسعار مع خيارات متعددة تناسب الجميع',
      color: 'bg-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
  ];

  const stats = [
    { label: 'ملعب', value: '50+', icon: MapPin, color: 'bg-teal-500', data: [30,50,40,70,55,80,60,90,75,95] },
    { label: 'حجز ناجح', value: '10K+', icon: Calendar, color: 'bg-emerald-600', data: sparkData },
    { label: 'عميل سعيد', value: '5K+', icon: Users, color: 'bg-blue-500', data: [50,60,45,75,65,85,70,80,88,92] },
    { label: 'تقييم', value: '4.8', icon: Star, color: 'bg-amber-500', data: [70,75,72,80,78,85,82,88,85,90] },
  ];

  return (
    <div className="bg-gray-50 dark:bg-dark-900">
      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated mesh blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 hero-glass px-4 py-2 rounded-full mb-8">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">أفضل منصة لحجز الملاعب في مصر</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
              احجز ملعبك
              <span className="block mt-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 bg-clip-text text-transparent">
                بكل سهولة
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              منصة ملعبي توفر لك أفضل الملاعب بأفضل الأسعار.
              احجز موعدك الآن واستمتع بمباراة لا تُنسى مع أصدقائك.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/pitches"
                className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1"
              >
                استعرض الملاعب
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 hero-glass text-white hover:bg-white/15 font-medium py-4 px-8 rounded-2xl transition-all duration-200"
              >
                اعرف المزيد
                <ChevronDown className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Stats Widgets */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
            <path d="M0 80L60 70C120 60 240 40 360 30C480 20 600 20 720 25C840 30 960 40 1080 45C1200 50 1320 50 1380 50L1440 50V80H0Z"
              className="fill-gray-50 dark:fill-dark-900" />
          </svg>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              لماذا نحن؟
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
              لماذا تختار <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">ملعبي؟</span>
            </h2>
            <p className="text-gray-500 dark:text-slate-400 max-w-xl mx-auto">نقدم لك تجربة حجز سلسة مع مميزات متعددة تجعلنا الخيار الأمثل</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group glass-card p-8 text-center hover:-translate-y-2 transition-all duration-300 cursor-default animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-8 h-8 ${feature.color} rounded-xl flex items-center justify-center`}>
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-500 dark:text-slate-400 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PITCHES ===== */}
      <section className="py-24 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <span className="inline-block text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                الملاعب
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">أفضل الملاعب</h2>
              <p className="text-gray-500 dark:text-slate-400 text-sm">اختر من مجموعة متنوعة من أفضل الملاعب</p>
            </div>
            <Link
              to="/pitches"
              className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 px-4 py-2.5 rounded-xl transition-all mt-4 md:mt-0"
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

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              سهل وسريع
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">كيف يعمل؟</h2>
            <p className="text-gray-500 dark:text-slate-400 max-w-xl mx-auto">ثلاث خطوات بسيطة لحجز ملعبك</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 right-[16.7%] left-[16.7%] h-0.5 bg-gradient-to-l from-emerald-200 via-emerald-400 to-emerald-200 dark:from-emerald-900/50 dark:via-emerald-700/50 dark:to-emerald-900/50" />

            {[
              { step: '01', title: 'اختر الملعب', description: 'تصفح مجموعتنا المتنوعة من الملاعب واختر ما يناسبك' },
              { step: '02', title: 'حدد الموعد', description: 'اختر اليوم والوقت المناسب لك من المواعيد المتاحة' },
              { step: '03', title: 'أكد الحجز', description: 'أدخل بياناتك وقم بالتحويل لتأكيد حجزك مباشرة' },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center group animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 group-hover:shadow-emerald-500/50 group-hover:-translate-y-2 transition-all duration-300 rotate-3 group-hover:rotate-0">
                    <span className="text-3xl font-black text-white">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-500 dark:text-slate-400 leading-relaxed text-sm max-w-xs mx-auto">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 bg-white dark:bg-dark-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-10 md:p-16 text-center text-white overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-teal-400/20 rounded-full blur-2xl" />

            <div className="relative z-10">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
                ابدأ الآن
              </span>
              <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                جاهز لحجز ملعبك؟
              </h2>
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
