import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Clock, Zap, Star, MapPin, ChevronDown } from 'lucide-react';
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
      icon: <Clock className="h-8 w-8 text-emerald-600" />,
      title: 'حجز فوري',
      description: 'احجز ملعبك في دقائق معدودة بدون انتظار'
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-600" />,
      title: 'حجز آمن',
      description: 'نظام حجز موثوق يمنع تضارب المواعيد'
    },
    {
      icon: <Zap className="h-8 w-8 text-emerald-600" />,
      title: 'أسعار تنافسية',
      description: 'أفضل الأسعار مع خيارات متعددة تناسب الجميع'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm">أفضل منصة لحجز الملاعب في مصر</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              احجز ملعبك
              <span className="block text-emerald-400">بكل سهولة</span>
            </h1>
            
            <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto mb-10 leading-relaxed">
              منصة ملعبي توفر لك أفضل الملاعب بأفضل الأسعار. 
              احجز موعدك الآن واستمتع بمباراة لا تُنسى مع أصدقائك.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/pitches"
                className="flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl"
              >
                استعرض الملاعب
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 text-white hover:text-emerald-200 font-medium py-4 px-8 transition-colors"
              >
                اعرف المزيد
                <ChevronDown className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { label: 'ملعب', value: '50+' },
              { label: 'حجز ناجح', value: '10K+' },
              { label: 'عميل سعيد', value: '5K+' },
              { label: 'تقييم', value: '4.8' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-400">{stat.value}</div>
                <div className="text-emerald-200 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">لماذا تختار ملعبي؟</h2>
            <p className="text-gray-500 max-w-xl mx-auto">نقدم لك تجربة حجز سلسة مع مميزات متعددة تجعلنا الخيار الأمثل</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pitches Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">أفضل الملاعب</h2>
              <p className="text-gray-500">اختر من مجموعة متنوعة من أفضل الملاعب</p>
            </div>
            <Link
              to="/pitches"
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mt-4 md:mt-0"
            >
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-56 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pitches?.slice(0, 4).map((pitch) => (
                <PitchCard key={pitch._id} pitch={pitch} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">كيف يعمل؟</h2>
            <p className="text-gray-500 max-w-xl mx-auto">ثلاث خطوات بسيطة لحجز ملعبك</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'اختر الملعب',
                description: 'تصفح مجموعتنا المتنوعة من الملاعب واختر ما يناسبك'
              },
              {
                step: '02',
                title: 'حدد الموعد',
                description: 'اختر اليوم والوقت المناسب لك من المواعيد المتاحة'
              },
              {
                step: '03',
                title: 'أكد الحجز',
                description: 'أدخل بياناتك وقم بالتحويل لتأكيد حجزك مباشرة'
              }
            ].map((item, index) => (
              <div key={item.step} className="relative text-center">
                <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 rotate-3 hover:rotate-0 transition-transform">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-0 w-full">
                    <div className="w-24 h-0.5 bg-emerald-200 mx-auto -mr-32" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-10 md:p-16 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              جاهز لحجز ملعبك؟
            </h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
              لا تنتظر أكثر، احجز ملعبك الآن واستمتع بأفضل تجربة كرة قدم
            </p>
            <Link
              to="/pitches"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              احجز الآن
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
