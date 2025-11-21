import { api } from './api';

export interface Event {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  price: number;
  accessibility?: string;
  image?: string;
  image_url?: string;
  category: number;
  category_name?: string;
  organizer?: number;
  organizer_name?: string;
  content_type: number;
  object_id: number;
  location_type?: string;
  location_name?: string;
  created_at?: string;
  updated_at?: string;
  is_free?: boolean;
}

export interface CreateEventData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  price: number;
  accessibility?: string;
  image?: File | string;
  category: number;
  content_type: number;
  object_id: number;
}

export interface Category {
  id: number;
  name: string;
  item_type: string;
}

export const eventsService = {
  async getEvents(params?: {
    filter?: 'all' | 'upcoming' | 'past' | 'today';
    price_filter?: 'free' | 'paid';
    search?: string;
    category?: number;
  }): Promise<Event[]> {
    const response = await api.get('/events/', { params });
    return response.data.results || response.data;
  },

  async getEventById(id: number): Promise<Event> {
    const response = await api.get(`/events/${id}/`);
    return response.data;
  },

  async createEvent(data: CreateEventData): Promise<Event> {
    const response = await api.post('/events/', data);
    return response.data;
  },

  async updateEvent(id: number, data: Partial<CreateEventData>): Promise<Event> {
    const response = await api.patch(`/events/${id}/`, data);
    return response.data;
  },

  async deleteEvent(id: number): Promise<void> {
    await api.delete(`/events/${id}/`);
  },

  async getMyEvents(): Promise<Event[]> {
    const response = await api.get('/events/my_events/');
    return response.data;
  },

  async getFeaturedEvents(): Promise<Event[]> {
    const response = await api.get('/events/featured/');
    return response.data;
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories/', {
      params: { item_type: 'event' }
    });
    return response.data.results || response.data;
  }
};
