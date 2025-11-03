// Nominatim API service for geocoding and reverse geocoding
// Based on OpenStreetMap data

export interface NominatimAddress {
  house_number?: string;
  road?: string;
  suburb?: string;
  city?: string;
  town?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
}

export interface NominatimResult {
  place_id: string;
  osm_type: string;
  osm_id: string;
  display_name: string;
  address: NominatimAddress;
  lat: string;
  lon: string;
  importance?: number;
  bbox?: [string, string, string, string]; // [min_lat, max_lat, min_lon, max_lon]
  class?: string;
  type?: string;
}

export interface ReverseGeocodeResult {
  place_id: string;
  osm_type: string;
  osm_id: string;
  display_name: string;
  address: NominatimAddress;
  lat: string;
  lon: string;
  bbox?: [string, string, string, string];
  class?: string;
  type?: string;
  importance?: number;
}

class NominatimService {
  private readonly baseUrl = 'https://nominatim.openstreetmap.org';
  private readonly user_agent = 'RotaCultural/1.0 (https://github.com/lucasdaniellopes/rota-cultural)';

  /**
   * Search for places by address or name
   */
  async search(query: string, limit: number = 10, countryCodes?: string[]): Promise<NominatimResult[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const params = new URLSearchParams({
        format: 'json',
        q: query.trim(),
        addressdetails: '1',
        limit: limit.toString(),
        extratags: '1',
        namedetails: '1',
      });

      if (countryCodes && countryCodes.length > 0) {
        params.append('countrycodes', countryCodes.join(','));
      }

      const response = await fetch(`${this.baseUrl}/search?${params}`, {
        headers: {
          'User-Agent': this.user_agent,
        },
      });

      if (!response.ok) {
        throw new Error(`Nominatim search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Nominatim search error:', error);
      throw error;
    }
  }

  /**
   * Reverse geocoding: get address from coordinates
   */
  async reverseGeocode(lat: number, lon: number, zoom: number = 18): Promise<ReverseGeocodeResult | null> {
    try {
      const params = new URLSearchParams({
        format: 'json',
        lat: lat.toString(),
        lon: lon.toString(),
        addressdetails: '1',
        zoom: zoom.toString(),
      });

      const response = await fetch(`${this.baseUrl}/reverse?${params}`, {
        headers: {
          'User-Agent': this.user_agent,
        },
      });

      if (!response.ok) {
        throw new Error(`Nominatim reverse geocoding failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data && data.error ? null : data;
    } catch (error) {
      console.error('Nominatim reverse geocoding error:', error);
      return null;
    }
  }

  /**
   * Search for specific types of places (tourism, amenities, etc.)
   */
  async searchByCategory(
    query: string,
    category: string = 'tourism',
    limit: number = 10
  ): Promise<NominatimResult[]> {
    const searchQuery = `${query} [${category}]`;
    return this.search(searchQuery, limit);
  }

  async searchTouristPlaces(query: string, city?: string): Promise<NominatimResult[]> {
    const targetCity = 'Patos, Paraíba';
    let searchQuery = query;

    if (!query.toLowerCase().includes('patos')) {
      searchQuery = `${query}, ${targetCity}`;
    }

    const results = await this.search(searchQuery, 15, ['br']);

    const patosResults = results.filter(result => {
      const address = result.address;
      return (
        address.city === 'Patos' ||
        address.municipality === 'Patos' ||
        address.town === 'Patos' ||
        result.display_name.toLowerCase().includes('patos') ||
        (address.state === 'Paraíba' && (
          address.county?.toLowerCase().includes('patos') ||
          address.state_district?.toLowerCase().includes('patos')
        ))
      );
    });

    return patosResults.slice(0, 10);
  }

  /**
   * Get formatted address from Nominatim result
   */
  static formatAddress(result: NominatimResult | ReverseGeocodeResult): string {
    const { address } = result;

    const parts = [
      address.house_number,
      address.road,
    ].filter(Boolean);

    if (address.suburb && address.suburb !== address.city) {
      parts.push(address.suburb);
    }

    if (address.city || address.town) {
      parts.push(address.city || address.town);
    }

    if (address.state) {
      parts.push(address.state);
    }

    return parts.join(', ') || result.display_name;
  }

  /**
   * Convert Nominatim result to Location format (for compatibility with existing API)
   */
  static toLocation(result: NominatimResult): Omit<Location, 'id' | 'description'> {
    return {
      name: result.display_name.split(',')[0].trim(),
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      // Additional fields could be added as needed
    };
  }
}

export const nominatimService = new NominatimService();
export default nominatimService;