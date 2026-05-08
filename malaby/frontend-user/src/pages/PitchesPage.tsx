import { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import type { Pitch } from '@/types';
import PitchCard from '@/components/PitchCard';

export default function PitchesPage() {
  const { data: pitches, loading } = useApi<Pitch[]>('/pitches');
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredPitches = pitches?.filter((pitch) => {
    const matchesSearch = !search ||
      pitch.name.toLowerCase().includes(search.toLowerCase()) ||
      pitch.description.toLowerCase().includes(search.toLowerCase());

    const matchesLocation = !location ||
      pitch.location.toLowerCase().includes(location.toLowerCase());

    const matchesPrice = !priceRange || (() => {
      const [min, max] = priceRange.split('-').map(Number);
      return pitch.pricePerHour >= min && pitch.pricePerHour <= max;
    })();

    return matchesSearch && matchesLocation && matchesPrice;
  });

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setPriceRange('');
  };

  const hasFilters = search || location || priceRange;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-dark-900 to-teal-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="inline-block text-xs font-bold text-emerald-400 bg-emerald-900/40 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            استكشف
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">الملاعب</h1>
          <p className="text-gray-400">اكتشف مجموعتنا المتنوعة من الملاعب واختر ما يناسبك</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن ملعب..."
                className="input-field pr-10"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-semibold text-sm transition-all duration-200 ${
                showFilters
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                  : 'bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-500 text-gray-600 dark:text-gray-400 hover:border-emerald-400 hover:text-emerald-600'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              فلترة
            </button>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold text-sm transition-all"
              >
                <X className="h-4 w-4" />
                مسح
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-3 glass-card p-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    الموقع
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="ابحث بالموقع..."
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    نطاق السعر
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="input-field"
                  >
                    <option value="">كل الأسعار</option>
                    <option value="0-200">أقل من 200 ج.م</option>
                    <option value="200-300">200 - 300 ج.م</option>
                    <option value="300-400">300 - 400 ج.م</option>
                    <option value="400-999">أكثر من 400 ج.م</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-bold text-gray-900 dark:text-white">{filteredPitches?.length || 0}</span> ملعب متاح
            </p>
          </div>
        )}

        {/* Pitches Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
        ) : filteredPitches?.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 dark:bg-dark-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">لا توجد نتائج</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">جرب تغيير معايير البحث أو الفلترة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPitches?.map((pitch, i) => (
              <div key={pitch._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <PitchCard pitch={pitch} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
