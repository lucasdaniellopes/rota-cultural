import { api } from './api';

export interface Favorite {
  id: number;
  favoritable_type: 'event' | 'touristspot' | 'establishment';
  favoritable_name: string;
  object_id: number;
  created_at: string;
}

export interface FavoriteCreate {
  content_type: number;
  object_id: number;
}

export const favoritesService = {
  async getFavorites(): Promise<Favorite[]> {
    const response = await api.get('/favorites/');
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  },

  async getFavoritesByType(contentType: string): Promise<Favorite[]> {
    const response = await api.get(`/favorites/by-type/${contentType}/`);
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  },

  async addFavorite(contentTypeId: number, objectId: number): Promise<Favorite> {
    const response = await api.post('/favorites/', {
      content_type: contentTypeId,
      object_id: objectId,
    });
    return response.data;
  },

  async removeFavorite(favoriteId: number): Promise<void> {
    await api.delete(`/favorites/${favoriteId}/`);
  },

  async checkFavorite(contentTypeId: number, objectId: number): Promise<boolean> {
    const response = await api.post('/favorites/check-favorite/', {
      content_type: contentTypeId,
      object_id: objectId,
    });
    return response.data.is_favorite;
  },

  async getContentTypeId(model: string): Promise<number> {
    const response = await api.get(`/contenttypes/?model=${model}`);
    const data = Array.isArray(response.data) ? response.data : response.data.results || [];
    return data[0]?.id || 0;
  },
};

export default favoritesService;
