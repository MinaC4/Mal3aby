import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowLeft, Zap } from 'lucide-react';
import type { Pitch } from '@/types';

interface PitchCardProps {
  pitch: Pitch;
}

export default function PitchCard({ pitch }: PitchCardProps) {
  return (
    <div className="pitch-card group card cursor-pointer">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-200 dark:bg-dark-700">
        <img
          src={pitch.images[0]}
          alt={pitch.name}
          className="pitch-card-img w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Rating */}
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-dark-800/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-bold text-gray-900 dark:text-white">{pitch.rating}</span>
        </div>

        {/* Price */}
        <div className="absolute bottom-3 right-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          {pitch.pricePerHour} ج.م/ساعة
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{pitch.name}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">{pitch.description}</p>

        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs mb-3">
          <MapPin className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
          <span className="line-clamp-1">{pitch.location}</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {pitch.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-medium border border-emerald-100 dark:border-emerald-900/60"
            >
              {amenity}
            </span>
          ))}
          {pitch.amenities.length > 3 && (
            <span className="bg-gray-100 dark:bg-dark-700 text-gray-500 dark:text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-medium">
              +{pitch.amenities.length - 3}
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          to={`/pitches/${pitch._id}`}
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
        >
          <Zap className="h-4 w-4" />
          احجز الآن
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
