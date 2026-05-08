import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface SlotData {
  time: string;
  endTime: string;
  isAvailable: boolean;
  conflictsWith: { from: string; to: string }[];
}

interface TimeSlotPickerProps {
  pitchId: string;
  date: string;
  duration: number;
  selected: string;
  onChange: (time: string) => void;
}

function formatTime12(time: string): string {
  const [h] = time.split(':').map(Number);
  const period = h < 12 ? 'ص' : 'م';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:00 ${period}`;
}

export default function TimeSlotPicker({
  pitchId,
  date,
  duration,
  selected,
  onChange,
}: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookedMsg, setBookedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!pitchId || !date) {
      setSlots([]);
      setBookedMsg(null);
      return;
    }
    setLoading(true);
    setBookedMsg(null);
    fetch(`/api/bookings/availability?pitchId=${pitchId}&date=${date}&duration=${duration}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setSlots(res.data.slots);
      })
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [pitchId, date, duration]);

  const handleSlotClick = (slot: SlotData) => {
    if (!slot.isAvailable) {
      const conflicts = slot.conflictsWith
        .map((c) => `${formatTime12(c.from)} - ${formatTime12(c.to)}`)
        .join('، ');
      setBookedMsg(`هذا الميعاد محجوز (${conflicts}) — اختر ميعاداً آخر`);
      return;
    }
    setBookedMsg(null);
    onChange(slot.time);
  };

  if (!date) {
    return (
      <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-4">
        اختر التاريخ أولاً لعرض المواعيد المتاحة
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        جاري تحميل المواعيد...
      </div>
    );
  }

  const available = slots.filter((s) => s.isAvailable).length;
  const booked = slots.filter((s) => !s.isAvailable).length;

  return (
    <div className="space-y-3">
      {/* Stats bar */}
      {slots.length > 0 && (
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            {available} متاح
          </span>
          {booked > 0 && (
            <span className="flex items-center gap-1 text-red-500 dark:text-red-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
              {booked} محجوز
            </span>
          )}
        </div>
      )}

      {/* Conflict message */}
      {bookedMsg && (
        <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-3 text-red-700 dark:text-red-400 text-sm animate-fade-in">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{bookedMsg}</span>
        </div>
      )}

      {/* Slot grid */}
      {slots.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-4">لا توجد مواعيد لهذا اليوم</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map((slot) => {
            const isSelected = selected === slot.time;
            const conflictInfo = slot.conflictsWith.length > 0
              ? slot.conflictsWith.map((c) => `${formatTime12(c.from)} - ${formatTime12(c.to)}`).join('، ')
              : null;

            return (
              <button
                key={slot.time}
                type="button"
                onClick={() => handleSlotClick(slot)}
                title={conflictInfo ? `محجوز: ${conflictInfo}` : `متاح: ${formatTime12(slot.time)} - ${formatTime12(slot.endTime)}`}
                className={`relative px-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border-2 flex flex-col items-center gap-0.5 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-105'
                    : slot.isAvailable
                    ? 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 hover:border-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:scale-105 cursor-pointer'
                    : 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 text-red-400 dark:text-red-500 cursor-pointer'
                }`}
              >
                <span>{formatTime12(slot.time)}</span>
                <span className={`text-[9px] font-medium ${isSelected ? 'text-white/80' : slot.isAvailable ? 'text-emerald-500 dark:text-emerald-500' : 'text-red-400'}`}>
                  {slot.isAvailable ? '✓ متاح' : '✗ محجوز'}
                </span>
                {!slot.isAvailable && conflictInfo && (
                  <span className="text-[8px] text-red-400 dark:text-red-500 leading-tight text-center">
                    {slot.conflictsWith.map((c) => `${formatTime12(c.from)}-${formatTime12(c.to)}`).join(' ')}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px] text-gray-400 dark:text-gray-500 pt-1 border-t border-gray-100 dark:border-dark-600">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700" />
          <span>متاح</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" />
          <span>محجوز</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span>مختار</span>
        </div>
      </div>
    </div>
  );
}
