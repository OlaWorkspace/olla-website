// components/onboarding/OpeningHoursInput.tsx
'use client';

import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface DayHours {
  day: string;
  dayFr: string;
  open: string;
  close: string;
  closed: boolean;
}

interface OpeningHoursInputProps {
  value: any;
  onChange: (hours: any) => void;
  disabled?: boolean;
}

const DEFAULT_HOURS: DayHours[] = [
  { day: 'monday', dayFr: 'Lundi', open: '09:00', close: '18:00', closed: false },
  { day: 'tuesday', dayFr: 'Mardi', open: '09:00', close: '18:00', closed: false },
  { day: 'wednesday', dayFr: 'Mercredi', open: '09:00', close: '18:00', closed: false },
  { day: 'thursday', dayFr: 'Jeudi', open: '09:00', close: '18:00', closed: false },
  { day: 'friday', dayFr: 'Vendredi', open: '09:00', close: '18:00', closed: false },
  { day: 'saturday', dayFr: 'Samedi', open: '09:00', close: '18:00', closed: true },
  { day: 'sunday', dayFr: 'Dimanche', open: '09:00', close: '18:00', closed: true },
];

export default function OpeningHoursInput({ value, onChange, disabled }: OpeningHoursInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hours, setHours] = useState<DayHours[]>(() => {
    // Si on a déjà des horaires, les parser
    if (value && value.weekday_text) {
      // Parser les horaires existants
      return DEFAULT_HOURS.map((day, index) => {
        const text = value.weekday_text[index];
        if (text.includes('Fermé')) {
          return { ...day, closed: true };
        }
        const match = text.match(/(\d{2}:\d{2})–(\d{2}:\d{2})/);
        if (match) {
          return { ...day, open: match[1], close: match[2], closed: false };
        }
        return day;
      });
    }
    return DEFAULT_HOURS;
  });

  const updateHours = (newHours: DayHours[]) => {
    setHours(newHours);
    // Convertir au format attendu par l'API
    const weekday_text = newHours.map(day => {
      if (day.closed) {
        return `${day.dayFr}: Fermé`;
      }
      return `${day.dayFr}: ${day.open}–${day.close}`;
    });
    onChange({ weekday_text });
  };

  const handleDayToggle = (index: number) => {
    const newHours = [...hours];
    newHours[index].closed = !newHours[index].closed;
    updateHours(newHours);
  };

  const handleTimeChange = (index: number, field: 'open' | 'close', value: string) => {
    const newHours = [...hours];
    newHours[index][field] = value;
    updateHours(newHours);
  };

  const getSummary = () => {
    const openDays = hours.filter(h => !h.closed);
    if (openDays.length === 0) return 'Non configuré';
    if (openDays.length === 7) return 'Ouvert 7j/7';
    return `${openDays.length} jours d'ouverture`;
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={disabled}
        className="w-full flex items-center justify-between px-4 py-3 border border-border rounded-lg hover:bg-gray-50 transition disabled:bg-gray-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-text-light" />
          <span className="text-sm text-text">{getSummary()}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-text-light" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-light" />
        )}
      </button>

      {isExpanded && (
        <div className="border border-border rounded-lg p-4 space-y-3 bg-gray-50">
          {hours.map((day, index) => (
            <div key={day.day} className="flex items-center gap-3">
              <div className="w-24 text-sm font-medium text-text">
                {day.dayFr}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!day.closed}
                  onChange={() => handleDayToggle(index)}
                  disabled={disabled}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary disabled:cursor-not-allowed"
                />
                <span className="text-xs text-text-light">Ouvert</span>
              </label>
              {!day.closed && (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={day.open}
                    onChange={(e) => handleTimeChange(index, 'open', e.target.value)}
                    disabled={disabled}
                    className="px-2 py-1 border border-border rounded text-sm focus:outline-none focus:border-primary disabled:bg-gray-100"
                  />
                  <span className="text-text-light">à</span>
                  <input
                    type="time"
                    value={day.close}
                    onChange={(e) => handleTimeChange(index, 'close', e.target.value)}
                    disabled={disabled}
                    className="px-2 py-1 border border-border rounded text-sm focus:outline-none focus:border-primary disabled:bg-gray-100"
                  />
                </div>
              )}
              {day.closed && (
                <span className="text-sm text-text-light flex-1">Fermé</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
