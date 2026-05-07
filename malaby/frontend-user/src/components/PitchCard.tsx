import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowLeft } from 'lucide-react';
import type { Pitch } from '@/types';

interface PitchCardProps {
  pitch: Pitch;
}

export default function PitchCard({ pitch }: PitchCardProps) {
  return (
    <div className="group bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300"
      style={{ ['--hover-shadow' as string]: '0 0 30px rgba(16,185,129,0.1)' }}>
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d] via-transparent to-transparent z-10 opacity-70" />
        <img
          src={pitch.images[0]}
          alt={pitch.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        {/* Rating badge */}
        <div className="absolute top-3 right-3 z-20 bg-[#0a0f0d]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
          <span className="text-sm font-bold text-white">{pitch.rating}</span>
        </div>
        {/* Price badge */}
        <div className="absolute bottom-3 left-3 z-20">
          <div className="bg-emerald-500 text-black font-bold px-3 py-1.5 rounded-lg text-sm">
            {pitch.pricePerHour} ج.م/ساعة
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
          {pitch.name}
        </h3>
        <p className="text-white/40 text-sm mb-3 line-clamp-2">{pitch.description}</p>

        <div className="flex items-center gap-2 text-white/40 text-sm mb-4">
          <MapPin className="h-4 w-4 text-emerald-500 flex-shrink-0" />
          <span>{pitch.location}</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {pitch.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="bg-white/5 text-white/60 text-xs px-2.5 py-1 rounded-lg border border-white/5"
            >
              {amenity}
            </span>
          ))}
          {pitch.amenities.length > 3 && (
            <span className="bg-white/5 text-white/40 text-xs px-2.5 py-1 rounded-lg border border-white/5">
              +{pitch.amenities.length - 3}
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          to={`/pitches/${pitch._id}`}
          className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-emerald-500 border border-white/10 hover:border-emerald-500 text-white hover:text-black py-3 rounded-xl font-medium transition-all duration-300"
        >
          احجز الآن
          <ArrowLeft className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </Link>
      </div>
    </div>
  );
}
