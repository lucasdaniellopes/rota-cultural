import { useState, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import { geocodingService, type NominatimResult } from '@/services/geocoding';
import styles from './AddressSearch.module.css';

export interface AddressSearchProps {
  onLocationSelect: (result: NominatimResult) => void;
  placeholder?: string;
  city?: string;
  className?: string;
  disabled?: boolean;
}

export default function AddressSearch({
  onLocationSelect,
  placeholder = 'Buscar endereço ou lugar...',
  city = 'Patos',
  className = '',
  disabled = false
}: AddressSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchLocations = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const searchResults = await geocodingService.searchTouristPlaces(searchQuery, city);
      setResults(searchResults);
      setShowResults(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  }, [city]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleLocationSelect(results[selectedIndex]);
        } else if (query.trim().length >= 2) {
          searchLocations(query);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleLocationSelect = (result: NominatimResult) => {
    setQuery(result.display_name);
    setShowResults(false);
    setSelectedIndex(-1);
    setResults([]);
    onLocationSelect(result);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    // Delay hiding results to allow click on results
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  const formatResultDisplay = (result: NominatimResult) => {
    const parts = [];

    if (result.address.road) {
      if (result.address.house_number) {
        parts.push(`${result.address.house_number} ${result.address.road}`);
      } else {
        parts.push(result.address.road);
      }
    }

    if (result.address.suburb && result.address.suburb !== result.address.city) {
      parts.push(result.address.suburb);
    }

    if (result.address.city || result.address.town) {
      parts.push(result.address.city || result.address.town);
    }

    if (result.address.state) {
      parts.push(result.address.state);
    }

    return parts.join(', ');
  };

  const getCategoryIcon = (result: NominatimResult) => {
    // Specific icons based on type
    if (result.type === 'restaurant' || result.type === 'fast_food') return '🍽️';
    if (result.type === 'cafe') return '☕';
    if (result.type === 'museum') return '🏛️';
    if (result.type === 'park') return '🌳';
    if (result.type === 'bank') return '🏦';
    if (result.type === 'hospital') return '🏥';
    if (result.type === 'school') return '🏫';
    if (result.type === 'pharmacy') return '💊';
    if (result.type === 'supermarket') return '🛒';
    if (result.type === 'cinema') return '🎬';
    if (result.type === 'theatre') return '🎭';
    if (result.type === 'library') return '📚';

    // General icons based on class
    if (result.class === 'tourism') return '🏛️';
    if (result.class === 'amenity') return '📍';
    if (result.class === 'shop') return '🛍️';
    if (result.class === 'leisure') return '🎯';

    return '📍';
  };

  return (
    <div className={`${styles['address-search-container']} ${className}`}>
      <div className={styles['search-input-wrapper']}>
        <div className={styles['search-input-container']}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={() => query.trim().length >= 2 && setShowResults(true)}
            placeholder={placeholder}
            className={styles['search-input']}
            disabled={disabled}
          />
          {query && (
            <button
              onClick={handleClear}
              className={styles['clear-button']}
              type="button"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {loading && (
          <div className={styles['loading-indicator']}>
            <div className={styles['spinner']}></div>
            Buscando...
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className={styles['results-container']}>
          {results.map((result, index) => (
            <button
              key={`${result.place_id}-${index}`}
              onClick={() => handleLocationSelect(result)}
              className={`${styles['result-item']} ${
                index === selectedIndex ? styles['selected'] : ''
              }`}
              type="button"
            >
              <div className={styles['result-icon']}>
                {getCategoryIcon(result)}
              </div>
              <div className={styles['result-content']}>
                {(result.name || result.address.amenity) && (
                  <div className={styles['result-name']}>
                    {result.name || result.address.amenity}
                  </div>
                )}
                <div className={styles['result-location']}>
                  {formatResultDisplay(result)}
                </div>
                {result.class && (
                  <div className={styles['result-category']}>
                    {result.class} / {result.type}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && !loading && results.length === 0 && query.trim().length >= 2 && (
        <div className={styles['no-results']}>
          <div className={styles['no-results-icon']}>🔍</div>
          <p>Nenhum local encontrado</p>
          <p>Tente usar termos mais específicos</p>
        </div>
      )}
    </div>
  );
}