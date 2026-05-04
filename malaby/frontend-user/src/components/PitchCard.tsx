import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, ArrowLeft } from 'lucide-react';
import type { Pitch } from '@/types';

interface PitchCardProps {
  pitch: Pitch;
}

export default function PitchCard({ pitch }: PitchCardProps) {
  return (
    <div className="card group">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={pitch.images[0]}
          alt={pitch.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-semibold">{pitch.rating}</span>
        </div>
        <div className="absolute bottom-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {pitch.pricePerHour} ج.م/ساعة
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{pitch.name}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{pitch.description}</p>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <MapPin className="h-4 w-4 text-emerald-600" />
          <span>{pitch.location}</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {pitch.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full"
            >
              {amenity}
            </span>
          ))}
          {pitch.amenities.length > 3 && (
            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
              +{pitch.amenities.length - 3}
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          to={`/pitches/${pitch._id}`}
          className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-medium transition-colors"
        >
          <Clock className="h-4 w-4" />
          احجز الآن
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
