// components/onboarding/AddressAutocomplete.tsx
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface AddressSuggestion {
  place_name: string;
  center: [number, number]; // [longitude, latitude]
  text: string;
}

interface AddressAutocompleteProps {
  value: string;
  onSelectAddress: (address: string, latitude: number, longitude: number) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function AddressAutocomplete({
  value,
  onSelectAddress,
  placeholder = 'Ex: 123 Rue de la Paix, 75000 Paris',
  disabled = false
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
          setShowSuggestions(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAddress = useCallback(async (query: string) => {
    // Minimum 3 characters before searching
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=FR&language=fr&limit=5`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.features) {
        setSuggestions(data.features);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Erreur recherche adresse:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    searchAddress(text);
  };

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    const [longitude, latitude] = suggestion.center;

    setInputValue(suggestion.place_name);
    setSuggestions([]);
    setShowSuggestions(false);

    onSelectAddress(suggestion.place_name, latitude, longitude);
  };

  return (
    <div className="relative">
      {/* Input Container */}
      <div className="flex items-center gap-3 px-4 py-3 border border-border rounded-lg focus-within:border-primary transition bg-white">
        <MapPin className="w-5 h-5 text-text-light flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="street-address"
          className="flex-1 bg-transparent outline-none text-text placeholder-text-light disabled:opacity-50"
        />
        {loading && (
          <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.place_name}-${index}`}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition border-b border-border last:border-b-0 flex items-start gap-3"
            >
              <MapPin className="w-4 h-4 text-text-light flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm text-text truncate">{suggestion.place_name}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && suggestions.length === 0 && !loading && inputValue.length >= 3 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg p-3 text-center text-sm text-text-light z-50">
          Aucun résultat trouvé
        </div>
      )}
    </div>
  );
}
