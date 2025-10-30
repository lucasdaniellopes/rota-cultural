import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

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
  amenity?: string;
  tourism?: string;
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
  bbox?: [string, string, string, string];
  class?: string;
  type?: string;
  name?: string;
  extratags?: Record<string, any>;
  namedetails?: Record<string, any>;
  boundingbox?: [string, string, string, string];
}

export interface ReverseGeocodeResult extends NominatimResult {}

class GeocodingService {
  async search(query: string, limit: number = 10, countryCodes?: string[]): Promise<NominatimResult[]> {
    const params = new URLSearchParams({
      q: query.trim(),
      limit: limit.toString(),
    });

    if (countryCodes && countryCodes.length > 0) {
      params.append('country_codes', countryCodes.join(','));
    }

    const response = await api.get(`/geocoding/search/?${params}`);
    return response.data;
  }

  async reverseGeocode(lat: number, lon: number, zoom: number = 18): Promise<ReverseGeocodeResult | null> {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      zoom: zoom.toString(),
    });

    try {
      const response = await api.get(`/geocoding/reverse/?${params}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async searchTouristPlaces(query: string, city?: string): Promise<NominatimResult[]> {
    const params = new URLSearchParams({
      q: query.trim(),
    });

    if (city) {
      params.append('city', city);
    }

    const response = await api.get(`/geocoding/tourist-search/?${params}`);
    return response.data;
  }

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

  static toLocation(result: NominatimResult): Omit<Location, 'id' | 'description'> {
    return {
      name: result.name || result.display_name.split(',')[0].trim(),
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    };
  }
}

export const geocodingService = new GeocodingService();
export default geocodingService;