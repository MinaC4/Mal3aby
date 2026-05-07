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
    <div className="min-h-screen pt-24">
      {/* Header */}
      <div className="border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-bold text-white mb-2">الملاعب</h1>
          <p className="text-white/40">اكتشف مجموعتنا المتنوعة من الملاعب واختر ما يناسبك</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filters */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن ملعب..."
                className="w-full pr-12 pl-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all backdrop-blur-sm"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border font-medium transition-all ${
                showFilters
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
              فلترة
            </button>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/10 font-medium transition-all"
              >
                <X className="h-4 w-4" />
                مسح
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    الموقع
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="ابحث بالموقع..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-emerald-500/50 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-white/60 mb-2 block">
                    نطاق السعر
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-emerald-500/50 outline-none transition-all"
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
          <p className="text-white/40 mb-6 text-sm">
            {filteredPitches?.length || 0} ملعب متاح
          </p>
        )}

        {/* Pitches Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
        ) : filteredPitches?.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <Search className="h-8 w-8 text-white/20" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">لا توجد نتائج</h3>
            <p className="text-white/40">جرب تغيير معايير البحث أو الفلترة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPitches?.map((pitch) => (
              <PitchCard key={pitch._id} pitch={pitch} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
