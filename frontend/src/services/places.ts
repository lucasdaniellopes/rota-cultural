import { api } from './api';

export interface Address {
  id: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
}

export interface TouristSpot {
  id: number;
  name: string;
  description: string;
  opening_time: string;
  closing_time: string;
  accessibility?: string;
  address: Address;
  category: number;
  category_name?: string;
  image_url?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
  organizer?: number;
}

export interface TouristSpotListItem {
  id: number;
  name: string;
  description: string;
  location?: string;
  category_name?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
}

export interface Establishment {
  id: number;
  name: string;
  description: string;
  opening_time: string;
  closing_time: string;
  accessibility?: string;
  address: Address;
  category: number;
  category_name?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  item_type: string;
}

export const placesService = {
  async getTouristSpots(params?: {
    search?: string;
    category?: number;
    city?: string;
  }): Promise<TouristSpotListItem[]> {
    const response = await api.get('/tourist-spots/', { params });
    return response.data.results || response.data;
  },

  async getTouristSpotById(id: number): Promise<TouristSpot> {
    const response = await api.get(`/tourist-spots/${id}/`);
    return response.data;
  },

  async getFeaturedTouristSpots(): Promise<TouristSpotListItem[]> {
    const response = await api.get('/tourist-spots/featured/');
    return response.data;
  },

  async createTouristSpot(data: FormData): Promise<TouristSpot> {
    const response = await api.post('/tourist-spots/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async updateTouristSpot(id: number, data: FormData): Promise<TouristSpot> {
    const response = await api.patch(`/tourist-spots/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async deleteTouristSpot(id: number): Promise<void> {
    await api.delete(`/tourist-spots/${id}/`);
  },

  async getTouristSpotsByCity(city: string): Promise<TouristSpotListItem[]> {
    const response = await api.get('/tourist-spots/by_city/', {
      params: { city }
    });
    return response.data;
  },

  async getEstablishments(params?: {
    search?: string;
    category?: number;
    city?: string;
  }): Promise<Establishment[]> {
    const response = await api.get('/establishments/', { params });
    return response.data.results || response.data;
  },

  async getEstablishmentById(id: number): Promise<Establishment> {
    const response = await api.get(`/establishments/${id}/`);
    return response.data;
  },

  async getFeaturedEstablishments(): Promise<Establishment[]> {
    const response = await api.get('/establishments/featured/');
    return response.data;
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories/', {
      params: { item_type: 'tourist_spot' }
    });
    return response.data.results || response.data;
  }
};
