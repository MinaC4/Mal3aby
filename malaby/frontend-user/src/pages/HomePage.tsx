import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Clock, Zap, Star, Trophy, MapPin, Play } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import type { Pitch } from '@/types';
import PitchCard from '@/components/PitchCard';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { data: pitches, loading } = useApi<Pitch[]>('/pitches');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Clock className="h-8 w-8 text-emerald-400" />,
      title: 'حجز فوري',
      description: 'احجز ملعبك بضغطة زر وتأكيد فوري بدون انتظار'
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-400" />,
      title: 'حجز آمن',
      description: 'دفع إلكتروني آمن وموثوق مع خيارات متعددة'
    },
    {
      icon: <Zap className="h-8 w-8 text-emerald-400" />,
      title: 'أسعار تنافسية',
      description: 'أفضل الأسعار مع عروض وخصومات مستمرة'
    }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-36 pb-24 lg:pt-52 lg:pb-36">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium text-emerald-300">أكثر من 50 ملعب متاح الآن</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-center leading-tight mb-6">
            احجز ملعبك
            <span className="block text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-emerald-200">
              بكل سهولة
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 text-center max-w-2xl mx-auto mb-10 leading-relaxed">
            منصة ملعبي توفر لك أفضل الملاعب بأفضل الأسعار.
            احجز موعدك الآن واستمتع بمباراة لا تُنسى مع أصدقائك.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              to="/pitches"
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 px-8 rounded-full transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: '0 0 30px rgba(16,185,129,0.35)' }}
            >
              استعرض الملاعب
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium py-4 px-8 rounded-full border border-white/10 backdrop-blur-md transition-all duration-300"
            >
              <Play className="h-5 w-5" />
              كيف يعمل؟
            </a>
          </div>

          {/* Stats */}
          <div className={`border-y border-white/5 py-10 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-x-reverse divide-white/5">
              {[
                { label: 'ملعب متاح', value: '50+' },
                { label: 'حجز ناجح', value: '10K+' },
                { label: 'عميل سعيد', value: '5K+' },
                { label: 'متوسط التقييم', value: '4.8', star: true },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                      {stat.value}
                    </span>
                    {stat.star && <Star className="h-5 w-5 text-emerald-400 fill-emerald-400 mb-1" />}
                  </div>
                  <div className="text-white/40 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              لماذا تختار <span className="text-emerald-400">ملعبي؟</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">نقدم لك تجربة حجز سلسة ومتكاملة تلبي كافة احتياجاتك الرياضية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:bg-white/[0.05] transition-all duration-300 relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 relative z-10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 relative z-10">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed relative z-10">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pitches Section */}
      <section className="py-24 bg-[#0d1a13]/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                أشهر <span className="text-emerald-400">الملاعب</span>
              </h2>
              <p className="text-white/50">اختر من مجموعة متنوعة من أفضل الملاعب</p>
            </div>
            <Link
              to="/pitches"
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors group"
            >
              عرض الكل
              <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/[0.03] rounded-3xl overflow-hidden animate-pulse border border-white/5">
                  <div className="h-52 bg-white/5" />
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
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              كيف يعمل <span className="text-emerald-400">ملعبي؟</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">خطوات بسيطة تفصلك عن مباراة لا تُنسى</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

            {[
              { step: '01', title: 'اختر الملعب', description: 'تصفح مجموعتنا المتنوعة من الملاعب واختر ما يناسبك' },
              { step: '02', title: 'حدد الموعد', description: 'اختر اليوم والوقت المناسب لك من المواعيد المتاحة' },
              { step: '03', title: 'أكد الحجز', description: 'أدخل بياناتك وقم بالتحويل لتأكيد حجزك مباشرة' }
            ].map((item, index) => (
              <div key={item.step} className="relative text-center group">
                <div className="w-24 h-24 mx-auto bg-[#0a0f0d] border border-white/10 rounded-3xl flex items-center justify-center mb-6 relative overflow-hidden group-hover:border-emerald-500/50 transition-colors shadow-2xl">
                  <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-700 relative z-10">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/40 leading-relaxed max-w-xs mx-auto">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-emerald-900/20 border border-emerald-500/20 text-center px-6 py-20">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/25 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-700/20 blur-[100px] rounded-full" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                جاهز لحجز ملعبك؟
              </h2>
              <p className="text-emerald-100/60 text-lg mb-10 max-w-xl mx-auto">
                لا تنتظر أكثر، احجز ملعبك الآن واستمتع بأفضل تجربة كرة قدم
              </p>
              <Link
                to="/pitches"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 px-10 rounded-full transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: '0 0 40px rgba(16,185,129,0.4)' }}
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
